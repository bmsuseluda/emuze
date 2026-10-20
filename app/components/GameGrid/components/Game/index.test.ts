import { getDisplayedName } from "./index.js";

describe("Game", () => {
  describe("getDisplayedName", () => {
    const gameNameWithoutAdditionalInfo = "Final Fantasy VII";
    const additionalInfo = "Disc 1";
    const gameNameWithAdditionalInfo = `${gameNameWithoutAdditionalInfo} (${additionalInfo})`;

    type TestProps = {
      gameName: string;
      alwaysGameName: boolean;
      isImage: boolean;
      loaded: boolean;
      result?: string;
    };

    const tests: TestProps[] = [
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: true,
        isImage: false,
        loaded: true,
        result: gameNameWithoutAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: true,
        isImage: true,
        loaded: true,
        result: gameNameWithoutAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: false,
        isImage: false,
        loaded: true,
        result: gameNameWithoutAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: false,
        isImage: true,
        loaded: true,
        result: undefined,
      },
      {
        gameName: gameNameWithoutAdditionalInfo,
        alwaysGameName: false,
        isImage: true,
        loaded: true,
        result: undefined,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: true,
        isImage: false,
        loaded: false,
        result: gameNameWithoutAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: true,
        isImage: true,
        loaded: false,
        result: gameNameWithoutAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: false,
        isImage: false,
        loaded: false,
        result: gameNameWithoutAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: false,
        isImage: true,
        loaded: false,
        result: gameNameWithoutAdditionalInfo,
      },
      {
        gameName: gameNameWithoutAdditionalInfo,
        alwaysGameName: false,
        isImage: true,
        loaded: false,
        result: gameNameWithoutAdditionalInfo,
      },
    ];

    tests.forEach(({ gameName, alwaysGameName, isImage, loaded, result }) => {
      it(`Should return ${result} if gameName is ${gameName}, alwaysGameName is ${alwaysGameName}, loaded is ${loaded} and isImage is ${isImage}`, () => {
        expect(
          getDisplayedName(gameName, alwaysGameName, isImage, loaded),
        ).toEqual(result);
      });
    });
  });
});
