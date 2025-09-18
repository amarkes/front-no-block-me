#!/bin/bash

# Aliases para facilitar o uso do script de versionamento
# Adicione este arquivo ao seu .bashrc ou .zshrc

# Função para versionamento rápido
version() {
    local script_path="$(dirname "$0")/../version.sh"
    
    if [ ! -f "$script_path" ]; then
        echo "Erro: Script de versionamento não encontrado em $script_path"
        return 1
    fi
    
    "$script_path" "$@"
}

# Aliases para comandos comuns
alias vpatch='version patch --commit --tag'
alias vminor='version minor --commit --tag'  
alias vmajor='version major --commit --tag'
alias vshow='version show'
alias vhelp='version help'

# Aliases para comandos com push
alias vpatch-push='version patch --commit --tag --push'
alias vminor-push='version minor --commit --tag --push'
alias vmajor-push='version major --commit --tag --push'

echo "Aliases de versionamento carregados:"
echo "  vpatch       - Incrementa patch + commit + tag"
echo "  vminor       - Incrementa minor + commit + tag"
echo "  vmajor       - Incrementa major + commit + tag"
echo "  vpatch-push  - Incrementa patch + commit + tag + push"
echo "  vminor-push  - Incrementa minor + commit + tag + push"
echo "  vmajor-push  - Incrementa major + commit + tag + push"
echo "  vshow        - Mostra versão atual"
echo "  vhelp        - Mostra ajuda"
