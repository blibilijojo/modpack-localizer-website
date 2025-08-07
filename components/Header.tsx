import LanguageSwitcher from "../islands/LanguageSwitcher.tsx";
import { Signal } from "@preact/signals";

interface HeaderProps {
  lang: Signal<"zh" | "en">;
}

export default function Header({ lang }: HeaderProps) {
  return (
    <header class="bg-gray-800 text-white shadow-md">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold tracking-tight">
          Modpack Localizer Pro
        </h1>
        <LanguageSwitcher lang={lang} />
      </div>
    </header>
  );
}
