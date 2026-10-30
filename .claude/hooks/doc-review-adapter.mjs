import { readFileSync } from 'node:fs';
import { analyze, formatReport } from '../../scripts/check-doc-review.mjs';

function emit(context) {
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: context } }));
}
try {
  const event = JSON.parse(readFileSync(0, 'utf8'));
  const command = event.tool_input?.command;
  if (event.tool_name === 'Bash' && typeof command === 'string') {
    const parts = command.split(/&&|\|\||[;|\n]/);
    const push = parts.some((part) => !/\bgit\s+stash\s+push\b/.test(part) && /\bgit\s+.*\bpush(?:\s|$)/.test(part));
    const pr = /\bgh\s+.*\bpr\s+create(?:\s|$)/.test(command);
    if (push || pr) {
      const cwd = event.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
      const messages = [];
      for (const options of [
        { base: 'origin/staging', head: 'HEAD', 'merge-base': true },
        { staged: true },
        { worktree: true },
      ]) {
        try {
          const report = analyze(options, cwd);
          if (report.candidates.length || report.unmapped.length || report.outsideBoundary.untracked.length)
            messages.push(formatReport(report));
        } catch (error) {
          messages.push(
            `Documentation review unavailable/error: ${error.message}. No fallback or review completion was inferred.`,
          );
        }
      }
      if (messages.length) {
        const header = 'Repository advisory review uses local origin/staging...HEAD (merge-base), the index and tracked worktree separately. It does not parse command-specific repositories or network state.\n';
        const footer = '\nUse .agents/resources/doc-sync.md to record a current semantic review. Existing task authorization still governs any edits.';
        const marker = '\n[truncated; run scripts/check-doc-review.mjs for the full selected-boundary report]';
        const budget = 9000 - header.length - footer.length;
        const body = messages.join('\n\n');
        emit(header + (body.length > budget ? body.slice(0, budget - marker.length) + marker : body) + footer);
      }
    }
  }
} catch (error) {
  emit(`Documentation review unavailable/error: ${error.message}. Run scripts/check-doc-review.mjs explicitly.`);
}
