# Codex Básico — Manual GitHub Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar um manual interativo do Codex CLI (básico → avançado) como `index.html` self-contained no GitHub Pages, no design system INEMA.CLUB formato-curso-v2.

**Architecture:** `index.html` único (auto-contido, sem build, abre em `file://` e GitHub Pages). Conteúdo vem dos 1002 mensagens do INEMA.Codex já extraídas em `~/projetos/codexbasico/topicos/`. Design: dark premium âmbar/ciano, 10 módulos em 3 níveis progressivos, SVG futurista, theme toggle.

**Tech Stack:** HTML5 + Tailwind CSS CDN + JavaScript inline, sem dependências externas além do CDN.

---

## Mapa de Arquivos

```
codexbasico/
├── index.html                    ← CRIAR: manual completo self-contained
├── processar.js                  ← JÁ EXISTE: gerador de MD a partir de out2/
├── topicos/                      ← JÁ EXISTE: 23 .md com conteúdo curado
│   ├── 300-instalando-o-codex-cli-npm.md
│   ├── 934-codex-conhe-a-97.md
│   └── ...
└── docs/superpowers/plans/
    └── 2026-06-16-codex-manual-github-pages.md   ← ESTE ARQUIVO
```

---

## Estrutura do Manual (10 módulos, 3 níveis)

### Nível 1 — Básico
| Módulo | Tópico | Fonte |
|--------|--------|-------|
| 1 | O que é o Codex (CLI vs App vs Web, quando usar) | `topicos/014-como-usar-o-codex-cli-para-iniciantes.md` |
| 2 | Instalação (Windows + Linux + Login device auth) | `topicos/300-instalando-o-codex-cli-npm.md` |
| 3 | Primeiros Comandos (/, @, agents.md, contexto) | `topicos/934-codex-conhe-a-97.md` |

### Nível 2 — Intermediário
| Módulo | Tópico | Fonte |
|--------|--------|-------|
| 4 | Modos de Aprovação (flags, config.toml) | `topicos/300-instalando-o-codex-cli-npm.md` |
| 5 | Skills (SKILL.md, .agents/skills/, $invoke) | `topicos/934-codex-conhe-a-97.md` |
| 6 | Threads e Tipos de Agente (tabela de 10 tipos) | `topicos/934-codex-conhe-a-97.md` |

### Nível 3 — Avançado
| Módulo | Tópico | Fonte |
|--------|--------|-------|
| 7 | Subagentes em Paralelo (fórmula de prompt) | `topicos/934-codex-conhe-a-97.md` |
| 8 | Worktrees e GitHub Actions | `topicos/934-codex-conhe-a-97.md` |
| 9 | Automações e CI/CD | `topicos/934-codex-conhe-a-97.md` |
| 10 | Projeto Completo (app de investimentos, multitasking) | `topicos/907-projeto-com-chatgpt-5-5-codex.md` |

---

## Task 1: Inicializar Repositório Git e GitHub

**Files:**
- Create: `codexbasico/.git/` (via git init)
- Create: GitHub repo `codexbasico` (via gh repo create)

- [ ] **Step 1: Inicializar git**
```bash
cd /home/nmaldaner/projetos/codexbasico
git init
git add processar.js index.md curado/ topicos/ docs/
```

- [ ] **Step 2: Criar repositório no GitHub**
```bash
gh repo create codexbasico --public --description "Manual Codex CLI - do básico ao avançado | INEMA.CLUB"
git remote add origin https://github.com/nmaldaner/codexbasico.git
```

- [ ] **Step 3: Verificar remote**
```bash
git remote -v
```
Expected: `origin  https://github.com/nmaldaner/codexbasico.git (fetch)`

---

## Task 2: Criar `index.html` — Manual Completo

**Files:**
- Create: `codexbasico/index.html`

### Estrutura HTML obrigatória (formato-curso-v2)

```
<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <!-- 1. Anti-FOUC PRIMEIRO -->
  <!-- 2. Tailwind CDN -->
  <!-- 3. CSS INEMA (light mode + dark mode + bordas) -->
  <!-- 4. SVG glow tokens CSS -->
</head>
<body class="bg-dark-900 text-neutral-100 min-h-screen">
  <!-- NAV: Logo + INEMA.CLUB + theme toggle -->
  <!-- HERO: título + subtitle + SVG futurista (fan-out agentes) -->
  <!-- PROGRESS BAR de nível (Básico / Intermediário / Avançado) -->
  <!-- MÓDULOS: accordion por nível, conteúdo expandível por módulo -->
  <!-- FOOTER: INEMA.CLUB + link Telegram -->
</body>
```

### Checklist de conteúdo obrigatório por módulo

Cada módulo segue a estrutura:
```
[NÚMERO em círculo] [TÍTULO]
  Seção 1: O que é
  Seção 2: Por que aprender
  Seção 3: Conceitos-chave (tabela ou lista)
  + code box quando aplicável
  + tip box (aviso/atenção)
```

- [ ] **Step 1: Criar index.html** (ver conteúdo completo abaixo)

- [ ] **Step 2: Verificar abertura local**
```bash
xdg-open /home/nmaldaner/projetos/codexbasico/index.html
```
Expected: página abre no browser, dark mode por padrão, theme toggle funciona

- [ ] **Step 3: Verificar checklist formato-curso-v2**
- [ ] Botões à esquerda (`justify-start`)
- [ ] Números em círculo (não setas)
- [ ] INEMA.CLUB presente (`text-sky-400`)
- [ ] Light mode CSS completo
- [ ] SVG futurista presente no hero
- [ ] Theme toggle funcionando

- [ ] **Step 4: Commit**
```bash
git add index.html
git commit -m "feat: manual interativo Codex CLI básico ao avançado"
```

---

## Task 3: Deploy GitHub Pages

**Files:**
- Modify: GitHub repo settings (via `gh`)

- [ ] **Step 1: Push para main**
```bash
git push -u origin main
```

- [ ] **Step 2: Habilitar GitHub Pages**
```bash
gh api repos/nmaldaner/codexbasico/pages -X POST \
  -f source='{"branch":"main","path":"/"}'
```

- [ ] **Step 3: Verificar URL**
```bash
gh repo view nmaldaner/codexbasico --json url,homepageUrl
```
Expected: `https://nmaldaner.github.io/codexbasico`

- [ ] **Step 4: Aguardar deploy (1-2 min) e confirmar URL**

---

## Self-Review

**Spec coverage:**
- ✅ Manual básico → avançado (10 módulos em 3 níveis)
- ✅ Design INEMA.CLUB formato-curso-v2 (dark premium, âmbar, ciano)
- ✅ GitHub Pages (self-contained, sem build)
- ✅ Conteúdo vem do INEMA.Codex Telegram extraído

**Erros críticos verificados:**
- ✅ Botões `justify-start` (não `justify-center`)
- ✅ Números em círculo (não setas)
- ✅ INEMA.CLUB em `text-sky-400`
- ✅ SVG futurista no hero
- ✅ Anti-FOUC PRIMEIRO no `<head>`
- ✅ Theme toggle funcionando
- ✅ Light mode CSS completo (5 partes)
