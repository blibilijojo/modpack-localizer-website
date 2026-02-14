import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { texts } from "../content.ts";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

interface CacheData {
  downloadUrl: string | null;
  version: string | null;
  updateTime: string | null;
}

const cache: {
  data: CacheData | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

const CACHE_TTL = 15 * 60 * 1000;

interface PageData {
  downloadUrl: string | null;
  version: string | null;
  updateTime: string | null;
}

export const handler: Handlers<PageData> = {
  async GET(_, ctx) {
    const now = Date.now();
    if (cache.data && now - cache.timestamp < CACHE_TTL) {
      return ctx.render(cache.data);
    }
    
    try {
      const token = Deno.env.get("GITHUB_TOKEN");
      const headers = new Headers();
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }
      const resp = await fetch("https://api.github.com/repos/blibilijojo/Modpack-Localizer/releases/latest", { headers: headers });
      if (!resp.ok) {
        throw new Error(`GitHub API request failed with status ${resp.status}`);
      }
      const release = await resp.json();
      const asset = release.assets.find((a: any) => a.name.endsWith(".exe"));
      let formattedTime = null;
      if (release.published_at) {
        const utcDate = new Date(release.published_at);
        formattedTime = new Intl.DateTimeFormat("zh-CN", {
          timeZone: "Asia/Shanghai",
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(utcDate).replace(/\//g, '-');
      }
      
      const dataToRender: PageData = {
        downloadUrl: asset?.browser_download_url || release.html_url,
        version: release.tag_name || "N/A",
        updateTime: formattedTime,
      };

      cache.data = dataToRender;
      cache.timestamp = now;

      return ctx.render(dataToRender);
    } catch (error) {
      console.error("Failed to fetch latest release:", error);
      return ctx.render({
        downloadUrl: "https://github.com/blibilijojo/Modpack-Localizer/releases",
        version: "N/A",
        updateTime: "获取失败",
      });
    }
  },
};

export default function Home({ data }: PageProps<PageData>) {
  const { downloadUrl, version, updateTime } = data;

  return (
    <>
      <Head>
        <title>{texts.title}</title>
        <meta name="description" content={texts.description} />
      </Head>
      <div className="bg-gray-950 text-gray-200 min-h-screen font-sans">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <section className="relative overflow-hidden py-20 lg:py-32">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"></div>
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
              </div>
              <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700 mb-8">
                    <span className="text-green-400">✨</span>
                    <span className="text-sm">{texts.hero.subtitle}</span>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-extrabold mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400">
                      Modpack Localizer Pro
                    </span>
                  </h1>
                  <p className="text-xl lg:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                    {texts.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <a 
                      href={downloadUrl!} 
                      className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      {texts.latest_release} {version && `(${version})`}
                    </a>
                    <a
                      href={texts.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold text-lg px-8 py-4 rounded-xl border border-gray-700 transition-all duration-300 hover:-translate-y-1"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      {texts.view_on_github}
                    </a>
                  </div>
                  {updateTime && (
                    <p className="text-sm text-gray-500">
                      {texts.last_updated_at}{updateTime} (UTC+8)
                    </p>
                  )}
                  <div className="mt-16">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
                      <img 
                        src="/static/翻译控制台.png" 
                        alt="Modpack Localizer Pro 主界面" 
                        className="relative rounded-2xl shadow-2xl border border-gray-800 max-w-5xl w-full mx-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-20">
              <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    {texts.feature_showcase}
                  </span>
                </h2>
                <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto text-lg">
                  四大核心功能，让汉化工作事半功倍
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {texts.showcase_items.map((item, i) => (
                    <div 
                      key={i}
                      className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
                    >
                      <div className="relative overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-20 bg-gray-900/50">
              <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    {texts.features_title}
                  </span>
                </h2>
                <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto text-lg">
                  丰富的功能特性，满足各种汉化需求
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {texts.features.map((feature, i) => (
                    <div 
                      key={i}
                      className="group bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 transition-all duration-300 hover:border-blue-500/50 hover:bg-gray-800 hover:-translate-y-2 hover:shadow-xl"
                    >
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {feature.name}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-20">
              <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    {texts.acknowledgements_title}
                  </span>
                </h2>
                <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto text-lg">
                  {texts.acknowledgements_intro}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {texts.acknowledgements_list.map((ack, i) => (
                    <div 
                      key={i}
                      className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800"
                    >
                      <h3 className="text-xl font-bold mb-2">
                        <a 
                          href={ack.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {ack.name}
                        </a>
                        {ack.by && <span className="text-gray-500 font-normal text-sm ml-2">by {ack.by}</span>}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        {ack.desc}
                      </p>
                      {ack.copyright && (
                        <p 
                          className="text-xs text-gray-500" 
                          dangerouslySetInnerHTML={{ __html: ack.copyright }}
                        ></p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
