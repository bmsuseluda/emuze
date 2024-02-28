import type { Application } from "~/server/applicationsDB.server/types";

export type PlatformId =
  | "sonyplaystation"
  | "sonyplaystation2"
  | "sonyplaystation3"
  | "sonypsp"
  | "nintendoentertainmentsystem"
  | "supernintendo"
  | "nintendogameboy"
  | "nintendogameboycolor"
  | "nintendogameboyadvance"
  | "nintendods"
  | "nintendo3ds"
  | "nintendo64"
  | "nintendogamecube"
  | "nintendowii"
  | "nintendowiiu"
  | "nintendoswitch"
  | "pcengine"
  | "pcenginecd"
  | "pcenginesupergrafx"
  | "segamastersystem"
  | "segagamegear"
  | "segamegadrive"
  | "sega32x"
  | "segacd"
  | "segasaturn"
  | "segadreamcast"
  | "arcade"
  | "neogeo"
  | "neogeocd"
  | "scumm"
  | "dos";

export interface Category {
  id: PlatformId;
  names: string[];
  igdbPlatformIds: number[];
  applications: Application[];
  defaultApplication: Application;
}
