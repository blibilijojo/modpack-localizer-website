// components/Footer.tsx

import { texts } from "../content.ts";

export default function Footer() {
  return (
    <footer class="bg-gray-800 text-white mt-16">
      <div class="container mx-auto px-6 py-8 text-center text-sm text-gray-400">
        <p>{texts.footer_text}</p>
        <a
          href="https://github.com/blibilijojo/Modpack-Localizer"
          target="_blank"
          rel="noopener noreferrer"
          // --- 新增/修改的类，用于实现下划线动画 ---
          class="relative inline-block mt-4 text-gray-300 hover:text-blue-400 transition-colors duration-300
                 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 
                 after:h-[2px] after:w-0 after:bg-blue-400
                 after:transition-all after:duration-300 hover:after:w-full"
        >
          {texts.view_on_github}
        </a>
      </div>
    </footer>
  );
}
