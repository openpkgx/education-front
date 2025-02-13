import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        marquee: 'marquee 10s linear infinite', // 定义动画持续时间及重复方式
      },
      keyframes: {
        marquee: {
          '0%': {
            transform: 'translateX(100%)', // 从右侧开始
          },
          '100%': {
            transform: 'translateX(-100%)', // 向左移动完全消失
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
