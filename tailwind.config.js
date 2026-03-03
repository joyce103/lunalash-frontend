/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 自訂藕粉色系 (lotus)
        lotus: {
          50: '#fdfaeb', // 極淺的背景底色 (帶點暖白)
          100: '#f7ecee', // 卡片底色
          300: '#e5c1c5', // 柔和的藕粉 (適合做邊框或次要按鈕)
          400: '#d4a8ac', // 標準藕粉主色 (適合做主要按鈕)
          500: '#c28f94', // 較深的藕粉 (適合做 hover 狀態)
          600: '#a37176', // 深藕紅色 (適合做主要文字)
        }
      }
    },
  },
  plugins: [],
}