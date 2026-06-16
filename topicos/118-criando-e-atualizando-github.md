# Criando e Atualizando GITHUB

> Tópico 118 · 1 mensagens úteis de 9 totais

---

**INEMA** · 2025-10-12

Se você estiver usando o **Codex (OpenAI Codex CLI)**, o processo é praticamente o mesmo do Claude Code, mas com **alguns ajustes no terminal do Codex**, pois ele já vem integrado ao GitHub em muitos casos.
Aqui vai o passo a passo específico para **atualizar um projeto Codex no GitHub**:

---

## 🧭 Passo a passo para atualizar um repositório no GitHub pelo Codex

### 1. Abrir o terminal no Codex

No canto inferior da tela, clique em **“Terminal”** ou pressione
`Ctrl + ~` (Windows) ou `Cmd + ~` (Mac).

---

### 2. Verificar se o repositório Git está conectado

Digite:

```git remote -v```

* Se aparecer algo como `origin https://github.com/...`, o repositório já está vinculado.
* Se **não aparecer nada**, adicione o repositório do GitHub:

```git remote add origin https://github.com/seu_usuario/seu_repositorio.git```

---

### 3. Adicionar as alterações

```git add .```

---

### 4. Criar o commit

```git commit -m "Atualização do projeto Codex"```

Se for o primeiro commit e o Git avisar que não há autor configurado, defina com:

```git config --global user.name "Seu Nome"
git config --global user.email "seu_email@exemplo.com"```

Depois repita o commit.

---

### 5. Enviar para o GitHub

Se for o **primeiro envio (push)**:

```git branch -M main
git push -u origin main```

Se já existir o repositório e branch configurados:

```git push```

---

### 6. (Opcional) Autenticação

O Codex normalmente abre uma janela pedindo login no GitHub.
Se não abrir automaticamente, autentique manualmente com:

```gh auth login```

Escolha:

* **GitHub.com**
* **HTTPS**
* E confirme a autenticação pelo navegador.

---

### 7. Atualizações futuras

Da próxima vez que quiser enviar suas alterações, basta usar:

```git add .
git commit -m "melhorias no código"
git push```

---

### 8. Conferir no GitHub

Depois do `git push`, acesse seu repositório em
`https://github.com/seu_usuario/seu_repositorio`
e confirme se os arquivos foram atualizados.
