import { fetchMetaData } from "../fetchMetaData";
import { writeFile } from "../../app/server/readWriteData.server";
import { existsSync } from "node:fs";
import type { Game } from "../igdb";
import { fetchMetaDataForSystem } from "../igdb";

vi.mock("../igdb.ts");
vi.mock("../../app/server/readWriteData.server");
vi.mock("node:fs");

describe("fetchMetaData", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // TODO: add test for a name mapping
  // TODO: add test for lightening force

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

    await fetchMetaData("nintendoentertainmentsystem");

    expect(writeFile).toBeCalledWith(
      [
        ["teenagemutantninjaturtles", "ddsada"],
        ["teenagemutantheroturtles", "dsfsdf"],
        ["tmnt", "ddsada"],
      ],
      "/home/dennisludwig/projects/emuze/fetchMetaData/systems/nintendoentertainmentsystem.json",
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

    await fetchMetaData("nintendoentertainmentsystem");

    expect(writeFile).toBeCalledWith(
      [["teenagemutantninjaturtles", "ddsada"]],
      "/home/dennisludwig/projects/emuze/fetchMetaData/systems/nintendoentertainmentsystem.json",
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

    await fetchMetaData("nintendoentertainmentsystem");

    expect(writeFile).toBeCalledWith(
      [
        ["teenagemutantninjaturtles", "ddsada"],
        ["teenagemutantninjaturtles2thearcadegame", "ddsada"],
      ],
      "/home/dennisludwig/projects/emuze/fetchMetaData/systems/nintendoentertainmentsystem.json",
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

    await fetchMetaData("nintendoentertainmentsystem");

    expect(writeFile).toBeCalledWith(
      [["teenagemutantninjaturtles2000", "ddsada"]],
      "/home/dennisludwig/projects/emuze/fetchMetaData/systems/nintendoentertainmentsystem.json",
    );
  });
});
