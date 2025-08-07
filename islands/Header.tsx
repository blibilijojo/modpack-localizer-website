import { lang, texts } from "../content.ts";
import LanguageSwitcher from "./LanguageSwitcher.tsx";

export default function Header() {
  const content = texts[lang.value];
  return (
    <header class="bg-gray-800 text-white shadow-md">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold tracking-tight">
          Modpack Localizer Pro
        </h1>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
