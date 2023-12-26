import nodepath from "path";
import { execFileSync } from "child_process";

const sizes = ["256", "512"];

const getPngName = (size: string) =>
  nodepath.join(__dirname, "pngs", `icon${size}.png`);

try {
  sizes.forEach((size) => {
    execFileSync("flatpak", [
      "run",
      "org.inkscape.Inkscape",
      "-w",
      size,
      "-h",
      size,
      "-o",
      getPngName(size),
      nodepath.join(__dirname, "..", "artwork", "icon.svg"),
    ]);
  });

  execFileSync("magick", [
    "convert",
    ...sizes.map(getPngName),
    nodepath.join("public", "icon.ico"),
  ]);
} catch (e) {
  console.log(e);
}
