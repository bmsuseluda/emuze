import { fetchMetaData } from "../fetchMetaData";
import { writeFile } from "../../app/server/readWriteData.server";
import { existsSync } from "node:fs";
import type { Game } from "../igdb";
import { fetchMetaDataForSystem } from "../igdb";

vi.mock("../igdb.ts");
vi.mock("../../app/server/readWriteData.server");
vi.mock("node:fs");

describe("fetchMetaData", () => {
  // TODO: add test for same name between different regions
  // TODO: add test for multiple entries based on alternative names or regional names
  // TODO: add test for a name mapping
  it("Should filter games with covers only", async () => {
    const igdbResult: Game[] = [
      {
        name: "Teenage Mutant Ninja Turtles",
        cover: {
          image_id: "ddsada",
        },
      },
      {
        name: "Teenage Mutant Ninja Turtles 3",
      },
    ];
    vi.mocked(fetchMetaDataForSystem).mockResolvedValue(igdbResult);
    vi.mocked(existsSync).mockReturnValue(false);

    await fetchMetaData("nintendoentertainmentsystem");

    expect(writeFile).toBeCalledWith(
      [["Teenage Mutant Ninja Turtles", "ddsada"]],
      "/home/dennisludwig/projects/emuze/fetchMetaData/systems/nintendoentertainmentsystem.json",
    );
  });
});
