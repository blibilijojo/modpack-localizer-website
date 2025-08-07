import { Head } from "$fresh/runtime.ts";
import { lang, texts } from "../content.ts";

interface HomeProps {
  downloadUrl: string | null;
  version: string | null;
}

export default function HomePage({ downloadUrl, version }: HomeProps) {
  const content = texts[lang.value];

  return (
    <>
      <Head>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
      </Head>
      <div class="container mx-auto px-6 py-12">
        <section class="text-center">
          <h2 class="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Modpack Localizer Pro
          </h2>
          <p class="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            {content.description}
          </p>
          <div class="mt-8">
            <a href={downloadUrl!} class="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
              {content.latest_release} {version && `(${version})`}
            </a>
          </div>
          <div class="mt-12">
             <img src="https://github.com/user-attachments/assets/dc267e88-7e56-4242-b750-babfca545a2a" alt="App Screenshot" class="rounded-lg shadow-2xl mx-auto max-w-4xl w-full" />
          </div>
        </section>

        <section class="mt-20">
            <h3 class="text-3xl font-bold text-center mb-10">{content.feature_showcase}</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div class="bg-gray-800 p-4 rounded-lg">
                    <h4 class="text-xl font-semibold mb-2 text-center">{content.manual_workbench}</h4>
                    <p class="text-sm text-gray-400 mb-4 text-center">{content.manual_workbench_desc}</p>
                    <img src="https://github.com/user-attachments/assets/81e8a99e-cdd3-4442-8bd8-649da76b7675" alt="Manual Translation Workbench" class="rounded-md shadow-lg"/>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                    <h4 class="text-xl font-semibold mb-2 text-center">{content.dict_search}</h4>
                    <p class="text-sm text-gray-400 mb-4 text-center">{content.dict_search_desc}</p>
                    <img src="https://github.com/user-attachments/assets/e78dee9a-92d8-44c2-b3f3-20cc744e81da" alt="Community Dictionary Search" class="rounded-md shadow-lg"/>
                </div>
            </div>
        </section>
        
        <section class="mt-20">
            <h3 class="text-3xl font-bold text-center mb-10">{content.features_title}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.features.map(feature => (
                    <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h4 class="text-xl font-semibold text-blue-400 mb-2">{feature.name}</h4>
                        <p class="text-gray-400">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </>
  );
}
