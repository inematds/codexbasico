#!/usr/bin/env node
/**
 * Processa conteúdo INEMA.Codex → codexbasico/
 * Fonte: telegramtopicosindex/out2/3053650449/
 */

const fs = require('fs');
const path = require('path');

const BASE_IN  = '/home/nmaldaner/projetos/telegramtopicosindex/out2/3053650449';
const BASE_OUT = '/home/nmaldaner/projetos/codexbasico';
const META     = JSON.parse(fs.readFileSync(path.join(BASE_IN, 'grupo_metadata.json')));

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------
function parseTopic(topicId, title) {
  const file = path.join(BASE_IN, String(topicId), 'content.txt');
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, 'utf8');

  const msgs = [];
  // Split on MENSAGEM N header (works regardless of separator style)
  const blocks = raw.split(/\nMENSAGEM \d+\n/);

  for (const block of blocks) {
    const autorM = block.match(/^Autor:\s*(.+)$/m);
    const dataM  = block.match(/^Data:\s*(.+)$/m);
    const textoM = block.match(/Texto:\n([\s\S]*)/m);

    if (!autorM) continue;

    const autor = (autorM[1] || '').trim();
    const data  = (dataM  ? dataM[1]  : '').trim().slice(0, 10);
    // Texto vai até o próximo separador de traços ou fim do bloco
    let texto = (textoM ? textoM[1] : '').replace(/-{10,}\s*$/, '').trim();

    if (!texto || texto === '[Sem texto]') continue;

    msgs.push({ autor, data, texto, topicId, title });
  }

  return msgs;
}

// ---------------------------------------------------------------------------
// Classificação: útil vs chatter
// ---------------------------------------------------------------------------
const CHATTER_PATTERNS = [
  /^[\s\S]{0,30}$/,              // muito curto (<30 chars)
  /^(ok|oi|👍|😀|🙏|✅|❤️|🔥|👏|obrigad|valeu|vlw|kkkk|rsrs|muito bom|show|top|boa|👋|olá|bom dia|boa tarde|boa noite)\s*[!.]*$/i,
];

function isUseful(msg) {
  const t = msg.texto;
  if (t.length > 150) return true;                     // textos longos = conteúdo
  if (/https?:\/\//.test(t)) return true;              // tem link
  if (/```/.test(t)) return true;                       // tem código
  if (/^\d+\.|^-\s|^#{1,3}\s/.test(t)) return true;  // lista ou heading
  if (/npm |npx |pip |python |git |codex |install/i.test(t)) return true; // comandos
  for (const p of CHATTER_PATTERNS) {
    if (p.test(t)) return false;
  }
  return t.length > 60;
}

// ---------------------------------------------------------------------------
// Deduplicação por texto normalizado
// ---------------------------------------------------------------------------
function normalize(t) {
  return t.toLowerCase().replace(/\s+/g, ' ').trim();
}

function dedup(msgs) {
  const seen = new Set();
  return msgs.filter(m => {
    const key = normalize(m.texto).slice(0, 200);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ---------------------------------------------------------------------------
// Formata mensagem em markdown
// ---------------------------------------------------------------------------
function fmtMsg(m) {
  const lines = [`**${m.autor}** · ${m.data}`, '', m.texto, ''];
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Escreve arquivo garantindo diretório
// ---------------------------------------------------------------------------
function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const TOPIC_ORDER = META.topicos.sort((a, b) => a.id - b.id);

let allMsgs = [];
const topicStats = [];

for (const t of TOPIC_ORDER) {
  const msgs = parseTopic(t.id, t.title);
  const useful = dedup(msgs.filter(isUseful));
  const total  = msgs.length;

  topicStats.push({ id: t.id, title: t.title, total, useful: useful.length });
  allMsgs = allMsgs.concat(msgs.map(m => ({ ...m, useful: isUseful(m) })));

  // Arquivo por tópico (apenas úteis)
  if (useful.length > 0) {
    const slug  = String(t.id).padStart(3, '0') + '-' + t.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
    const body  = `# ${t.title}\n\n> Tópico ${t.id} · ${useful.length} mensagens úteis de ${total} totais\n\n---\n\n`
      + useful.map(fmtMsg).join('\n---\n\n');
    write(path.join(BASE_OUT, 'topicos', slug + '.md'), body);
  }
}

// ---------------------------------------------------------------------------
// Links únicos
// ---------------------------------------------------------------------------
const linkMap = new Map(); // url → {titulo, topico, data}
for (const m of allMsgs) {
  const matches = m.texto.match(/https?:\/\/[^\s\)>\]"]+/g) || [];
  for (const url of matches) {
    if (!linkMap.has(url)) {
      // tenta pegar o texto antes ou depois do link na mesma linha
      const lines = m.texto.split('\n');
      let titulo = '';
      for (const line of lines) {
        if (line.includes(url)) {
          const before = line.split(url)[0].trim().replace(/^\s*[-*•]\s*/, '').replace(/\[/, '');
          const after  = line.split(url).slice(1).join('').trim().replace(/^\].*/, '');
          titulo = (before.length > 3 ? before : after).slice(0, 80);
          break;
        }
      }
      // fallback: título do tópico
      if (!titulo) titulo = m.title;
      linkMap.set(url, { titulo: titulo || '—', topico: m.title, data: m.data });
    }
  }
}

const linksContent = `# Links Únicos — INEMA.Codex\n\n> ${linkMap.size} links únicos extraídos\n\n`
  + [...linkMap.entries()].map(([url, info]) =>
      `- [${info.titulo.slice(0, 80) || url}](${url})\n  > Tópico: ${info.topico} · ${info.data}`
    ).join('\n\n');

write(path.join(BASE_OUT, 'curado', 'links-uteis.md'), linksContent);

// ---------------------------------------------------------------------------
// Comandos extraídos — apenas linhas que parecem shell real
// ---------------------------------------------------------------------------
const CMD_RE = /^(npm\s+(install|i\b|run|start|build|init|update|audit)|npx\s+\S|pip3?\s+install|python3?\s+-[mcef]\s|git\s+(clone|commit|push|pull|config|init|add|status|remote|checkout)|codex\s+(--|login|auth|generate|chat|init|run)|winget\s+install|brew\s+(install|update)|curl\s+-|export\s+[A-Z_]+=|chmod\s+[0-9])/i;
const cmdSet = new Set();
for (const m of allMsgs) {
  const lines = m.texto.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (CMD_RE.test(trimmed) && trimmed.length < 200 && !trimmed.includes('?')) {
      // remove trailing ``` artefact
      cmdSet.add(trimmed.replace(/```\s*$/, '').trim());
    }
  }
}

const cmdsContent = `# Comandos Extraídos — INEMA.Codex\n\n> ${cmdSet.size} comandos únicos\n\n`
  + [...cmdSet].map(c => '```bash\n' + c + '\n```').join('\n\n');

write(path.join(BASE_OUT, 'curado', 'comandos.md'), cmdsContent);

// ---------------------------------------------------------------------------
// Index principal
// ---------------------------------------------------------------------------
const indexContent = `# INEMA.Codex — Base de Conhecimento

> Canal: https://t.me/c/3053650449
> Extração: 2026-05-26
> Total mensagens: ${allMsgs.length}
> Mensagens úteis (dedup): ${allMsgs.filter(m => m.useful).length}

## Tópicos

| ID | Título | Total | Úteis |
|----|--------|-------|-------|
${topicStats.map(t => `| ${t.id} | ${t.title} | ${t.total} | ${t.useful} |`).join('\n')}

## Curadoria

- [Links Úteis](curado/links-uteis.md) — ${linkMap.size} links únicos
- [Comandos](curado/comandos.md) — ${cmdSet.size} comandos extraídos

## Topicos individuais

${topicStats.filter(t => t.useful > 0).map(t => {
  const slug = String(t.id).padStart(3, '0') + '-' + t.title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
  return `- [${t.title}](topicos/${slug}.md) (${t.useful} msgs úteis)`;
}).join('\n')}
`;

write(path.join(BASE_OUT, 'index.md'), indexContent);

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------
console.log('\n✅ PROCESSADO');
console.log(`   Tópicos: ${TOPIC_ORDER.length}`);
console.log(`   Mensagens totais: ${allMsgs.length}`);
console.log(`   Úteis (após dedup): ${allMsgs.filter(m => m.useful).length}`);
console.log(`   Links únicos: ${linkMap.size}`);
console.log(`   Comandos: ${cmdSet.size}`);
console.log(`\n   Saída: ${BASE_OUT}/`);

topicStats.forEach(t => {
  const pct = t.total ? Math.round(100 * t.useful / t.total) : 0;
  console.log(`   [${t.id}] ${t.title.padEnd(45)} ${t.useful}/${t.total} (${pct}%)`);
});
