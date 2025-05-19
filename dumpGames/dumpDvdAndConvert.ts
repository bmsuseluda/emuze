import {execFileSync} from "node:child_process";
import {rmSync} from "node:fs";
import {EOL} from "node:os";

const dumpDvdAndConvert = (name: string) => {
  console.log("start dumping dvd and analysing isosize", name);
  const [blockSize, volumeCount] = execFileSync(
    "isosize",
    ["-x", "/dev/cdrom"],
    {
      stdio: "inherit",
      encoding: "utf8",
    },
  )
    .toString()
    .split(EOL)
    .map((row) => row.split(":").at(-1)?.trim());

  console.log("creating iso file");
  execFileSync(
    "dd",
    [
      "if=/dev/cdrom",
      `of=${name}.iso`,
      `bs=${blockSize}`,
      `count=${volumeCount}`,
      "status=progress",
    ],
    { stdio: "inherit" },
  );

  console.log("creating chd file");
  execFileSync(
    "chdman",
    ["createcd", ...["-i", `${name}.iso`], ...["-o", `${name}.chd`]],
    { stdio: "inherit", encoding: "utf8" },
  );

  console.log("removing files");
  rmSync(`${name}.iso`);
};

dumpDvdAndConvert("Yakuza 2");
