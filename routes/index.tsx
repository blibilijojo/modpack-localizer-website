import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { texts } from "../content.ts";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

interface Data {
  downloadUrl: string | null;
  version: string | null;
  updateTime: string | null; // 新增：用于存放格式化后的时间字符串
}

export const handler: Handlers<Data> = {
  async GET(_, ctx) {
    try {
      const token = Deno.env.get("GITHUB_TOKEN");
      const headers = new Headers();
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }

      const resp = await fetch("https://api.github.com/repos/blibilijojo/Modpack-Localizer/releases/latest", {
        headers: headers,
      });

      if (!resp.ok) {
        const errorBody = await resp.text();
        throw new Error(`GitHub API request failed with status ${resp.status}: ${errorBody}`);
      }

      const release = await resp.json();
      const asset = release.assets.find((a: any) => a.name.endsWith(".exe"));
      
      // --- 新增：处理和格式化发布时间 ---
      let formattedTime = null;
      if (release.published_at) {
        const date = new Date(release.published_at);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      // --- 新增结束 ---

      return ctx.render({ 
        downloadUrl: asset?.browser_download_url || release.html_url,
        version: release.tag_name || "N/A",
        updateTime: formattedTime, // 将格式化后的时间传递给页面
      });
    } catch (error) {
      console.error("Failed to fetch latest release:", error);
      return ctx.render({ 
        downloadUrl: "https://github.com/blibilijojo/Modpack-Localizer/releases",
        version: null,
        updateTime: null,
      });
    }
  },
};

export default function Home({ data }: PageProps<Data>) {
  // 从 data 中解构出新的 updateTime
  const { downloadUrl, version, updateTime } = data;

  return (
    <>
      <Head>
        <title>{texts.title}</title>
        <meta name="description" content={texts.description} />
      </Head>
      <div class="bg-gray-900 text-gray-200 min-h-screen font-sans">
        <Header />
        <main class="container mx-auto px-6 py-12">
          <section class="text-center">
            <h2 class="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
              Modpack Localizer Pro
            </h2>
            <p class="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
              {texts.description}
            </p>
            <div class="mt-8">
              <a href={downloadUrl!} class="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                {texts.latest_release} {version && `(${version})`}
              </a>
              {/* --- 新增：在下载按钮下方显示更新时间 --- */}
              {updateTime && (
                <p class="mt-2 text-sm text-gray-500">
                  {texts.last_updated_at}{updateTime}
                </p>
              )}
              {/* --- 新增结束 --- */}
            </div>
            <div class="mt-12">
               <img src="https://github.com/user-attachments/assets/dc267e88-7e56-4242-b750-babfca545a2a" alt="App Screenshot" class="rounded-lg shadow-2xl mx-auto max-w-4xl w-full" />
            </div>
          </section>
          
          {/* ... 其他板块保持不变 ... */}

          <section class="mt-20">
              <h3 class="text-3xl font-bold text-center mb-10">{texts.feature_showcase}</h3>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  <div class="bg-gray-800 p-4 rounded-lg">
                      <h4 class="text-xl font-semibold mb-2 text-center">{texts.manual_workbench}</h4>
                      <p class="text-sm text-gray-400 mb-4 text-center">{texts.manual_workbench_desc}</p>
                      <img src="https://github.com/user-attachments/assets/81e8a99e-cdd3-4442-8bd8-649da76b7675" alt="Manual Translation Workbench" class="rounded-md shadow-lg"/>
                  </div>
                  <div class="bg-gray-800 p-4 rounded-lg">
                      <h4 class="text-xl font-semibold mb-2 text-center">{texts.dict_search}</h4>
                      <p class="text-sm text-gray-400 mb-4 text-center">{texts.dict_search_desc}</p>
                      <img src="https://github.com/user-attachments/assets/e78dee9a-92d8-44c2-b3f3-20cc744e81da" alt="Community Dictionary Search" class="rounded-md shadow-lg"/>
                  </div>
              </div>
          </section>
          <section class="mt-20">
              <h3 class="text-3xl font-bold text-center mb-10">{texts.features_title}</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {texts.features.map(feature => (
                      <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                          <h4 class="text-xl font-semibold text-blue-400 mb-2">{feature.name}</h4>
                          <p class="text-gray-400">{feature.desc}</p>
                      </div>
                  ))}
              </div>
          </section>
          <section class="mt-20">
            <h3 class="text-3xl font-bold text-center mb-10">{texts.acknowledgements_title}</h3>
            <p class="text-center text-gray-400 max-w-3xl mx-auto mb-8">
              {texts.acknowledgements_intro}
            </p>
            <div class="space-y-6 max-w-3xl mx-auto">
              {texts.acknowledgements_list.map(item => (
                <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" class="text-xl font-semibold text-blue-400 hover:underline">
                    {item.name}
                  </a>
                  <p class="text-gray-400 mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
