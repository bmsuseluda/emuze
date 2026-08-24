import { defineConfig } from "vitepress";
import { withSidebar } from "vitepress-sidebar";

export default defineConfig(
  withSidebar(
    {
      title: "emuze",
      description:
        "emuze is an emulation frontend designed to simplify your retro gaming experience.",
      head: [["link", { rel: "icon", href: "/favicon.ico" }]],
      transformHead({ assets }) {
        const myFontFile = assets.find((file) =>
          /AnnieUseYourTelescope-Regular\.[\w-]+\.ttf/.test(file),
        );
        if (myFontFile) {
          return [
            [
              "link",
              {
                rel: "preload",
                href: myFontFile,
                as: "font",
                type: "font/ttf",
                crossorigin: "",
              },
            ],
          ];
        }
      },
      themeConfig: {
        nav: [{ text: "Changelog", link: "/changelog" }],

        footer: {
          message: "Released under the GPL-3.0 License.",
          copyright: "Copyright © 2022-present bmsuseluda",
        },

        socialLinks: [
          { icon: "github", link: "https://github.com/bmsuseluda/emuze" },
          { icon: "discord", link: "https://discord.gg/tCzK7kc6Y4" },
          { icon: "mastodon", link: "https://mastodon.social/@bmsuseluda" },
        ],

        search: {
          provider: "local",
          options: {
            miniSearch: {
              searchOptions: {
                boost: { title: 4 },
              },
            },
          },
        },
        logo: "/icon.svg",
        docFooter: {
          prev: false,
          next: false,
        },
      },
      appearance: "force-dark",
    },
    {
      collapsed: false,
      capitalizeFirst: true,
      useTitleFromFileHeading: true,
      documentRootPath: "/docs",
      sortMenusByFrontmatterOrder: true,
      // excludeByGlobPattern: ["CHANGELOG.MD"],
    },
  ),
);
