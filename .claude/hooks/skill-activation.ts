import * as fs from 'fs';
import * as path from 'path';

interface PromptTriggers {
  keywords: string[];
  intentPatterns: string[];
}

interface SkillRule {
  type: string;
  enforcement: string;
  priority: string;
  description: string;
  promptTriggers: PromptTriggers;
}

interface Scoring {
  keywordWeight: number;
  intentPatternWeight: number;
  activationThreshold: number;
}

interface SkillRules {
  skills: Record<string, SkillRule>;
  scoring: Scoring;
}

interface ScoredSkill {
  name: string;
  score: number;
  rule: SkillRule;
}

const PRIORITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function getStars(score: number): string {
  if (score >= 8) return '\u2605\u2605\u2605';
  if (score >= 5) return '\u2605\u2605\u2606';
  return '\u2605\u2606\u2606';
}

function scoreSkill(prompt: string, rule: SkillRule, scoring: Scoring): number {
  const lowerPrompt = prompt.toLowerCase();
  let score = 0;

  for (const keyword of rule.promptTriggers.keywords) {
    if (lowerPrompt.includes(keyword.toLowerCase())) {
      score += scoring.keywordWeight;
    }
  }

  for (const pattern of rule.promptTriggers.intentPatterns) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(prompt)) {
      score += scoring.intentPatternWeight;
    }
  }

  return score;
}

async function main(): Promise<void> {
  try {
    const input = fs.readFileSync(0, 'utf-8');
    const parsed = JSON.parse(input);
    const userPrompt: string = parsed.user_prompt;

    if (!userPrompt || typeof userPrompt !== 'string') {
      process.exit(0);
    }

    const rulesPath = path.resolve(__dirname, '..', 'skills', 'skill-rules.json');
    const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
    const rules: SkillRules = JSON.parse(rulesContent);

    const { scoring } = rules;
    const scored: ScoredSkill[] = [];

    for (const [name, rule] of Object.entries(rules.skills)) {
      const score = scoreSkill(userPrompt, rule, scoring);
      if (score >= scoring.activationThreshold) {
        scored.push({ name, score, rule });
      }
    }

    if (scored.length === 0) {
      process.exit(0);
    }

    scored.sort((a, b) => {
      const priorityDiff = (PRIORITY_ORDER[a.rule.priority] ?? 99) - (PRIORITY_ORDER[b.rule.priority] ?? 99);
      if (priorityDiff !== 0) return priorityDiff;
      return b.score - a.score;
    });

    const lines: string[] = ['Relevant Dialtone skills detected:', ''];

    for (const skill of scored) {
      const stars = getStars(skill.score);
      lines.push(`${stars} /${skill.name} \u2014 ${skill.rule.description} (${skill.rule.priority} priority)`);
    }

    lines.push('');
    lines.push('Use these skills for guided workflows, or continue working directly.');

    console.log(lines.join('\n'));
  } catch {
    // Silently exit on any error to never block the user
    process.exit(0);
  }
}

main();
