"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var path = __importStar(require("node:path"));
/**
 * Thanks to https://github.com/gergof/electron-builder-sandbox-fix for inspiration
 */
module.exports = function (context) {
    if (context.electronPlatformName === "linux") {
        var executableName = context.packager.executableName;
        var executable = path.join(context.appOutDir, executableName);
        var loaderScript = "#!/usr/bin/env bash\nset -u\n\nSCRIPT_DIR=\"$( cd \"$( dirname \"${BASH_SOURCE[0]}\" )\" && pwd )\"\nif [ \"$SCRIPT_DIR\" == \"/usr/bin\" ]; then\n  SCRIPT_DIR=\"/opt/".concat(context.packager.appInfo.productName, "\"\nfi\n\nif pgrep -x \"steam\" > /dev/null; then\n  exec \"$SCRIPT_DIR/").concat(executableName, ".bin\" --no-sandbox \"$@\"\nelse\n  exec \"$SCRIPT_DIR/").concat(executableName, ".bin\" \"$@\"\nfi\n");
        (0, node_fs_1.renameSync)(executable, executable + ".bin");
        (0, node_fs_1.writeFileSync)(executable, loaderScript, "utf8");
        (0, node_fs_1.chmodSync)(executable, 493);
    }
};
