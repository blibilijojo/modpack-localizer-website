// islands/FeatureGrid.tsx

import { useEffect, useRef } from "preact/hooks";

interface Feature {
  name: string;
  desc: string;
}

interface FeatureGridProps {
  features: Feature[];
}

export default function FeatureGrid({ features }: FeatureGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const grid = gridRef.current;
    if (grid) {
      const cards = Array.from(grid.children);
      cards.forEach((card) => observer.observe(card));
    }

    return () => {
      if (grid) {
        const cards = Array.from(grid.children);
        cards.forEach((card) => observer.unobserve(card));
      }
    };
  }, []);

  const getGridClasses = (index: number) => {
    switch (index) {
      case 0: return "md:col-span-2";
      case 3: return "md:col-span-2";
      case 6: return "md:col-span-1 lg:col-span-3";
      default: return "md:col-span-1";
    }
  };

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
    >
      {features.map((feature, i) => (
        <div
          className={`scroll-animate-card ${getGridClasses(i)}`}
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          <div className="h-full bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:-translate-y-2">
            <h4 className="text-xl font-semibold text-blue-400 mb-2">{feature.name}</h4>
            <p className="text-gray-400">{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
