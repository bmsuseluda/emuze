import { defineConfig } from "vitepress";
import { withSidebar } from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig(
  withSidebar(
    {
      title: "emuze",
      description:
        "emuze is an emulation frontend designed to simplify your retro gaming experience.",
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: "Home", link: "/" },
          { text: "Changelog", link: "/changelog" },
        ],

        socialLinks: [
          { icon: "github", link: "https://github.com/bmsuseluda/emuze" },
          { icon: "discord", link: "https://discord.gg/tCzK7kc6Y4" },
        ],

        search: {
          provider: "local",
          options: {
            miniSearch: {
              /**
               * @type {Pick<import('minisearch').Options, 'extractField' | 'tokenize' | 'processTerm'>}
               */
              options: {
                /* ... */
              },
              /**
               * @type {import('minisearch').SearchOptions}
               * @default
               * { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } }
               */
              searchOptions: {
                boost: { title: 4 },
              },
            },
          },
        },
        logo: "/icon.svg",
      },
      appearance: "force-dark",
    },
    {
      collapsed: true,
      capitalizeFirst: true,
      useTitleFromFileHeading: true,
      documentRootPath: "/docs",
    },
  ),
);
