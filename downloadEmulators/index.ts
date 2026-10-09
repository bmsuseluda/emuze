import { createEmulatorsManifestFile } from "./createEmulatorsManifest.js";
import { downloadEmulators } from "./downloadEmulators.js";
import { getEmulatorsFromLatestArtifact } from "./downloadEmulatorsFromLatestArtifact.js";

await getEmulatorsFromLatestArtifact();
downloadEmulators();
createEmulatorsManifestFile();
