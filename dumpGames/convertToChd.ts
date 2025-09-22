import { execFileSync } from "child_process";
import path from "node:path";

export const convertToChd = (filename: string) => {
  const name = filename.split(`.${path.extname}`).at(0);
  console.log(`creating chd file for ${filename}`);
  execFileSync(
    "chdman",
    ["createcd", ...["-i", `${filename}`], ...["-o", `${name}.chd`]],
    { stdio: "inherit", encoding: "utf8" },
  );
};
