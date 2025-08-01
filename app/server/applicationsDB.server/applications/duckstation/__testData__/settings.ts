export const main = `[Main]
SettingsVersion = 3
EmulationSpeed = 1,000000
FastForwardSpeed = 0,000000
TurboSpeed = 0,000000
SyncToHostRefreshRate = false
IncreaseTimerResolution = true
InhibitScreensaver = true
StartPaused = false
StartFullscreen = false
PauseOnFocusLoss = false
PauseOnMenu = true
SaveStateOnExit = true
CreateSaveStateBackups = true
CompressSaveStates = true
ConfirmPowerOff = true
LoadDevicesFromSaveStates = false
ApplyCompatibilitySettings = true
ApplyGameSettings = true
AutoLoadCheats = true
DisableAllEnhancements = false
RewindEnable = false
RewindFrequency = 10,000000
RewindSaveSlots = 10
RunaheadFrameCount = 0
EnableDiscordPresence = false


`;

export const console = `[Console]
Region = Auto
Enable8MBRAM = false


`;

export const cpu = `[CPU]
ExecutionMode = Recompiler
OverclockEnable = false
OverclockNumerator = 1
OverclockDenominator = 1
RecompilerMemoryExceptions = false
RecompilerBlockLinking = true
RecompilerICache = false
FastmemMode = MMap


`;

export const gpu = `[GPU]
Renderer = OpenGL
Adapter = 
ResolutionScale = 1
Multisamples = 1
UseDebugDevice = false
PerSampleShading = false
UseThread = true
ThreadedPresentation = true
UseSoftwareRendererForReadbacks = false
TrueColor = true
ScaledDithering = true
TextureFilter = Nearest
DownsampleMode = Disabled
DisableInterlacing = true
ForceNTSCTimings = false
WidescreenHack = false
ChromaSmoothing24Bit = false
PGXPEnable = false
PGXPCulling = true
PGXPTextureCorrection = true
PGXPColorCorrection = false
PGXPVertexCache = false
PGXPCPU = false
PGXPPreserveProjFP = false
PGXPTolerance = -1,000000
PGXPDepthBuffer = false
PGXPDepthClearThreshold = 1228800,000000


`;

export const display = `[Display]
CropMode = Overscan
ActiveStartOffset = 0
ActiveEndOffset = 0
LineStartOffset = 0
LineEndOffset = 0
Force4_3For24Bit = false
AspectRatio = Auto (Game Native)
Alignment = Center
CustomAspectRatioNumerator = 0
LinearFiltering = true
IntegerScaling = false
Stretch = false
PostProcessing = false
ShowOSDMessages = true
ShowFPS = false
ShowSpeed = false
ShowResolution = false
ShowCPU = false
ShowGPU = false
ShowStatusIndicators = true
ShowInputs = false
ShowEnhancements = false
DisplayAllFrames = false
InternalResolutionScreenshots = false
VSync = false
MaxFPS = 0,000000
OSDScale = 100,000000


`;

export const cdrom = `[CDROM]
ReadaheadSectors = 8
RegionCheck = false
LoadImageToRAM = false
LoadImagePatches = false
MuteCDAudio = false
ReadSpeedup = 1
SeekSpeedup = 1


`;

export const audio = `[Audio]
Backend = Cubeb
Driver =
StretchMode = TimeStretch
BufferMS = 50
OutputLatencyMS = 20
OutputVolume = 100
FastForwardVolume = 100
OutputMuted = false
DumpOnBoot = false


`;

export const hacks = `[Hacks]
DMAMaxSliceTicks = 1000
DMAHaltTicks = 100
GPUFIFOSize = 16
GPUMaxRunAhead = 128


`;

export const bios = `[BIOS]
PatchTTYEnable = false
PatchFastBoot = false
SearchDirectory = bios


`;

export const memoryCards = `[MemoryCards]
Card1Type = PerGameTitle
Card2Type = None
UsePlaylistTitle = true
Directory = memcards


`;

export const controllerPorts = `[ControllerPorts]
MultitapMode = Disabled
PointerXScale = 8,000000
PointerYScale = 8,000000
PointerXInvert = false
PointerYInvert = false
ControllerSettingsMigrated = true


`;

export const hotkeys = `[Hotkeys]
FastForward = Keyboard/Tab
TogglePause = Keyboard/Space
Screenshot = Keyboard/F10
ToggleFullscreen = Keyboard/F11
OpenPauseMenu = Keyboard/Escape
LoadSelectedSaveState = Keyboard/F1
SaveSelectedSaveState = Keyboard/F2
SelectPreviousSaveStateSlot = Keyboard/F3
SelectNextSaveStateSlot = Keyboard/F4


`;

export const hotkeysMerged = `[Hotkeys]
FastForward = Keyboard/Tab
TogglePause = Keyboard/Space
Screenshot = Keyboard/F10
SelectPreviousSaveStateSlot =
SelectNextSaveStateSlot = Keyboard/F4
OpenPauseMenu = Keyboard/F2
ToggleFullscreen = Keyboard/F11
SaveSelectedSaveState = Keyboard/F1
LoadSelectedSaveState = Keyboard/F3


`;

export const hotkeysConfiguredNew = `[Hotkeys]
OpenPauseMenu = Keyboard/F2
ToggleFullscreen = Keyboard/F11
SaveSelectedSaveState = Keyboard/F1
LoadSelectedSaveState = Keyboard/F3`;

export const pad1 = `[Pad1]
Type = AnalogController
Up = SDL-0/DPadUp
Right = Keyboard/Right
Down = Keyboard/Down
Left = Keyboard/Left
Triangle = Keyboard/I
Circle = Keyboard/L
Cross = Keyboard/K
Square = Keyboard/J
Select = Keyboard/Backspace
Start = Keyboard/Return
L1 = Keyboard/Q
R1 = Keyboard/E
L2 = Keyboard/1
R2 = Keyboard/3
L3 = Keyboard/2
R3 = Keyboard/4
LLeft = Keyboard/A
LRight = Keyboard/D
LDown = Keyboard/S
LUp = Keyboard/W
RLeft = Keyboard/F
RRight = Keyboard/H
RDown = Keyboard/G
RUp = Keyboard/T


`;

export const pad1Mapped = `[Pad1]
Type = AnalogController
Up = SDL-1/DPadUp
Right = SDL-1/DPadRight
Down = SDL-1/DPadDown
Left = SDL-1/DPadLeft
Triangle = SDL-1/Y
Circle = SDL-1/B
Cross = SDL-1/A
Square = SDL-1/X
Select = SDL-1/Back
Start = SDL-1/Start
L1 = SDL-1/LeftShoulder
R1 = SDL-1/RightShoulder
L2 = SDL-1/+LeftTrigger
R2 = SDL-1/+RightTrigger
L3 = SDL-1/LeftStick
R3 = SDL-1/RightStick
LLeft = SDL-1/-LeftX
LRight = SDL-1/+LeftX
LDown = SDL-1/+LeftY
LUp = SDL-1/-LeftY
RLeft = SDL-1/-RightX
RRight = SDL-1/+RightX
RDown = SDL-1/+RightY
RUp = SDL-1/-RightY
Analog = SDL-1/Guide
SmallMotor = SDL-1/SmallMotor
LargeMotor = SDL-1/LargeMotor


`;

export const pad2 = `[Pad2]
Type = AnalogController
Up = SDL-1/DPadUp
Right = Keyboard/Right
Down = Keyboard/Down
Left = Keyboard/Left
Triangle = Keyboard/I
Circle = Keyboard/L
Cross = Keyboard/K
Square = Keyboard/J
Select = Keyboard/Backspace
Start = Keyboard/Return
L1 = Keyboard/Q
R1 = Keyboard/E
L2 = Keyboard/1
R2 = Keyboard/3
L3 = Keyboard/2
R3 = Keyboard/4
LLeft = Keyboard/A
LRight = Keyboard/D
LDown = Keyboard/S
LUp = Keyboard/W
RLeft = Keyboard/F
RRight = Keyboard/H
RDown = Keyboard/G
RUp = Keyboard/T


`;

export const pad2Mapped = `[Pad2]
Type = AnalogController
Up = SDL-0/DPadUp
Right = SDL-0/DPadRight
Down = SDL-0/DPadDown
Left = SDL-0/DPadLeft
Triangle = SDL-0/Y
Circle = SDL-0/B
Cross = SDL-0/A
Square = SDL-0/X
Select = SDL-0/Back
Start = SDL-0/Start
L1 = SDL-0/LeftShoulder
R1 = SDL-0/RightShoulder
L2 = SDL-0/+LeftTrigger
R2 = SDL-0/+RightTrigger
L3 = SDL-0/LeftStick
R3 = SDL-0/RightStick
LLeft = SDL-0/-LeftX
LRight = SDL-0/+LeftX
LDown = SDL-0/+LeftY
LUp = SDL-0/-LeftY
RLeft = SDL-0/-RightX
RRight = SDL-0/+RightX
RDown = SDL-0/+RightY
RUp = SDL-0/-RightY
Analog = SDL-0/Guide
SmallMotor = SDL-0/SmallMotor
LargeMotor = SDL-0/LargeMotor


`;

export const pad3 = `[Pad3]
Type = AnalogController
Up = SDL-2/DPadUp
Right = Keyboard/Right
Down = Keyboard/Down
Left = Keyboard/Left
Triangle = Keyboard/I
Circle = Keyboard/L
Cross = Keyboard/K
Square = Keyboard/J
Select = Keyboard/Backspace
Start = Keyboard/Return
L1 = Keyboard/Q
R1 = Keyboard/E
L2 = Keyboard/1
R2 = Keyboard/3
L3 = Keyboard/2
R3 = Keyboard/4
LLeft = Keyboard/A
LRight = Keyboard/D
LDown = Keyboard/S
LUp = Keyboard/W
RLeft = Keyboard/F
RRight = Keyboard/H
RDown = Keyboard/G
RUp = Keyboard/T


`;

export const pad4 = `[Pad4]
Type = AnalogController
Up = SDL-3/DPadUp
Right = Keyboard/Right
Down = Keyboard/Down
Left = Keyboard/Left
Triangle = Keyboard/I
Circle = Keyboard/L
Cross = Keyboard/K
Square = Keyboard/J
Select = Keyboard/Backspace
Start = Keyboard/Return
L1 = Keyboard/Q
R1 = Keyboard/E
L2 = Keyboard/1
R2 = Keyboard/3
L3 = Keyboard/2
R3 = Keyboard/4
LLeft = Keyboard/A
LRight = Keyboard/D
LDown = Keyboard/S
LUp = Keyboard/W
RLeft = Keyboard/F
RRight = Keyboard/H
RDown = Keyboard/G
RUp = Keyboard/T


`;

export const getUnusedPad = (padNumber: number) => `[Pad${padNumber}]
Type = None


`;

export const settings = `${main}
${pad1}
${getUnusedPad(2)}
${getUnusedPad(3)}
${getUnusedPad(4)}
${getUnusedPad(5)}
${getUnusedPad(6)}
${getUnusedPad(7)}
${getUnusedPad(8)}
${hotkeys}
${controllerPorts}`;

export const settingsArray = [
  main,
  pad1,
  getUnusedPad(2),
  getUnusedPad(3),
  getUnusedPad(4),
  getUnusedPad(5),
  getUnusedPad(6),
  getUnusedPad(7),
  getUnusedPad(8),
  hotkeys,
  controllerPorts,
];
