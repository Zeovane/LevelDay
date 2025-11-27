# Instruções de Deploy para GitHub Pages

## Configuração Inicial

1. **Ajuste o nome do repositório no `vite.config.ts`**:
   - Abra o arquivo `vite.config.ts`
   - Encontre a linha: `const REPO_NAME = 'LevelDay'`
   - Substitua `'LevelDay'` pelo nome do seu repositório no GitHub
   - Exemplo: se seu repositório é `usuario/meu-app`, use `'meu-app'`

## Opção 1: Deploy Automático com GitHub Actions (Recomendado)

1. O workflow já está configurado em `.github/workflows/deploy.yml`
2. No GitHub, vá em **Settings** > **Pages**
3. Em **Source**, selecione **GitHub Actions**
4. Faça commit e push das alterações
5. O deploy será feito automaticamente a cada push na branch `main`

## Opção 2: Deploy Manual

1. **Build do projeto**:
   ```bash
   npm run build
   ```

2. **Configure o GitHub Pages**:
   - No GitHub, vá em **Settings** > **Pages**
   - Em **Source**, selecione a branch `main` e a pasta `/dist`
   - Clique em **Save**

3. **Faça o commit e push da pasta `dist`**:
   ```bash
   git add dist
   git commit -m "Deploy para GitHub Pages"
   git push origin main
   ```

## Importante

- Certifique-se de que o nome do repositório no `vite.config.ts` corresponde ao nome real do seu repositório
- Se você mudar o nome do repositório, atualize o `REPO_NAME` no `vite.config.ts`
- Para domínios customizados, você pode alterar o `base` para `'/'` no `vite.config.ts`

