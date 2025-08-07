interface FooterProps {
  content: {
    footer_text: string;
    view_on_github: string;
  };
}

export default function Footer({ content }: FooterProps) {
  return (
    <footer class="bg-gray-800 text-white mt-16">
      <div class="container mx-auto px-6 py-4 text-center text-sm text-gray-400">
        <p>{content.footer_text}</p>
        <a 
          href="https://github.com/blibilijojo/Modpack-Localizer" 
          target="_blank" 
          rel="noopener noreferrer"
          class="underline hover:text-blue-400 mt-2 inline-block"
        >
          {content.view_on_github}
        </a>
      </div>
    </footer>
  );
}
