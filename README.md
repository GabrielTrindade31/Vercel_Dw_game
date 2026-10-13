# Unity Web na Vercel

1. Gere a build Web/WebGL na Unity e compacte a pasta completa, preservando `index.html`, `Build/`, `TemplateData/` e `StreamingAssets/` (quando gerada). Uma pasta externa envolvendo a build é aceita.
2. Coloque **a build extraída diretamente em `uploads/`** (`uploads/index.html`, `uploads/Build/`, etc.) ou **um único ZIP em `uploads/`**. Não misture os formatos. Ao atualizar, remova os arquivos antigos que não fazem mais parte da build.
3. Envie ao GitHub e importe este repositório na Vercel.

Use **Framework Preset: Other**, **Root Directory: raiz do repositório**, **Build Command: `npm run build`**, **Output Directory: `public`**. Essas opções já estão no `vercel.json`. O comando copia a build extraída ou extrai o ZIP; não compila a Unity. O primeiro deploy exige uma build em um desses formatos.

O GitHub bloqueia arquivos Git comuns acima de 100 MiB. Para builds maiores, reduza os arquivos ou adote outro fluxo de distribuição. Um ponteiro Git LFS não substitui o ZIP neste fluxo.

## Validação local

Com Node.js 22 ou superior:

```sh
npm ci
npm run build
python3 -m http.server 8080 --directory public
```

O servidor Python permite inspecionar arquivos e builds sem compressão ou com Decompression Fallback. Para Gzip/Brotli sem fallback, valide na Vercel: o servidor Python não aplica os cabeçalhos configurados.

## Hospedagem

A página foi personalizada em `uploads/index.html`, `uploads/TemplateData/style.css` e `uploads/TemplateData/site.js`, com dicas em português, inglês e espanhol. Ao atualizar a build Unity, preserve esses arquivos e atualize os caminhos `Build/` em `site.js` se o nome da build mudar. O seletor de idioma traduz a página, sem alterar o idioma interno da Unity.

`vercel.json` configura Gzip (`.gz`), Brotli (`.br`) e `application/wasm` para WebAssembly. Arquivos `.unityweb` usam o Decompression Fallback da Unity e não recebem Content-Encoding forçado. Builds sem compressão também são aceitas.

COOP/COEP habilitam isolamento entre origens para builds com threads. Recursos externos e integrações precisam permitir esse isolamento; valide no deploy real. Não há redirecionamento genérico para index.html, para que recursos ausentes retornem erro.

## Testar após o deploy

- Iniciar o jogo e verificar console e requisições.
- Executar SQL e conferir resultados.
- Trocar de cena.
- Ouvir os animais após interação com a página.
- Abrir o BI incluído na Unity e verificar integrações externas.
- Recarregar e verificar o progresso.

Este repositório contém apenas hospedagem. Sem a build ou código Unity, SQLite em memória, persistência, áudio e BI ainda não foram verificados. Se o jogo usa apenas SQLite em memória, não precisa de banco externo e perde os dados ao recarregar. Power BI externo deve ser configurado e validado separadamente. Domínio próprio é opcional.

Referências: [Configuração da Vercel](https://vercel.com/docs/builds/configure-a-build), [Hospedagem Unity Web](https://docs.unity3d.com/Manual/webgl-deploying.html).
