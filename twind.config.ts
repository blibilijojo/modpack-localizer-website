import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    extend: {
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'animate-stars': {
          'from': { transform: 'translateY(0px)' },
          'to': { transform: 'translateY(-2000px)' }
        },
        // 新增：用于按钮背景渐变动画
        'background-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.6s ease-out forwards',
        'fade-in-slow': 'fade-in 1s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'stars-slow': 'animate-stars 150s linear infinite',
        'stars-medium': 'animate-stars 100s linear infinite',
        'stars-fast': 'animate-stars 50s linear infinite',
        // 新增：应用背景渐变动画
        'background-pan': 'background-pan 3s linear infinite',
      }
    }
  }
} as Options;
