import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { texts } from "../content.ts";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

// --- 全新、已修复的星空背景组件 ---
function StarField() {
  // 我们不再使用有问题的 box-shadow 语法，而是直接让 div 作为星星本身，并用动画驱动它们。
  // 为了模拟随机分布，我们使用了一个包含大量 shadow 的容器。
  // 这些 shadow 值是预先生成的，以确保它们 100% 有效。
  const shadowsSmall = "796px 985px #fff, 1359px 385px #fff, 958px 102px #fff, 182px 1899px #fff, 1854px 1735px #fff, 1431px 1905px #fff, 1485px 339px #fff, 638px 1007px #fff, 1519px 1233px #fff, 133px 1278px #fff, 115px 120px #fff, 1632px 1475px #fff, 1075px 1222px #fff, 1289px 1253px #fff, 396px 1314px #fff, 1533px 1018px #fff, 1060px 1746px #fff, 1581px 190px #fff, 706px 1863px #fff, 103px 179px #fff";
  const shadowsMedium = "186px 876px #fff, 1530px 1013px #fff, 421px 1879px #fff, 1191px 1584px #fff, 1845px 1889px #fff, 1582px 1438px #fff, 808px 633px #fff, 383px 443px #fff, 49px 1144px #fff, 1344px 1886px #fff, 853px 480px #fff, 747px 1196px #fff, 527px 1546px #fff, 1113px 1243px #fff, 1450px 1568px #fff";
  const shadowsLarge = "517px 1747px #fff, 1529px 1139px #fff, 1414px 1836px #fff, 1835px 44px #fff, 1603px 448px #fff, 619px 1307px #fff, 1333px 1001px #fff, 122px 145px #fff, 1788px 1391px #fff, 357px 1163px #fff";

  return (
    <div class="absolute top-0 left-0 right-0 bottom-0 z-0 overflow-hidden">
      {/* 图层 1: 小星星, 速度最慢 (远景) */}
      <div 
        class="absolute w-1 h-1 bg-white rounded-full animate-stars-slow top-0"
        style={{ boxShadow: shadowsSmall }}
      ></div>
      
      {/* 图层 2: 中等星星, 速度中等 (中景) */}
      <div 
        class="absolute w-2 h-2 bg-white rounded-full animate-stars-medium top-0"
        style={{ boxShadow: shadowsMedium }}
      ></div>

      {/* 图层 3: 大星星, 速度最快 (近景) */}
      <div 
        class="absolute w-3 h-3 bg-white rounded-full animate-stars-fast top-0"
        style={{ boxShadow: shadowsLarge }}
      ></div>
    </div>
  );
}

interface Data {
  downloadUrl: string | null;
  version: string | null;
  updateTime: string | null;
}

export const handler: Handlers<Data> = {
  // handler 代码保持不变
  async GET(_, ctx) {
    try {
      const token = Deno.env.get("GITHUB_TOKEN");
      const headers = new Headers();
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }
      const resp = await fetch("https://api.github.com/repos/blibilijojo/Modpack-Localizer/releases/latest", { headers: headers });
      if (!resp.ok) {
        const errorBody = await resp.text();
        throw new Error(`GitHub API request failed with status ${resp.status}: ${errorBody}`);
      }
      const release = await resp.json();
      const asset = release.assets.find((a: any) => a.name.endsWith(".exe"));
      let formattedTime = null;
      if (release.published_at) {
        const utcDate = new Date(release.published_at);
        const cstTimestamp = utcDate.getTime() + (8 * 60 * 60 * 1000);
        const cstDate = new Date(cstTimestamp);
        const year = cstDate.getUTCFullYear();
        const month = String(cstDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(cstDate.getUTCDate()).padStart(2, '0');
        const hours = String(cstDate.getUTCHours()).padStart(2, '0');
        const minutes = String(cstDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(cstDate.getUTCSeconds()).padStart(2, '0');
        formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      return ctx.render({ 
        downloadUrl: asset?.browser_download_url || release.html_url,
        version: release.tag_name || "N/A",
        updateTime: formattedTime,
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
  const { downloadUrl, version, updateTime } = data;

  return (
    <>
      <Head>
        <title>{texts.title}</title>
        <meta name="description" content={texts.description} />
      </Head>
      <div class="bg-gray-900 text-gray-200 min-h-screen font-sans relative" style={{ isolation: 'isolate' }}>
        {/* 背景层 */}
        <StarField />

        {/* 内容层 */}
        <div class="relative z-10">
          <Header />
          <main class="container mx-auto px-6 py-12">
            {/* ... 所有 section 内容保持不变 ... */}
            <section class="text-center">
              <h2 class="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 animate-fade-in-down" style="animation-delay: 0.2s;">
                Modpack Localizer Pro
              </h2>
              <p class="mt-4 max-w-2xl mx-auto text-lg text-gray-400 animate-fade-in-down" style="animation-delay: 0.4s;">
                {texts.description}
              </p>
              <div class="mt-8 animate-fade-in-down" style="animation-delay: 0.6s;">
                <a href={downloadUrl!} class="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                  {texts.latest_release} {version && `(${version})`}
                </a>
                {updateTime && (
                  <p class="mt-2 text-sm text-gray-500">
                    {texts.last_updated_at}{updateTime} (UTC+8)
                  </p>
                )}
              </div>
              <div class="mt-12 animate-fade-in" style="animation-delay: 0.8s;">
                 <img src="https://github.com/user-attachments/assets/dc267e88-7e56-4242-b750-babfca545a2a" alt="App Screenshot" class="rounded-lg shadow-2xl mx-auto max-w-4xl w-full" />
              </div>
            </section>
            
            <section class="mt-20">
                <h3 class="text-3xl font-bold text-center mb-10 animate-fade-in">{texts.feature_showcase}</h3>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div class="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg animate-fade-in border border-gray-700" style="animation-delay: 0.2s;">
                        <h4 class="text-xl font-semibold mb-2 text-center">{texts.manual_workbench}</h4>
                        <p class="text-sm text-gray-400 mb-4 text-center">{texts.manual_workbench_desc}</p>
                        <img src="https://github.com/user-attachments/assets/81e8a99e-cdd3-4442-8bd8-649da76b7675" alt="Manual Translation Workbench" class="rounded-md shadow-lg"/>
                    </div>
                    <div class="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg animate-fade-in border border-gray-700" style="animation-delay: 0.4s;">
                        <h4 class="text-xl font-semibold mb-2 text-center">{texts.dict_search}</h4>
                        <p class="text-sm text-gray-400 mb-4 text-center">{texts.dict_search_desc}</p>
                        <img src="https://github.com/user-attachments/assets/e78dee9a-92d8-44c2-b3f3-20cc744e81da" alt="Community Dictionary Search" class="rounded-md shadow-lg"/>
                    </div>
                </div>
            </section>
            <section class="mt-20">
                <h3 class="text-3xl font-bold text-center mb-10 animate-fade-in">{texts.features_title}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {texts.features.map((feature, i) => (
                        <div class="bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-2 animate-fade-in border border-gray-700" style={{ animationDelay: `${i * 0.1 + 0.2}s` }}>
                            <h4 class="text-xl font-semibold text-blue-400 mb-2">{feature.name}</h4>
                            <p class="text-gray-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section class="mt-20">
              <h3 class="text-3xl font-bold text-center mb-10 animate-fade-in">{texts.acknowledgements_title}</h3>
              <p class="text-center text-gray-400 max-w-3xl mx-auto mb-8 animate-fade-in" style="animation-delay: 0.2s;">
                {texts.acknowledgements_intro}
              </p>
              <div class="space-y-6 max-w-3xl mx-auto">
                {texts.acknowledgements_list.map((item, i) => (
                  <div class="bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-teal-500/20 hover:-translate-y-2 animate-fade-in border border-gray-700" style={{ animationDelay: `${i * 0.2 + 0.4}s` }}>
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
      </div>
    </>
  );
}
