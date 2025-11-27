// Script para verificar o nome do repositório
// Execute: node check-repo-name.js

const fs = require('fs');
const path = require('path');

// Ler o vite.config.ts
const viteConfigPath = path.join(__dirname, 'vite.config.ts');
const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');

// Extrair o nome do repositório
const match = viteConfig.match(/const REPO_NAME = ['"](.*?)['"]/);
const repoName = match ? match[1] : null;

console.log('\n📋 Verificação do Nome do Repositório\n');
console.log(`Nome configurado no vite.config.ts: ${repoName || 'NÃO ENCONTRADO'}\n`);

if (repoName) {
  console.log('✅ Para verificar se está correto:');
  console.log(`   1. Vá para: https://github.com/SEU-USUARIO/${repoName}`);
  console.log(`   2. Se a URL estiver correta, o nome está certo!`);
  console.log(`   3. Se não, edite o vite.config.ts e altere '${repoName}' para o nome correto\n`);
} else {
  console.log('❌ Não foi possível encontrar REPO_NAME no vite.config.ts\n');
}

console.log('💡 Dica: O nome do repositório é a parte após a barra na URL do GitHub');
console.log('   Exemplo: https://github.com/usuario/meu-app → nome é "meu-app"\n');

