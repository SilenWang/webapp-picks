import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Webapp Picks",
    short_name: "Webapp Picks",
    description: "A curated collection of web applications for FydeOS",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
    categories: ["utilities", "productivity"],
    lang: "zh-CN",
  };
}
