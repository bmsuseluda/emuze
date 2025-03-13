import { fetchMetaData } from "../fetchMetaData";
import { writeFile } from "../../app/server/readWriteData.server";
import { existsSync } from "node:fs";
import type { Game } from "../igdb";
import { fetchMetaDataForSystem } from "../igdb";
import type { SystemId } from "../../app/server/categoriesDB.server/systemId";
import nodepath from "path";

vi.mock("../igdb.ts");
vi.mock("../../app/server/readWriteData.server");
vi.mock("node:fs");

const getDbPath = (systemId: SystemId) =>
  nodepath.join(__dirname, "..", "systems", `${systemId}.json`);

describe("fetchMetaData", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // TODO: add test for a name mapping

  it("Should add an entry for alternative name and localization", async () => {
    const igdbResult: Game[] = [
      {
        name: "Teenage Mutant Ninja Turtles",
        cover: {
          image_id: "ddsada",
        },
        alternative_names: [{ name: "TMNT" }],
        game_localizations: [
          {
            name: "Teenage Mutant Hero Turtles",
            cover: {
              image_id: "dsfsdf",
            },
          },
        ],
      },
    ];
    vi.mocked(fetchMetaDataForSystem).mockResolvedValue(igdbResult);
    vi.mocked(existsSync).mockReturnValue(false);

    const systemId = "nintendoentertainmentsystem";
    await fetchMetaData(systemId);

    expect(writeFile).toBeCalledWith(
      [
        ["teenagemutantninjaturtles", "ddsada"],
        ["teenagemutantheroturtles", "dsfsdf"],
        ["tmnt", "ddsada"],
      ],
      getDbPath(systemId),
    );
  });

  it("Should prioritize localizations over alternative names", async () => {
    const igdbResult: Game[] = [
      {
        name: "Lightening Force",
        cover: {
          image_id: "lighteningforce",
        },
        alternative_names: [{ name: "Thunder Force IV" }],
        game_localizations: [
          {
            name: "Thunder Force IV",
            cover: {
              image_id: "thunderforceiv",
            },
          },
        ],
      },
    ];
    vi.mocked(fetchMetaDataForSystem).mockResolvedValue(igdbResult);
    vi.mocked(existsSync).mockReturnValue(false);

    const systemId = "segamegadrive";
    await fetchMetaData(systemId);

    expect(writeFile).toBeCalledWith(
      [
        ["lighteningforce", "lighteningforce"],
        ["thunderforce4", "thunderforceiv"],
      ],
      getDbPath(systemId),
    );
  });

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

    const systemId = "nintendoentertainmentsystem";
    await fetchMetaData(systemId);

    expect(writeFile).toBeCalledWith(
      [["teenagemutantninjaturtles", "ddsada"]],
      getDbPath(systemId),
    );
  });

  it("Should filter games with names that are already in the list", async () => {
    const igdbResult: Game[] = [
      {
        name: "Teenage Mutant Ninja Turtles",
        cover: {
          image_id: "ddsada",
        },
      },
      {
        name: "Teenage Mutant Ninja Turtles 2: The Arcade Game",
        cover: {
          image_id: "ddsada",
        },
        alternative_names: [{ name: "Teenage Mutant Ninja Turtles" }],
        game_localizations: [
          {
            name: "Teenage Mutant Ninja Turtles",
            cover: {
              image_id: "dsfsdf",
            },
          },
        ],
      },
    ];
    vi.mocked(fetchMetaDataForSystem).mockResolvedValue(igdbResult);
    vi.mocked(existsSync).mockReturnValue(false);

    const systemId = "nintendoentertainmentsystem";
    await fetchMetaData(systemId);

    expect(writeFile).toBeCalledWith(
      [
        ["teenagemutantninjaturtles", "ddsada"],
        ["teenagemutantninjaturtles2thearcadegame", "ddsada"],
      ],
      getDbPath(systemId),
    );
  });

  it("Should not convert numbers if greater then 99", async () => {
    const igdbResult: Game[] = [
      {
        name: "Teenage Mutant Ninja Turtles 2000",
        cover: {
          image_id: "ddsada",
        },
      },
    ];
    vi.mocked(fetchMetaDataForSystem).mockResolvedValue(igdbResult);
    vi.mocked(existsSync).mockReturnValue(false);

    const systemId = "nintendoentertainmentsystem";
    await fetchMetaData(systemId);

    expect(writeFile).toBeCalledWith(
      [["teenagemutantninjaturtles2000", "ddsada"]],
      getDbPath(systemId),
    );
  });
});
