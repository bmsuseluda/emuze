export const defaultSettings = `[ControllerPorts]
PointerXScale = 8
PointerYScale = 8
PointerXInvert = false
PointerYInvert = false
MultitapMode = Port1Only


[Main]
SettingsVersion = 3
EmulationSpeed = 1
FastForwardSpeed = 0
TurboSpeed = 0
SyncToHostRefreshRate = false
IncreaseTimerResolution = true
InhibitScreensaver = true
StartPaused = false
StartFullscreen = false
PauseOnFocusLoss = false
PauseOnControllerDisconnection = false
SaveStateOnExit = true
CreateSaveStateBackups = true
CompressSaveStates = true
ConfirmPowerOff = false
EnableDiscordPresence = false
LoadDevicesFromSaveStates = false
DisableAllEnhancements = false
RewindEnable = false
RewindFrequency = 10
RewindSaveSlots = 10
RunaheadFrameCount = 0
SetupWizardIncomplete = false


[Console]
Region = Auto
Enable8MBRAM = false
EnableCheats = false


[PINE]
Enabled = false
Slot = 28011


[CPU]
ExecutionMode = Recompiler
OverclockEnable = false
OverclockNumerator = 1
OverclockDenominator = 1
RecompilerMemoryExceptions = false
RecompilerBlockLinking = true
RecompilerICache = false
FastmemMode = MMap


[GPU]
Renderer = Automatic
Adapter = 
ResolutionScale = 1
Multisamples = 1
UseDebugDevice = false
DisableShaderCache = false
DisableDualSourceBlend = false
DisableFramebufferFetch = false
DisableTextureBuffers = false
DisableTextureCopyToSelf = false
PerSampleShading = false
UseThread = true
ThreadedPresentation = false
UseSoftwareRendererForReadbacks = false
TrueColor = true
Debanding = false
ScaledDithering = true
TextureFilter = Nearest
LineDetectMode = Disabled
DownsampleMode = Disabled
DownsampleScale = 1
WireframeMode = Disabled
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
PGXPTolerance = -1
PGXPDepthBuffer = false
PGXPDepthClearThreshold = 300


[Display]
DeinterlacingMode = Adaptive
CropMode = Overscan
ActiveStartOffset = 0
ActiveEndOffset = 0
LineStartOffset = 0
LineEndOffset = 0
Force4_3For24Bit = false
AspectRatio = Auto (Game Native)
Alignment = Center
Scaling = BilinearSmooth
OptimalFramePacing = false
PreFrameSleep = false
SkipPresentingDuplicateFrames = false
PreFrameSleepBuffer = 2
VSync = false
DisableMailboxPresentation = true
ExclusiveFullscreenControl = Automatic
ScreenshotMode = ScreenResolution
ScreenshotFormat = PNG
ScreenshotQuality = 85
CustomAspectRatioNumerator = 0
ShowOSDMessages = true
ShowFPS = false
ShowSpeed = false
ShowResolution = false
ShowLatencyStatistics = false
ShowGPUStatistics = false
ShowCPU = false
ShowGPU = false
ShowFrameTimes = false
ShowStatusIndicators = true
ShowInputs = false
ShowEnhancements = false
OSDScale = 100
StretchVertically = false


[CDROM]
ReadaheadSectors = 8
MechaconVersion = VC1A
RegionCheck = false
LoadImageToRAM = false
LoadImagePatches = false
MuteCDAudio = false
ReadSpeedup = 1
SeekSpeedup = 1


[Audio]
Backend = Cubeb
Driver = 
OutputDevice = 
StretchMode = TimeStretch
ExpansionMode = Disabled
BufferMS = 50
OutputLatencyMS = 20
OutputLatencyMinimal = false
StretchSequenceLengthMS = 30
StretchSeekWindowMS = 20
StretchOverlapMS = 10
StretchUseQuickSeek = false
StretchUseAAFilter = false
ExpandBlockSize = 2048
ExpandCircularWrap = 90
ExpandShift = 0
ExpandDepth = 1
ExpandFocus = 0
ExpandCenterImage = 1
ExpandFrontSeparation = 1
ExpandRearSeparation = 1
ExpandLowCutoff = 40
ExpandHighCutoff = 90
OutputVolume = 100
FastForwardVolume = 100
OutputMuted = false


[Hacks]
UseOldMDECRoutines = false
DMAMaxSliceTicks = 1000
DMAHaltTicks = 100
GPUFIFOSize = 16
GPUMaxRunAhead = 128


[PCDrv]
Enabled = false
EnableWrites = false
Root = 


[BIOS]
TTYLogging = false
PatchFastBoot = false
SearchDirectory = bios


[MemoryCards]
Card1Type = PerGameTitle
Card2Type = None
UsePlaylistTitle = true
Directory = memcards


[Cheevos]
Enabled = false
ChallengeMode = false
Notifications = true
LeaderboardNotifications = true
SoundEffects = true
Overlays = true
EncoreMode = false
SpectatorMode = false
UnofficialTestMode = false
UseFirstDiscFromPlaylist = true
UseRAIntegration = false
NotificationsDuration = 5
LeaderboardsDuration = 10


[Logging]
LogLevel = Info
LogFilter = 
LogTimestamps = true
LogToConsole = true
LogToDebug = false
LogToWindow = false
LogToFile = false


[Debug]
ShowVRAM = false
DumpCPUToVRAMCopies = false
DumpVRAMToCPUCopies = false
ShowGPUState = false
ShowCDROMState = false
ShowSPUState = false
ShowTimersState = false
ShowMDECState = false
ShowDMAState = false


[TextureReplacements]
EnableVRAMWriteReplacements = false
PreloadTextures = false
DumpVRAMWrites = false
DumpVRAMWriteForceAlphaChannel = true
DumpVRAMWriteWidthThreshold = 128
DumpVRAMWriteHeightThreshold = 128


[Folders]
Cache = cache
Cheats = cheats
Covers = covers
Dumps = dump
GameSettings = gamesettings
InputProfiles = inputprofiles
SaveStates = savestates
Screenshots = screenshots
Shaders = shaders
Textures = textures
UserResources = resources


[InputSources]
XInput = false
RawInput = false
SDL = true
SDLControllerEnhancedMode = true


[Pad1]
Type = None


[Pad2]
Type = None


[Pad3]
Type = None


[Pad4]
Type = None


[Pad5]
Type = None


[Pad6]
Type = None


[Pad7]
Type = None


[Pad8]
Type = None


[Hotkeys]
FastForward = Keyboard/Tab
TogglePause = Keyboard/Space
Screenshot = Keyboard/F10
SelectNextSaveStateSlot = Keyboard/F4
OpenPauseMenu = Keyboard/F2
ToggleFullscreen = Keyboard/F11
SaveSelectedSaveState = Keyboard/F1
LoadSelectedSaveState = Keyboard/F3


[UI]
MainWindowGeometry = AdnQywADAAAAAABkAAAAZAAAA4MAAAMWAAAAZAAAAIgAAAODAAADFgAAAAAAAAAADXAAAABkAAAAiAAAA4MAAAMW
MainWindowState = AAAA/wAAAAD9AAAAAAAAAyAAAAJcAAAABAAAAAQAAAAIAAAACPwAAAABAAAAAgAAAAEAAAAOAHQAbwBvAGwAQgBhAHIAAAAAAP////8AAAAAAAAAAA==`;
