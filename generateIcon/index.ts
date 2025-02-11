import nodepath from "path";
import { execFileSync } from "child_process";

const sizes = [
  "16",
  "24",
  "32",
  "48",
  "72",
  "96",
  "144",
  "152",
  "192",
  "196",
  "256",
  "512",
] as const;

const pngsDirectoryPath = nodepath.join("public", "icons");

const getPngName = (size: (typeof sizes)[number]) =>
  nodepath.join(pngsDirectoryPath, `icon${size}x${size}.png`);

try {
  sizes.forEach((size) => {
    execFileSync(
      "flatpak",
      [
        "run",
        "org.inkscape.Inkscape",
        "-w",
        size,
        "-h",
        size,
        "-o",
        getPngName(size),
        nodepath.join("artwork", "icon.svg"),
      ],
      {
        encoding: "utf8",
      },
    );
  });

  execFileSync(
    "magick",
    ["convert", ...sizes.map(getPngName), nodepath.join("public", "icon.ico")],
    {
      encoding: "utf8",
    },
  );
} catch (e) {
  console.log(e);
}
