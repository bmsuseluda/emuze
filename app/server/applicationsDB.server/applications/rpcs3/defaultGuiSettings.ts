import { normalizeNewLines } from "../../configFile.js";

export const defaultGuiSettings = normalizeNewLines(`[Debugger]

[GameList]
hidden_list=@Invalid()
marginFactor=0.09
sortAsc=true
sortCol=1
textFactor=2
visibility_column_category=true
visibility_column_compat=true
visibility_column_dir_size=true
visibility_column_firmware=false
visibility_column_icon=true
visibility_column_last_play=true
visibility_column_move=true
visibility_column_name=true
visibility_column_parental=false
visibility_column_path=false
visibility_column_playtime=true
visibility_column_resolution=true
visibility_column_serial=true
visibility_column_sound=false
visibility_column_version=true

[Localization]
language=en

[Logger]
ANSI_code=true
ERR_stack=true
level=4
stack=true

[Meta]
attachCommandLine=false
checkUpdateStart=false
discordState=
showDebugTab=false
useRichPresence=true

[main_window]
confirmationBoxExitGame=false
infoBoxEnabledWelcome=false
`);
