# 🔧 Troubleshooting - Erro 404 no GitHub Pages

## Checklist de Verificação

### 1. ✅ Verificar o Nome do Repositório

**IMPORTANTE**: O nome no `vite.config.ts` DEVE ser exatamente igual ao nome do seu repositório no GitHub.

1. Abra `vite.config.ts`
2. Encontre a linha: `const REPO_NAME = 'LevelDay'`
3. Verifique o nome do seu repositório no GitHub:
   - Vá para: `https://github.com/SEU-USUARIO/NOME-DO-REPO`
   - O nome do repositório é a parte após a barra `/`
4. Substitua `'LevelDay'` pelo nome real do seu repositório
5. Salve o arquivo

**Exemplo**: Se seu repositório é `https://github.com/joao/meu-app`, então:
```typescript
const REPO_NAME = 'meu-app'  // ✅ Correto
```

### 2. ✅ Configurar GitHub Pages para usar GitHub Actions

1. No GitHub, vá em **Settings** do seu repositório
2. No menu lateral, clique em **Pages**
3. Em **Source**, selecione **GitHub Actions** (NÃO selecione "Deploy from a branch")
4. Clique em **Save**

### 3. ✅ Verificar se o Workflow está Funcionando

1. No GitHub, vá na aba **Actions**
2. Verifique se há um workflow rodando ou que já rodou
3. Se houver erros, clique no workflow para ver os detalhes
4. Se não houver workflow, verifique se o arquivo `.github/workflows/deploy.yml` existe

### 4. ✅ Fazer Commit e Push

Certifique-se de que fez commit de todos os arquivos:

```bash
git add .
git commit -m "Configurar GitHub Pages"
git push origin main
```

### 5. ✅ Aguardar o Deploy

- O deploy pode levar alguns minutos
- Verifique a aba **Actions** para acompanhar o progresso
- Quando concluído, acesse: `https://SEU-USUARIO.github.io/NOME-DO-REPO/`

## Problemas Comuns

### ❌ Erro: "File not found"
**Solução**: Verifique se o nome do repositório no `vite.config.ts` está correto

### ❌ Erro: Workflow não executa
**Solução**: 
1. Verifique se o arquivo `.github/workflows/deploy.yml` existe
2. Verifique se está na branch `main`
3. Verifique se fez push das alterações

### ❌ Erro: Build falha
**Solução**:
1. Verifique se todas as dependências estão no `package.json`
2. Verifique os logs do workflow na aba **Actions**

### ❌ Site carrega mas está em branco
**Solução**: 
1. Abra o console do navegador (F12)
2. Verifique se há erros de caminho
3. Pode ser que o `base` path esteja incorreto

## Teste Local

Para testar localmente como será em produção:

```bash
npm run build
npm run preview
```

Isso vai simular como o site ficará no GitHub Pages.

