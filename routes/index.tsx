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

const ColorMap: Record<string, string> = {
  cyan: "from-cyan-500 via-blue-400 to-cyan-500",
  purple: "from-purple-500 via-indigo-400 to-purple-500",
  blue: "from-blue-500 via-cyan-400 to-blue-500",
  green: "from-green-500 via-emerald-400 to-green-500",
  yellow: "from-yellow-500 via-amber-400 to-yellow-500",
  orange: "from-orange-500 via-yellow-400 to-orange-500",
  pink: "from-pink-500 via-purple-400 to-pink-500",
};

const ColorGlow: Record<string, string> = {
  cyan: "shadow-cyan-500/20",
  purple: "shadow-purple-500/20",
  blue: "shadow-blue-500/20",
  green: "shadow-green-500/20",
  yellow: "shadow-yellow-500/20",
  orange: "shadow-orange-500/20",
  pink: "shadow-pink-500/20",
};

export default function Home({ data }: PageProps<PageData>) {
  const { downloadUrl, version, updateTime } = data;

  return (
    <>
      <Head>
        <title>{texts.title}</title>
        <meta name="description" content={texts.description} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            background-color: #f0f9ff;
            color: #0f172a;
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
          }
          
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes subtle-float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          
          @keyframes pulse-glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(6, 182, 212, 0.1);
            }
            50% {
              box-shadow: 0 0 30px rgba(6, 182, 212, 0.4), 0 0 60px rgba(6, 182, 212, 0.2);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
          
          .animate-subtle-float {
            animation: subtle-float 8s ease-in-out infinite;
          }
          
          .animate-pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }
          
          .text-gradient {
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .bg-minecraft-pattern {
            background-image: 
              radial-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              radial-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px);
            background-size: 40px 40px;
            background-position: 0 0, 20px 20px;
          }
          
          .mc-card {
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }
          
          .mc-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px -5px rgba(6, 182, 212, 0.1), 0 8px 10px -6px rgba(6, 182, 212, 0.1);
          }
          
          .mc-button {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .mc-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s ease;
          }
          
          .mc-button:hover::before {
            left: 100%;
          }
        `}</style>
      </Head>
      <div className="bg-gradient-to-b from-blue-50 to-cyan-50 text-gray-900 min-h-screen font-sans overflow-x-hidden">
        <div className="fixed inset-0 bg-minecraft-pattern pointer-events-none opacity-50"></div>
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-20">
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-20">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-50 pointer-events-none"></div>
              <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                  <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full border border-cyan-200 mb-8 shadow-sm">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-mono text-cyan-600 tracking-wider">{texts.hero.subtitle}</span>
                    </div>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                      <span className="block text-gradient bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600">
                        {texts.hero.tagline}
                      </span>
                    </h1>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                      {texts.hero.description}
                    </p>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                      <a 
                        href={downloadUrl!} 
                        className="mc-button inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        <span className="font-bold text-lg">{texts.latest_release} {version && `(${version})`}</span>
                      </a>
                      <a
                        href={texts.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mc-button inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-800 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:shadow-gray-200/50"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="font-bold text-lg">{texts.view_on_github}</span>
                      </a>
                    </div>
                  </div>
                  {updateTime && (
                    <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                      <p className="text-sm text-gray-500 font-mono">
                        <span className="text-cyan-600">[SYSTEM]</span> {texts.last_updated_at}{updateTime} (UTC+8)
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-16 animate-subtle-float">
                  <div className="relative max-w-5xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl animate-pulse-glow"></div>
                    <img 
                      src={texts.showcase_items[0].image} 
                      alt="Modpack Localizer Pro Interface" 
                      className="relative rounded-2xl shadow-xl border border-cyan-100 max-w-full mx-auto"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="py-24 relative bg-gradient-to-b from-white to-blue-50">
              <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                  <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      <span className="text-gradient bg-gradient-to-r from-cyan-600 to-blue-600">
                        {texts.feature_showcase}
                      </span>
                    </h2>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <p className="text-gray-700 text-lg">
                      四大核心功能模块，为您的 Minecraft 整合包汉化工作提供全方位支持
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {texts.showcase_items.map((item, i) => (
                    <div 
                      key={item.id}
                      className={`mc-card relative bg-white/90 backdrop-blur-sm rounded-2xl border border-cyan-100 overflow-hidden transition-all duration-500 hover:border-cyan-300 hover:shadow-xl hover:${ColorGlow[item.color] || 'shadow-cyan-500/20'} hover:-translate-y-2 animate-fade-in`}
                      style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${ColorMap[item.color] || ColorMap.cyan}"></div>
                      <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center text-2xl border border-cyan-100 ${ColorGlow[item.color] || 'shadow-cyan-500/20'}`}>
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-sm font-mono text-cyan-600 tracking-wider mb-1">{item.title}</h3>
                            <h4 className="text-xl font-bold text-gray-900">{item.subtitle}</h4>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                          {item.desc}
                        </p>
                        <div className="relative overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="relative rounded-xl border border-cyan-100 w-full shadow-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-24 relative bg-gradient-to-b from-blue-50 to-cyan-50">
              <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                  <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      <span className="text-gradient bg-gradient-to-r from-cyan-600 to-blue-600">
                        {texts.features_title}
                      </span>
                    </h2>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <p className="text-gray-700 text-lg">
                      先进的功能特性，让汉化工作更加智能、高效、可靠
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {texts.features.map((feature, i) => (
                    <div 
                      key={i}
                      className={`mc-card group relative bg-white/90 backdrop-blur-sm rounded-xl border border-cyan-100 p-6 transition-all duration-500 hover:border-cyan-300 hover:shadow-xl hover:${ColorGlow[feature.color] || 'shadow-cyan-500/20'} hover:-translate-y-1 animate-fade-in`}
                      style={{ animationDelay: `${0.2 + i * 0.05}s` }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${ColorMap[feature.color] || ColorMap.cyan}"></div>
                      <div className={`w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center text-xl mb-4 border border-cyan-100 ${ColorGlow[feature.color] || 'shadow-cyan-500/20'}`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">
                        {feature.name}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-24 relative bg-gradient-to-b from-cyan-50 to-white">
              <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                  <div className="mc-card bg-white/90 backdrop-blur-sm rounded-2xl border border-cyan-100 overflow-hidden shadow-xl">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"></div>
                    <div className="p-8 md:p-12">
                      <div className="text-center mb-10">
                        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                          <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-gradient bg-gradient-to-r from-cyan-600 to-blue-600">
                              {texts.acknowledgements_title}
                            </span>
                          </h2>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                          <p className="text-gray-700">
                            {texts.acknowledgements_intro}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {texts.acknowledgements_list.map((ack, i) => (
                          <div 
                            key={i}
                            className="mc-card group bg-cyan-50 rounded-xl border border-cyan-100 p-6 transition-all duration-300 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 animate-fade-in"
                            style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                          >
                            <h3 className="text-lg font-bold mb-2">
                              <a 
                                href={ack.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-cyan-600 hover:text-cyan-700 transition-colors"
                              >
                                {ack.name}
                              </a>
                              {ack.by && <span className="text-gray-600 font-normal text-sm ml-2">by {ack.by}</span>}
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {ack.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-24 relative bg-gradient-to-b from-white to-blue-50">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-50 pointer-events-none"></div>
              <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                      <span className="text-gradient bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600">
                        {texts.cta_section.title}
                      </span>
                    </h2>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <p className="text-gray-700 text-lg mb-10 max-w-2xl mx-auto">
                      {texts.cta_section.subtitle}
                    </p>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <a 
                      href={downloadUrl!} 
                      className="mc-button inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-500"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      <span className="font-bold text-xl">{texts.cta_section.button}</span>
                    </a>
                  </div>
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
