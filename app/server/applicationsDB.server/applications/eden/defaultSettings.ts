import { normalizeNewLines } from "../../configFile.js";

export const defaultSettings = normalizeNewLines(`[UI]
firstStart\\default=false
firstStart=false
confirmStop\\default=false
confirmStop=2
disableControllerApplet\\default=false
disableControllerApplet=true
check_for_updates\\default=false
check_for_updates=false
Shortcuts\\Main%20Window\\Fullscreen\\KeySeq\\default=false
Shortcuts\\Main%20Window\\Fullscreen\\KeySeq=F2
Shortcuts\\Main%20Window\\Fullscreen\\Controller_KeySeq\\default=false
Shortcuts\\Main%20Window\\Fullscreen\\Controller_KeySeq=Home+B
Shortcuts\\Main%20Window\\Fullscreen\\Context\\default=false
Shortcuts\\Main%20Window\\Fullscreen\\Context=1
Shortcuts\\Main%20Window\\Fullscreen\\Repeat\\default=true
Shortcuts\\Main%20Window\\Fullscreen\\Repeat=false`);
