import { useEffect, useRef } from "preact/hooks";

// 定义我们期望从 props 接收到的数据结构
interface Feature {
  name: string;
  desc: string;
}

interface FeatureGridProps {
  features: Feature[];
}

export default function FeatureGrid({ features }: FeatureGridProps) {
  // 创建一个引用，用于访问 DOM 中的网格容器
  const gridRef = useRef<HTMLDivElement>(null);

  // useEffect 会在组件加载到浏览器后运行
  useEffect(() => {
    // IntersectionObserver 是一个现代浏览器API，用于高效检测元素是否进入视口
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 如果元素进入视口
          if (entry.isIntersecting) {
            // 为其添加 'is-visible' 类来触发动画
            entry.target.classList.add("is-visible");
            // 动画触发一次后，停止观察该元素，以提升性能
            observer.unobserve(entry.target);
          }
        });
      },
      // 当元素至少有 10% 可见时触发
      { threshold: 0.1 }
    );

    const grid = gridRef.current;
    if (grid) {
      // 获取网格容器的所有直接子元素（即卡片）并开始观察它们
      const cards = Array.from(grid.children);
      cards.forEach((card) => {
        observer.observe(card);
      });
    }

    // 在组件卸载时清理观察器
    return () => {
      if (grid) {
        const cards = Array.from(grid.children);
        cards.forEach((card) => {
          observer.unobserve(card);
        });
      }
    };
  }, []); // 空依赖数组意味着这个 effect 只在组件首次挂载时运行一次

  // 定义 Bento 网格中不同卡片的样式类
  const getGridClasses = (index: number) => {
    // 这是一个示例 Bento 布局，您可以根据喜好调整
    switch (index) {
      case 0: // 第 1 个特性，让它更宽
        return "md:col-span-2";
      case 3: // 第 4 个特性，也更宽
        return "md:col-span-2";
      case 6: // 第 7 个特性，在更大屏幕上占据整行
        return "md:col-span-1 lg:col-span-3";
      default: // 其他特性保持标准宽度
        return "md:col-span-1";
    }
  };

  return (
    <div
      ref={gridRef}
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
    >
      {features.map((feature, i) => (
        <div
          // 应用 Bento 网格类，并添加 'scroll-animate-card' 用于动画钩子
          class={`scroll-animate-card ${getGridClasses(i)}`}
        >
          {/* 增强的玻璃拟态效果 */}
          <div class="h-full bg-white/5 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
            <h4 class="text-xl font-semibold text-blue-400 mb-2">{feature.name}</h4>
            <p class="text-gray-400">{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
