import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get("url");
    
    if (!imageUrl) {
      return new Response("Missing image URL", { status: 400 });
    }
    
    try {
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        return new Response("Failed to fetch image", { status: response.status });
      }
      
      const contentType = response.headers.get("content-type") || "image/png";
      const body = await response.arrayBuffer();
      
      return new Response(body, {
        headers: {
          "content-type": contentType,
          "cache-control": "public, max-age=86400",
        },
      });
    } catch (error) {
      console.error("Proxy error:", error);
      return new Response("Proxy error", { status: 500 });
    }
  },
};