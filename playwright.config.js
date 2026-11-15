import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const { BASE_URL, PLAYGROUND_KEY, CI } = process.env;
if (!BASE_URL) throw new Error('Defina BASE_URL no arquivo .env (veja o .env.example).');

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: !!CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [['list'], ['github']] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    // A chave do playground vai em todas as requisições do navegador.
    extraHTTPHeaders: PLAYGROUND_KEY ? { 'X-Playground-Key': PLAYGROUND_KEY } : undefined,
    // No CI de um repositório público, rastros e vídeos ficam desligados:
    // eles registram cabeçalhos e o que foi digitado (inclusive senhas).
    trace: CI ? 'off' : 'on-first-retry',
    video: CI ? 'off' : 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
    // Firefox, WebKit e celular entram depois, junto com os testes de qualidade do plano.
  ]
});
