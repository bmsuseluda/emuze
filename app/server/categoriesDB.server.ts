export interface Category {
  id: string;
  names: string[];
  platformIds: number[];
}

export const sonyplaystation: Category = {
  id: "sonyplaystation",
  names: ["Sony Playstation", "playstation", "psx", "ps1", "psone"],
  platformIds: [7],
};

export const sonyplaystation2: Category = {
  id: "sonyplaystation2",
  names: ["Sony Playstation 2", "playstation 2", "ps2"],
  platformIds: [8],
};

export const sonyplaystation3: Category = {
  id: "sonyplaystation3",
  names: ["Sony Playstation 3", "playstation 3", "ps3"],
  platformIds: [9],
};

export const sonypsp: Category = {
  id: "sonypsp",
  names: [
    "Sony Playstation Portable",
    "Playstation Portable",
    "Sony PSP",
    "PSP",
  ],
  platformIds: [38],
};

export const segamastersystem: Category = {
  id: "segamastersystem",
  names: ["Sega Master System", "Master System", "SMS"],
  platformIds: [64],
};

export const segamegadrive: Category = {
  id: "segamegadrive",
  names: ["Sega Mega Drive", "Mega Drive", "Sega Genesis", "Genesis"],
  platformIds: [29],
};

export const segacd: Category = {
  id: "segacd",
  names: ["Sega CD", "Mega CD", "Sega Mega CD"],
  platformIds: [78],
};

export const supernintendo: Category = {
  id: "supernintendo",
  names: [
    "Super Nintendo Entertainment System",
    "Super Nintendo",
    "SNES",
    "Super Famicom",
  ],
  platformIds: [19, 51, 58],
};

export const nintendods: Category = {
  id: "nintendods",
  names: ["Nintendo DS", "DS"],
  platformIds: [20],
};

export const nintendo3ds: Category = {
  id: "nintendo3ds",
  names: ["Nintendo 3DS", "3DS"],
  platformIds: [37, 137],
};

export const nintendogamecube: Category = {
  id: "nintendogamecube",
  names: ["Nintendo Gamecube", "Gamecube"],
  platformIds: [21],
};

export const arcade: Category = {
  id: "arcade",
  names: ["Arcade"],
  platformIds: [52],
};

export const nintendowii: Category = {
  id: "nintendowii",
  names: ["Nintendo Wii", "Wii"],
  platformIds: [5],
};

export const nintendoentertainmentsystem: Category = {
  id: "nintendoentertainmentsystem",
  names: ["Nintendo Entertainment System", "NES", "Famicom"],
  platformIds: [18, 99],
};

export const nintendo64: Category = {
  id: "nintendo64",
  names: ["Nintendo 64", "N64"],
  platformIds: [4],
};

export const nintendogameboy: Category = {
  id: "nintendogameboy",
  names: ["Nintendo Game Boy", "Game Boy", "GB"],
  platformIds: [33, 22, 24],
};

export const nintendogameboycolor: Category = {
  id: "nintendogameboycolor",
  names: ["Nintendo Game Boy Color", "Game Boy Color", "GBC"],
  platformIds: [22],
};

export const nintendogameboyadvance: Category = {
  id: "nintendogameboyadvance",
  names: ["Nintendo Game Boy Advance", "Game Boy Advance", "GBA"],
  platformIds: [24],
};

export const segasaturn: Category = {
  id: "segasaturn",
  names: ["Sega Saturn", "Saturn"],
  platformIds: [32],
};

export const pcengine: Category = {
  id: "pcengine",
  names: ["PC Engine"],
  platformIds: [86, 150],
};

export const pcenginecd: Category = {
  id: "pcenginecd",
  names: ["PC Engine CD"],
  platformIds: [128, 150],
};

export const neogeo: Category = {
  id: "neogeo",
  names: ["Neo Geo AES", "Neo Geo MVS", "Neo Geo"],
  platformIds: [79, 80],
};

export const neogeocd: Category = {
  id: "neogeocd",
  names: ["Neo Geo CD"],
  platformIds: [136],
};
