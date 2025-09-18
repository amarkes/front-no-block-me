# Script de Versionamento SemVer

Este script automatiza o processo de versionamento seguindo o padrão [Semantic Versioning (SemVer)](https://semver.org/).

## Instalação

O script já está pronto para uso. Certifique-se de que ele tem permissão de execução:

```bash
chmod +x version.sh
```

## Uso

### Sintaxe Básica

```bash
./version.sh [OPÇÃO] [FLAGS]
```

### Opções

- `major` - Incrementa a versão major (1.0.0 → 2.0.0)
- `minor` - Incrementa a versão minor (1.0.0 → 1.1.0)  
- `patch` - Incrementa a versão patch (1.0.0 → 1.0.1)
- `show` - Mostra a versão atual
- `help` - Mostra a ajuda

### Flags

- `--commit` - Faz commit automático das mudanças
- `--tag` - Cria uma tag git com a nova versão
- `--push` - Faz push das mudanças e tags para o repositório

## Exemplos

### Versionamento Simples

```bash
# Incrementar patch (1.0.1 → 1.0.2)
./version.sh patch

# Incrementar minor (1.0.1 → 1.1.0)
./version.sh minor

# Incrementar major (1.0.1 → 2.0.0)
./version.sh major
```

### Versionamento com Git

```bash
# Incrementar patch e fazer commit
./version.sh patch --commit

# Incrementar minor, fazer commit e criar tag
./version.sh minor --commit --tag

# Incrementar major, fazer commit, criar tag e fazer push
./version.sh major --commit --tag --push
```

### Verificar Versão Atual

```bash
# Mostrar versão atual
./version.sh show
```

## Fluxo de Trabalho Recomendado

### Para Correções de Bugs (Patch)
```bash
./version.sh patch --commit --tag --push
```

### Para Novas Funcionalidades (Minor)
```bash
./version.sh minor --commit --tag --push
```

### Para Mudanças Incompatíveis (Major)
```bash
./version.sh major --commit --tag --push
```

## O que o Script Faz

1. **Validação**: Verifica se está em um repositório git válido
2. **Incremento**: Calcula a nova versão baseada no tipo especificado
3. **Atualização**: Atualiza o `package.json` com a nova versão
4. **Commit** (opcional): Cria um commit com a mensagem "chore: bump version to X.Y.Z"
5. **Tag** (opcional): Cria uma tag git no formato "vX.Y.Z"
6. **Push** (opcional): Envia as mudanças e tags para o repositório remoto

## Estrutura de Versão SemVer

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Funcionalidades adicionadas de forma compatível
- **PATCH**: Correções de bugs compatíveis

## Exemplos de Versionamento

| Mudança | Tipo | Exemplo |
|---------|------|---------|
| Correção de bug | patch | 1.0.0 → 1.0.1 |
| Nova funcionalidade | minor | 1.0.0 → 1.1.0 |
| Mudança incompatível | major | 1.0.0 → 2.0.0 |

## Segurança

- O script verifica se há mudanças não commitadas antes de prosseguir
- Solicita confirmação antes de fazer qualquer alteração
- Valida se está em um repositório git válido
- Usa cores para destacar diferentes tipos de mensagens

## Troubleshooting

### Erro: "Este diretório não é um repositório git"
- Certifique-se de estar em um diretório com repositório git inicializado
- Execute `git init` se necessário

### Erro: "Há mudanças não commitadas"
- Faça commit das mudanças pendentes antes de usar o script
- Ou use `git stash` para salvar temporariamente

### Script não executa
- Verifique se tem permissão de execução: `chmod +x version.sh`
- Execute com bash: `bash version.sh [opções]`
