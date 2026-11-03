# EAIDOKY — site

Projeto React + Vite + Express, preparado para deploy no Render.

## Rodar localmente

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço local informado pelo Vite.

## Produção / Render

```bash
npm install
npm run build
npm start
```

O arquivo `render.yaml` já define build, start e health check. Também é possível configurar manualmente no Render:
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Health Check Path: `/api/health`

## Feed do YouTube

O servidor tenta localizar o ID público do canal `@eaidoky`, ler o RSS público do YouTube e atualizar a lista em cache a cada 55 segundos. Não exige chave de API nem login. O YouTube pode limitar/bloquear consultas automatizadas; nesse caso, o site mantém os dois vídeos enviados como referência (uma live e um short) e os links para abrir as páginas oficiais do canal.

A separação de Shorts usa duração de até 180 segundos como heurística; o RSS público não identifica de forma confiável todo Short. Replays de transmissões são reconhecidos quando o YouTube os marca como conteúdo ao vivo. Vídeos comuns que não sejam lives ou Shorts não entram nessas duas listas.

Para trocar o canal, configure `YOUTUBE_HANDLE` no ambiente (por padrão `@eaidoky`).

## Links configurados
- YouTube: https://www.youtube.com/@eaidoky
- Discord: https://discord.gg/2VtmHhZN4
- Instagram: https://www.instagram.com/eaidoky
- X: https://x.com/eaidoky
- TikTok: https://www.tiktok.com/@eaidoky
- Pix GG: https://pixgg.com/eaidoky
- Loja Streamlabs: https://streamlabs.com/gabsteco/cloudbot
