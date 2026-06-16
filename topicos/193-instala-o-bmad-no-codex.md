# Instala o BMAD no Codex

> Tópico 193 · 1 mensagens úteis de 7 totais

---

**INEMA** · 2025-10-18

Aqui está o **passo a passo completo e atualizado** para instalar o **BMAD Method** localmente e integrá-lo ao **Codex (CLI ou Web)** — direto, funcional e conforme o documento oficial:

---

## 1. Vá até o diretório do projeto

```cd C:\Users\neima\projetosCX\liah```

---

## 2. Crie um `package.json` (caso não exista)

```npm init -y```

---

## 3. Instale o BMAD localmente

```npm install bmad-method --save-dev```

---

## 4. Instale o BMAD completo no projeto

```npx bmad-method install --full```

---

## 5. Integre com o Codex

Escolha **apenas um dos modos**:

### Modo local (para uso só no seu PC)

```npx bmad-method install -f -i codex -d .```

### Modo web (para uso no Codex Web com Git)

```npx bmad-method install -f -i codex-web -d .```

---

## 6. Verifique se a instalação está correta

```npx bmad-method status```

Você deve ver algo como:

```BMad Installation Status:
  Directory:  C:\Users\neima\projetosCX\liah
  Version:    4.44.x
  Installed:  full
  IDE Setup:  codex```

---

## 7. Teste rápido

Abra o Codex (CLI ou Web) e execute:

```As dev, implement user login module```

ou use os agentes diretamente:

```@pm Create PRD for login system
@architect Design API structure```

---

## 8. Atualização futura (opcional)

Quando quiser atualizar os agentes:

```npx bmad-method install -f -i codex```

ou (para o web)

```npx bmad-method install -f -i codex-web```

---
