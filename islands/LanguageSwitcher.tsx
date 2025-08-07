// islands/LanguageSwitcher.tsx
import { lang } from "../content.ts";

export default function LanguageSwitcher() {
  const isSelected = (l: 'zh' | 'en') => lang.value === l;
  const buttonClass = (l: 'zh' | 'en') => `px-3 py-1 rounded-md text-sm font-medium transition-colors ${ isSelected(l) ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600" }`;
  return (
    <div class="flex items-center space-x-2">
      <button onClick={() => lang.value = 'zh'} class={buttonClass('zh')}>简体中文</button>
      <button onClick={() => lang.value = 'en'} class={buttonClass('en')}>English</button>
    </div>
  );
}