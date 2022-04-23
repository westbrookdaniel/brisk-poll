import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export let loader: LoaderFunction = () => {
  return json(
    {
      short_name: "Brisk Poll",
      name: "Brisk Poll",
      description: "Do better polls.",
      id: "/",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#ff4b39",
      shortcuts: [
        {
          name: "Create Poll",
          url: "/",
          icons: [
            { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
            { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
          ],
        },
      ],
      icons: [
        { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
        {
          src: "/icon-maskable-192.png",
          type: "image/png",
          sizes: "192x192",
          purpose: "maskable",
        },
        {
          src: "/icon-maskable-512.png",
          type: "image/png",
          sizes: "512x512",
          purpose: "maskable",
        },
      ],
    },
    {
      headers: { "Cache-Control": "public, max-age=600" },
    }
  );
};
