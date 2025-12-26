#!/bin/bash
#
# Script para instalar Proto e Moon no theo-boilerplate
# Usage: ./scripts/install-moon.sh
#

set -e  # Exit on error

echo "========================================="
echo "  Installing Proto + Moon"
echo "========================================="
echo ""

# Detectar OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     PLATFORM=linux;;
    Darwin*)    PLATFORM=macos;;
    *)          echo "❌ Unsupported OS: ${OS}"; exit 1;;
esac

echo "📦 Detected platform: ${PLATFORM}"
echo ""

# 1. Instalar Proto
echo "1️⃣  Installing Proto (version manager)..."

if command -v proto &> /dev/null; then
    echo "✅ Proto already installed: $(proto --version)"
else
    echo "  → Downloading and installing Proto..."
    curl -fsSL https://moonrepo.dev/install/proto.sh | bash

    # Add to PATH para esta sessão
    export PATH="$HOME/.proto/bin:$PATH"

    echo "✅ Proto installed: $(proto --version)"
fi

echo ""

# 2. Instalar Moon
echo "2️⃣  Installing Moon CLI..."

if command -v moon &> /dev/null; then
    echo "✅ Moon already installed: $(moon --version)"
else
    echo "  → Installing Moon via Proto..."
    proto install moon

    echo "✅ Moon installed: $(moon --version)"
fi

echo ""

# 3. Instalar Node.js via Proto (opcional, mas recomendado)
echo "3️⃣  Installing Node.js 20 via Proto..."

if proto list node | grep -q "20\."; then
    echo "✅ Node.js 20 already installed"
else
    echo "  → Installing Node.js 20..."
    proto install node 20

    echo "✅ Node.js 20 installed: $(node --version)"
fi

echo ""

# 4. Configurar PATH permanentemente
echo "4️⃣  Configuring PATH..."

SHELL_RC=""
if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_RC="$HOME/.bashrc"
fi

if [ -n "$SHELL_RC" ]; then
    if ! grep -q 'proto/bin' "$SHELL_RC"; then
        echo 'export PATH="$HOME/.proto/bin:$PATH"' >> "$SHELL_RC"
        echo "✅ Added Proto to PATH in $SHELL_RC"
        echo "  → Run: source $SHELL_RC"
    else
        echo "✅ Proto already in PATH"
    fi
fi

echo ""

# 5. Verificar instalação
echo "5️⃣  Verifying installation..."
echo ""

command -v proto &> /dev/null && echo "✅ proto: $(proto --version)" || echo "❌ proto not found"
command -v moon &> /dev/null && echo "✅ moon: $(moon --version)" || echo "❌ moon not found"
command -v node &> /dev/null && echo "✅ node: $(node --version)" || echo "❌ node not found"
command -v pnpm &> /dev/null && echo "✅ pnpm: $(pnpm --version)" || echo "❌ pnpm not found"

echo ""

# 6. Moon workspace check
echo "6️⃣  Checking Moon workspace..."

if [ -f ".moon/workspace.yml" ]; then
    echo "✅ Moon workspace configured (.moon/workspace.yml)"

    # Listar projetos
    echo ""
    echo "📋 Projects in workspace:"
    moon query projects || echo "  (run 'moon query projects' manually after sourcing shell)"
else
    echo "❌ Moon workspace not configured"
    echo "  → Expected: .moon/workspace.yml"
fi

echo ""
echo "========================================="
echo "  Installation Complete! ✅"
echo "========================================="
echo ""
echo "Next steps:"
echo "  1. Restart your shell or run: source ~/.bashrc (or ~/.zshrc)"
echo "  2. Verify: moon --version"
echo "  3. List projects: moon query projects"
echo "  4. Build all: moon run :build"
echo ""
echo "Read MOON_SETUP.md for full documentation."
echo ""
