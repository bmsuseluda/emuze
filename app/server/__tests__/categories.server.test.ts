import { when } from "vitest-when";
import nodepath from "path";

import { importCategories, paths } from "../categories.server";
import {
  readDirectorynames,
  readFileHome,
  readFilenames,
  writeFileHome,
} from "../readWriteData.server";
import {
  cotton,
  createAbsoluteEntryPath,
  createCategoryPath,
  gateofthunder,
  metroidsamusreturns,
  nintendo3ds,
  pcenginecd,
} from "../__testData__/category";
import { general } from "../__testData__/general";
import { fetchMetaDataFromDB } from "../igdb.server";
import { lime3ds } from "../applicationsDB.server";
import { mednafen } from "../applicationsDB.server/applications/mednafen";
import { entriesPath } from "../categoryDataCache.server";

vi.mock("@bmsuseluda/node-sdl");
vi.mock("../readWriteData.server");
vi.mock("../lastPlayed.server.ts");
vi.mock("../applications.server");
vi.mock("../openDialog.server.ts");
vi.mock("fs");
vi.mock("../igdb.server.ts");
vi.mock("../settings.server.ts", () => ({
  readGeneral: () => general,
}));
vi.mock("../getExpiresOn.server.ts", () => {
  const getFutureDate = () => {
    const now = new Date();
    now.setDate(now.getDate() + 10);
    now.setSeconds(0);
    return now.getTime();
  };
  const futureDate = getFutureDate();
  return {
    getExpiresOn: () => futureDate,
  };
});

describe("categories.server", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("importCategories", () => {
    it("Should import 3ds and pcengine data", async () => {
      // evaluate
      vi.mocked(readDirectorynames).mockReturnValueOnce([
        nodepath.join(general.categoriesPath, nintendo3ds.name),
        "unknown category",
        createCategoryPath(pcenginecd.name),
      ]);
      when(readFilenames, { times: 1 })
        .calledWith({
          path: createCategoryPath(nintendo3ds.name),
          fileExtensions: lime3ds.fileExtensions,
        })
        .thenReturn([
          createAbsoluteEntryPath(nintendo3ds.name, metroidsamusreturns.path),
        ]);
      when(readFilenames, { times: 1 })
        .calledWith({
          path: createCategoryPath(pcenginecd.name),
          fileExtensions: mednafen.fileExtensions,
        })
        .thenReturn([
          createAbsoluteEntryPath(pcenginecd.name, cotton.path),
          createAbsoluteEntryPath(pcenginecd.name, gateofthunder.path),
        ]);
      vi.mocked(readFileHome).mockReturnValueOnce(pcenginecd);
      vi.mocked(readFileHome).mockReturnValueOnce(nintendo3ds);

      when(fetchMetaDataFromDB)
        .calledWith("pcenginecd", pcenginecd.entries)
        .thenResolve(pcenginecd.entries);
      when(fetchMetaDataFromDB)
        .calledWith("nintendo3ds", nintendo3ds.entries)
        .thenResolve(nintendo3ds.entries);

      // execute
      await importCategories();

      // expect
      expect(writeFileHome).toBeCalledTimes(3);
      expect(writeFileHome).toHaveBeenNthCalledWith(
        1,
        nintendo3ds,
        nodepath.join(entriesPath, `${nintendo3ds.id}.json`),
      );
      expect(writeFileHome).toHaveBeenNthCalledWith(
        2,
        pcenginecd,
        nodepath.join(entriesPath, `${pcenginecd.id}.json`),
      );
      expect(writeFileHome).toHaveBeenNthCalledWith(
        3,
        [
          {
            id: nintendo3ds.id,
            name: nintendo3ds.name,
          },
          {
            id: pcenginecd.id,
            name: pcenginecd.name,
          },
        ],
        paths.categories,
      );
    });
  });
});
