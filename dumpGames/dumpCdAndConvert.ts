import { execFileSync } from "child_process";
import { rmSync } from "node:fs";

const dumpCdAndConvert = (name: string) => {
  execFileSync("cdrdao", [
    "read-cd",
    ...["--datafile", `${name}.bin`],
    ...["--driver", "generic-mmc:0x20000"],
    ...["--device", "/dev/cdrom"],
    ...["--read-raw", `${name}.toc`],
  ]);

  execFileSync("toc2cue", [`${name}.toc`, `${name}.cue`]);

  execFileSync("chdman", [
    "createcd",
    ...["-i", `${name}.cue`],
    ...["-o", `${name}.chd`],
  ]);

  rmSync(`${name}.toc`);
  rmSync(`${name}.bin`);
  rmSync(`${name}.cue`);
};

dumpCdAndConvert("TOBAL No.1");
