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
        // 定义一个统一的向上移动动画
        'animate-stars': {
          'from': { transform: 'translateY(0px)' },
          // 将星星移动到 -2000px 的位置，确保它们能完全移出屏幕
          'to': { transform: 'translateY(-2000px)' }
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.6s ease-out forwards',
        'fade-in-slow': 'fade-in 1s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        // 定义三种不同的动画速度，应用到不同的星空图层
        'stars-slow': 'animate-stars 150s linear infinite', // 最慢，远景
        'stars-medium': 'animate-stars 100s linear infinite', // 中景
        'stars-fast': 'animate-stars 50s linear infinite',  // 最快，近景
      }
    }
  }
} as Options;
