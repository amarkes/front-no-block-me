#!/bin/bash

# Script de Versionamento SemVer
# Uso: ./version.sh [major|minor|patch] [--commit] [--tag] [--push]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir ajuda
show_help() {
    echo -e "${BLUE}Script de Versionamento SemVer${NC}"
    echo ""
    echo "Uso: $0 [OPÇÃO] [FLAGS]"
    echo ""
    echo "OPÇÕES:"
    echo "  major     Incrementa a versão major (1.0.0 -> 2.0.0)"
    echo "  minor     Incrementa a versão minor (1.0.0 -> 1.1.0)"
    echo "  patch     Incrementa a versão patch (1.0.0 -> 1.0.1)"
    echo "  show      Mostra a versão atual"
    echo "  help      Mostra esta ajuda"
    echo ""
    echo "FLAGS:"
    echo "  --commit  Faz commit automático das mudanças"
    echo "  --tag     Cria uma tag git com a nova versão"
    echo "  --push    Faz push das mudanças e tags para o repositório"
    echo ""
    echo "Exemplos:"
    echo "  $0 patch --commit --tag"
    echo "  $0 minor --commit --tag --push"
    echo "  $0 major"
}

# Função para obter a versão atual
get_current_version() {
    if [ -f "package.json" ]; then
        node -p "require('./package.json').version"
    else
        echo "0.0.0"
    fi
}

# Função para incrementar versão
increment_version() {
    local version=$1
    local type=$2
    
    # Divide a versão em partes
    IFS='.' read -ra VERSION_PARTS <<< "$version"
    local major=${VERSION_PARTS[0]}
    local minor=${VERSION_PARTS[1]}
    local patch=${VERSION_PARTS[2]}
    
    case $type in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            echo -e "${RED}Erro: Tipo de versão inválido. Use major, minor ou patch.${NC}"
            exit 1
            ;;
    esac
    
    echo "${major}.${minor}.${patch}"
}

# Função para atualizar package.json
update_package_json() {
    local new_version=$1
    local temp_file=$(mktemp)
    
    # Atualiza a versão no package.json
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.version = '$new_version';
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    "
    
    echo -e "${GREEN}✓ package.json atualizado para versão $new_version${NC}"
}

# Função para fazer commit
git_commit() {
    local version=$1
    local message="chore: bump version to $version"
    
    git add package.json
    git commit -m "$message"
    echo -e "${GREEN}✓ Commit criado: $message${NC}"
}

# Função para criar tag
git_tag() {
    local version=$1
    local tag_name="v$version"
    
    git tag -a "$tag_name" -m "Release version $version"
    echo -e "${GREEN}✓ Tag criada: $tag_name${NC}"
}

# Função para fazer push
git_push() {
    git push origin HEAD
    git push origin --tags
    echo -e "${GREEN}✓ Push realizado com sucesso${NC}"
}

# Função para validar se estamos em um repositório git
validate_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}Erro: Este diretório não é um repositório git.${NC}"
        exit 1
    fi
}

# Função para verificar se há mudanças não commitadas
check_working_directory() {
    if ! git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}Aviso: Há mudanças não commitadas no repositório.${NC}"
        read -p "Deseja continuar mesmo assim? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${RED}Operação cancelada.${NC}"
            exit 1
        fi
    fi
}

# Função principal
main() {
    local version_type=""
    local commit=false
    local tag=false
    local push=false
    
    # Parse dos argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            major|minor|patch|show|help)
                version_type="$1"
                shift
                ;;
            --commit)
                commit=true
                shift
                ;;
            --tag)
                tag=true
                shift
                ;;
            --push)
                push=true
                shift
                ;;
            *)
                echo -e "${RED}Erro: Argumento desconhecido '$1'${NC}"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Se não foi especificado um tipo, mostrar ajuda
    if [ -z "$version_type" ]; then
        show_help
        exit 0
    fi
    
    # Se for show, apenas mostrar a versão atual
    if [ "$version_type" = "show" ]; then
        local current_version=$(get_current_version)
        echo -e "${BLUE}Versão atual: $current_version${NC}"
        exit 0
    fi
    
    # Se for help, mostrar ajuda
    if [ "$version_type" = "help" ]; then
        show_help
        exit 0
    fi
    
    # Validar repositório git se necessário
    if [ "$commit" = true ] || [ "$tag" = true ] || [ "$push" = true ]; then
        validate_git_repo
        check_working_directory
    fi
    
    # Obter versão atual
    local current_version=$(get_current_version)
    echo -e "${BLUE}Versão atual: $current_version${NC}"
    
    # Incrementar versão
    local new_version=$(increment_version "$current_version" "$version_type")
    echo -e "${BLUE}Nova versão: $new_version${NC}"
    
    # Confirmar operação
    read -p "Deseja continuar com o versionamento? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Operação cancelada.${NC}"
        exit 0
    fi
    
    # Atualizar package.json
    update_package_json "$new_version"
    
    # Fazer commit se solicitado
    if [ "$commit" = true ]; then
        git_commit "$new_version"
    fi
    
    # Criar tag se solicitado
    if [ "$tag" = true ]; then
        git_tag "$new_version"
    fi
    
    # Fazer push se solicitado
    if [ "$push" = true ]; then
        git_push
    fi
    
    echo -e "${GREEN}✓ Versionamento concluído com sucesso!${NC}"
    echo -e "${BLUE}Versão final: $new_version${NC}"
}

# Executar função principal
main "$@"
