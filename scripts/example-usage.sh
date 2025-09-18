#!/bin/bash

# Exemplo de uso do script de versionamento
# Este script demonstra como usar o version.sh

echo "=== Exemplo de Uso do Script de Versionamento ==="
echo ""

# Mostrar versão atual
echo "1. Versão atual:"
./version.sh show
echo ""

# Simular incremento de patch (sem fazer commit)
echo "2. Simulando incremento de patch:"
echo "   Comando: ./version.sh patch"
echo "   (Não executando para não alterar o repositório)"
echo ""

# Simular incremento de minor com commit e tag
echo "3. Simulando incremento de minor com commit e tag:"
echo "   Comando: ./version.sh minor --commit --tag"
echo "   (Não executando para não alterar o repositório)"
echo ""

# Simular incremento de major completo
echo "4. Simulando incremento de major completo:"
echo "   Comando: ./version.sh major --commit --tag --push"
echo "   (Não executando para não alterar o repositório)"
echo ""

echo "=== Comandos Disponíveis ==="
echo ""
echo "Comandos básicos:"
echo "  ./version.sh show                    # Mostra versão atual"
echo "  ./version.sh help                    # Mostra ajuda"
echo "  ./version.sh patch                   # Incrementa patch"
echo "  ./version.sh minor                   # Incrementa minor"
echo "  ./version.sh major                   # Incrementa major"
echo ""
echo "Comandos com Git:"
echo "  ./version.sh patch --commit          # Patch + commit"
echo "  ./version.sh minor --commit --tag    # Minor + commit + tag"
echo "  ./version.sh major --commit --tag --push  # Major + commit + tag + push"
echo ""
echo "=== Fluxo de Trabalho Recomendado ==="
echo ""
echo "Para correções de bugs:"
echo "  ./version.sh patch --commit --tag --push"
echo ""
echo "Para novas funcionalidades:"
echo "  ./version.sh minor --commit --tag --push"
echo ""
echo "Para mudanças incompatíveis:"
echo "  ./version.sh major --commit --tag --push"
echo ""
echo "=== Usando Aliases ==="
echo ""
echo "Para usar os aliases, adicione ao seu .bashrc ou .zshrc:"
echo "  source $(pwd)/scripts/version-aliases.sh"
echo ""
echo "Depois você pode usar:"
echo "  vpatch       # patch + commit + tag"
echo "  vminor       # minor + commit + tag"
echo "  vmajor       # major + commit + tag"
echo "  vpatch-push  # patch + commit + tag + push"
echo "  vminor-push  # minor + commit + tag + push"
echo "  vmajor-push  # major + commit + tag + push"
echo "  vshow        # mostra versão atual"
echo "  vhelp        # mostra ajuda"
