import nodepath from "path";
import { TestName } from "../ports";

export const configFolderPath = nodepath.join(__dirname, "emptyConfig");

export const e2ePath = nodepath.join(__dirname, "..", "..");
export const testName: TestName = "initial";
