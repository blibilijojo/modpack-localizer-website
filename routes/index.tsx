import { Handlers, PageProps } from "$fresh/server.ts";
import HomePage from "../islands/HomePage.tsx";

interface Data {
  downloadUrl: string | null;
  version: string | null;
}

export const handler: Handlers<Data> = {
  async GET(_, ctx) {
    try {
      const resp = await fetch("https://api.github.com/repos/blibilijojo/Modpack-Localizer/releases/latest");
      if (!resp.ok) throw new Error("GitHub API request failed");
      const release = await resp.json();
      const asset = release.assets.find((a: any) => a.name.endsWith(".exe"));
      return ctx.render({ 
        downloadUrl: asset?.browser_download_url || release.html_url,
        version: release.tag_name || "N/A"
      });
    } catch (error) {
      console.error("Failed to fetch latest release:", error.message);
      return ctx.render({ downloadUrl: "https://github.com/blibilijojo/Modpack-Localizer/releases", version: null });
    }
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <HomePage downloadUrl={data.downloadUrl} version={data.version} />
  );
}
