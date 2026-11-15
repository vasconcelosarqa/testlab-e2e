# TestLab E2E

Testes de ponta a ponta (E2E) do TestLab com [Playwright](https://playwright.dev).
Os casos seguem o Plano de Testes Web (versão 1.0.x): cada teste começa com o ID do caso, por exemplo `[WEB-LOGIN-001]`.

## Como rodar

1. Instale Node.js (LTS) e Git.
2. `git clone https://github.com/<usuario>/testlab-e2e.git && cd testlab-e2e`
3. `npm ci && npx playwright install`
4. `cp .env.example .env` e preencha os valores (peça ao responsável pelo projeto; eles nunca vão para o repositório).
5. `npm test`, e depois `npm run test:report` para ver o relatório.

## Comandos

| Comando | O que faz |
|---|---|
| `npm test` | Todos os testes |
| `npm run test:p0` | Só os essenciais (P0) |
| `npm run test:ui` | Modo visual do Playwright |
| `npm run test:report` | Relatório da última execução |

## Como contribuir

1. Escolha no painel do plano um caso ainda não automatizado.
2. Crie uma branch `teste/<id-do-caso>`, escreva o teste com o ID no título e a prioridade nas tags (`@p0`…`@p3`).
3. Abra um pull request citando o ID do caso. Quem escreveu marca "Automatizado" no painel; quem revisou marca "Revisado".

## Segurança

Nunca versione chaves, senhas, o arquivo `.env`, sessões salvas (`.auth/`) ou relatórios (`playwright-report/`, `test-results/`).
