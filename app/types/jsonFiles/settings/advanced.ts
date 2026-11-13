import { SystemId } from "../../../server/categoriesDB.server/systemId.js";

export type Advanced = Partial<Record<SystemId, Record<string, string>>>;
