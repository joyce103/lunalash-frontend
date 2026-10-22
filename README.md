# lunalash-frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## 資安更新記錄 (2026-10)

因應 2026 年 10 月公布的資安漏洞，進行以下修復：

- **Dockerfile**：build 階段 `node:22-alpine` 升級為 `node:22.23.4-alpine`（修補 10 個漏洞，含 4 個高風險；Node 18/20 已 EOL，故鎖定在仍受支援的 22 系列）；執行階段 `nginx:alpine` 升級為 `nginx:1.30.6-alpine`（修補 2026/10/14 公布的 5 個中度漏洞）。
- **package.json**：`engines.node` 移除已停止支援的 `^20.19.0`，僅允許 `>=22.12.0`。
- **npm 依賴**：執行 `npm audit fix` 並將 `tailwindcss` 由 3.4.19 升級到 4.3.3（連帶改用 `@tailwindcss/postcss`、移除已內建於 v4 的 `autoprefixer`），npm audit 漏洞數由 21 個（15 高風險）降為 **0**。

> 重新部署時請務必 `docker compose build --no-cache` 以確保拉到上述修補過的映像檔版本。
