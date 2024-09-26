import nodepath from "path";
import { TestName } from "../ports";

export const configFolderPath = nodepath.join(__dirname, "wrongRomsPathConfig");
export const e2ePath = nodepath.join(__dirname, "..", "..");
export const testName: TestName = "wrongRomsPath";
