// Gera o resumo em Markdown da execução a partir do relatório JSON do Playwright.
// Uso: node scripts/summary.mjs playwright-report/results.json >> "$GITHUB_STEP_SUMMARY"
import fs from 'node:fs';

const file = process.argv[2] ?? 'playwright-report/results.json';
if (!fs.existsSync(file)) {
  console.log('## Testes E2E\n\n⚠️ O relatório não foi gerado: a execução parou antes de rodar os testes.');
  process.exit(0);
}
const report = JSON.parse(fs.readFileSync(file, 'utf8'));

// O resumo é público: nenhum valor de secret pode aparecer nele.
const secrets = [process.env.PLAYGROUND_KEY, process.env.TEST_PASSWORD].filter(Boolean);
const redact = s => secrets.reduce((t, v) => t.split(v).join('***'), s);
const clean = s => redact(String(s ?? '').replace(/\u001b\[[0-9;]*m/g, '')); // remove cores do terminal
const cell = s => clean(s).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const secs = ms => `${(ms / 1000).toFixed(1)} s`;

const LABEL = { unexpected: '❌ Falhou', flaky: '⚠️ Instável', expected: '✅ Passou', skipped: '⏭️ Pulado' };
const ORDER = Object.keys(LABEL);

const rows = [];
(function walk(suites = []) {
  for (const suite of suites) {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        const results = test.results ?? [];
        const last = results.at(-1);
        rows.push({
          title: spec.title,
          file: `${spec.file}:${spec.line}`,
          status: test.status,
          ms: results.reduce((t, r) => t + (r.duration ?? 0), 0),
          error: last?.error?.message ?? last?.errors?.[0]?.message ?? ''
        });
      }
    }
    walk(suite.suites);
  }
})(report.suites);

rows.sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status) || a.title.localeCompare(b.title));

const s = report.stats ?? {};
const out = [
  '## Testes E2E',
  '',
  '| ✅ Passaram | ❌ Falharam | ⚠️ Instáveis | ⏭️ Pulados | ⏱️ Duração |',
  '|---|---|---|---|---|',
  `| ${s.expected ?? 0} | ${s.unexpected ?? 0} | ${s.flaky ?? 0} | ${s.skipped ?? 0} | ${secs(s.duration ?? 0)} |`,
  '',
  '### Testes',
  '',
  '| Situação | Teste | Arquivo | Duração |',
  '|---|---|---|---|',
  ...rows.map(r => `| ${LABEL[r.status] ?? r.status} | ${cell(r.title)} | \`${cell(r.file)}\` | ${secs(r.ms)} |`)
];

const failed = rows.filter(r => r.status === 'unexpected' && r.error);
if (failed.length) {
  out.push('', '### Falhas', '');
  for (const r of failed) {
    const msg = clean(r.error).split('\n').slice(0, 15).join('\n');
    out.push(`<details><summary>${cell(r.title)}</summary>`, '', '```', msg, '```', '', '</details>');
  }
}

console.log(out.join('\n'));