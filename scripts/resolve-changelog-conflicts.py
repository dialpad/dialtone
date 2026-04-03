#!/usr/bin/env python3
"""
Resolve merge conflicts in CHANGELOG.md and CHANGELOG.json files when merging
staging into a prerelease branch (e.g. next, alpha, beta).

Strategy: staging's production releases appear first (newer), followed by the
prerelease branch's unique entries, then the shared older history.

Usage:
  python3 scripts/resolve-changelog-conflicts.py

Run from the repo root while a merge is in progress (conflict markers present).
"""

import json
import os
import re
import subprocess
import sys


REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# JSON files with merge conflicts
JSON_FILES = [
    'CHANGELOG.json',
    'packages/dialtone-css/CHANGELOG.json',
    'packages/dialtone-vue/CHANGELOG.json',
]

# MD files: git path, and a regex matching the first version header common to both branches.
# Update the common_pattern when the fork point changes between merges.
MD_FILES = [
    {
        'git_path': 'CHANGELOG.md',
        'common_pattern': r'^# \[9\.166\.0\]',
    },
    {
        'git_path': 'packages/dialtone-css/CHANGELOG.md',
        'common_pattern': r'^# \[8\.73\.0\]',
    },
    {
        'git_path': 'packages/dialtone-vue/CHANGELOG.md',
        'common_pattern': r'^# \[3\.210\.0\]',
    },
]


def get_git_version(stage, git_path):
    """Get file content from a git merge stage (2=HEAD/ours, 3=theirs/staging)."""
    result = subprocess.run(
        ['git', 'show', f':{stage}:{git_path}'],
        capture_output=True, text=True,
        cwd=REPO_ROOT,
    )
    if result.returncode != 0:
        raise RuntimeError(f'git show :{stage}:{git_path} failed: {result.stderr}')
    return result.stdout


def find_common_version_line(content, version_pattern):
    """Return the line index of the first line matching version_pattern."""
    for i, line in enumerate(content.split('\n')):
        if re.match(version_pattern, line):
            return i
    return None


def strip_trailing_blanks(lines):
    while lines and lines[-1].strip() == '':
        lines = lines[:-1]
    return lines


def resolve_md_file(git_path, common_version_pattern):
    """
    Reconstruct a CHANGELOG.md from the two merge stages.
    Result order: staging_unique + head_unique + common_tail
    """
    head_content = get_git_version(2, git_path)
    staging_content = get_git_version(3, git_path)

    head_lines = head_content.split('\n')
    staging_lines = staging_content.split('\n')

    head_idx = find_common_version_line(head_content, common_version_pattern)
    staging_idx = find_common_version_line(staging_content, common_version_pattern)

    if head_idx is None or staging_idx is None:
        raise RuntimeError(
            f'Could not find common version pattern {common_version_pattern!r} in {git_path}. '
            'Update the common_pattern in MD_FILES to match the current fork point.'
        )

    head_unique = strip_trailing_blanks(head_lines[:head_idx])
    staging_unique = strip_trailing_blanks(staging_lines[:staging_idx])
    common_tail = staging_lines[staging_idx:]

    parts = []
    if staging_unique:
        parts.extend(staging_unique)
        parts.append('')
        parts.append('')
    if head_unique:
        parts.extend(head_unique)
        parts.append('')
        parts.append('')
    parts.extend(common_tail)

    return '\n'.join(parts)


def resolve_json_file(content):
    """
    Resolve a CHANGELOG.json with a single top-level conflict block.
    Merges versions arrays: staging_unique + head_unique + common_shared
    """
    head_match = re.search(r'^<<<<<<< HEAD\n', content, re.MULTILINE)
    sep_match = re.search(r'^=======\n', content, re.MULTILINE)
    staging_match = re.search(r'^>>>>>>> ', content, re.MULTILINE)

    if not head_match or not sep_match or not staging_match:
        return None  # no conflicts

    head_json = json.loads(content[head_match.end():sep_match.start()].strip())
    staging_json = json.loads(content[sep_match.end():staging_match.start()].strip())

    head_versions = head_json['versions']
    staging_versions = staging_json['versions']
    staging_ids = {v['version'] for v in staging_versions}
    head_ids = {v['version'] for v in head_versions}

    merged = (
        [v for v in staging_versions if v['version'] not in head_ids] +
        [v for v in head_versions if v['version'] not in staging_ids] +
        [v for v in staging_versions if v['version'] in head_ids]
    )

    return json.dumps({'versions': merged}, indent=2)


def verify(filepath):
    with open(filepath, encoding='utf-8') as f:
        content = f.read()
    issues = []
    if '<<<<<<< ' in content:
        issues.append('has <<<<<<< markers')
    if '>>>>>>> ' in content:
        issues.append('has >>>>>>> markers')
    if any(l == '=======' for l in content.split('\n')):
        issues.append('has ======= separator')
    if filepath.endswith('.json'):
        try:
            json.loads(content)
        except json.JSONDecodeError as e:
            issues.append(f'invalid JSON: {e}')
    if issues:
        print(f'  FAIL {filepath}: {", ".join(issues)}')
        return False
    print(f'  OK   {filepath}')
    return True


def main():
    print('=== Resolving CHANGELOG conflicts ===\n')
    all_ok = True

    for rel_path in JSON_FILES:
        filepath = os.path.join(REPO_ROOT, rel_path)
        print(f'JSON: {rel_path}')
        with open(filepath, encoding='utf-8') as f:
            content = f.read()
        resolved = resolve_json_file(content)
        if resolved is None:
            print('  no conflicts, skipping')
            continue
        json.loads(resolved)  # sanity check
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(resolved)
        print('  written')

    print()

    for item in MD_FILES:
        git_path = item['git_path']
        filepath = os.path.join(REPO_ROOT, git_path)
        print(f'MD:   {git_path}')
        resolved = resolve_md_file(git_path, item['common_pattern'])
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(resolved)
        print('  written')

    print('\n=== Verifying ===')
    for rel_path in JSON_FILES:
        if not verify(os.path.join(REPO_ROOT, rel_path)):
            all_ok = False
    for item in MD_FILES:
        if not verify(os.path.join(REPO_ROOT, item['git_path'])):
            all_ok = False

    if all_ok:
        print('\nAll files resolved successfully.')
        print('Next: git add CHANGELOG.json CHANGELOG.md packages/*/CHANGELOG.*')
    else:
        print('\nSome files still have issues.')
        sys.exit(1)


if __name__ == '__main__':
    main()
