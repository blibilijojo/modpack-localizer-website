// routes/_layout.tsx
import { PageProps } from "$fresh/server.ts";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

export default function Layout({ Component }: PageProps) {
  return (
    <div class="bg-gray-900 text-gray-200 min-h-screen font-sans">
      <Header />
      <main>
        <Component />
      </main>
      <Footer />
    </div>
  );
}
