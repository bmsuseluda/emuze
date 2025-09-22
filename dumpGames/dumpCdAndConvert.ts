import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";
import { convertToChd } from "./convertToChd.js";

const dumpCdAndConvert = (name: string) => {
  console.log("start dumping cd and creating bin and toc file", name);
  execFileSync(
    "cdrdao",
    [
      "read-cd",
      ...["--datafile", `${name}.bin`],
      ...["--driver", "generic-mmc:0x20000"],
      ...["--device", "/dev/cdrom"],
      ...["--read-raw", `${name}.toc`],
    ],
    { stdio: "inherit", encoding: "utf8" },
  );

  console.log("creating cue file");
  execFileSync("toc2cue", [`${name}.toc`, `${name}.cue`], {
    stdio: "inherit",
    encoding: "utf8",
  });

  convertToChd(`${name}.cue`);

  console.log("removing files");
  rmSync(`${name}.toc`);
  rmSync(`${name}.bin`);
  rmSync(`${name}.cue`);
};

dumpCdAndConvert("Disruptor");
