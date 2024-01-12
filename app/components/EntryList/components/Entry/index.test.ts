import { getDisplayedName } from ".";

describe("Entry", () => {
  describe("getDisplayedName", () => {
    const gameNameWithoutAdditionalInfo = "Final Fantasy VII";
    const additionalInfo = "Disc 1";
    const gameNameWithAdditionalInfo = `${gameNameWithoutAdditionalInfo} (${additionalInfo})`;

    type TestProps = {
      gameName: string;
      alwaysGameName: boolean;
      isImage: boolean;
      error: boolean;
      result?: string;
    };

    const tests: TestProps[] = [
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: true,
        isImage: false,
        error: false,
        result: gameNameWithAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: true,
        isImage: true,
        error: false,
        result: gameNameWithAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: false,
        isImage: false,
        error: false,
        result: gameNameWithAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: false,
        isImage: true,
        error: false,
        result: additionalInfo,
      },
      {
        gameName: gameNameWithoutAdditionalInfo,
        alwaysGameName: false,
        isImage: true,
        error: false,
        result: undefined,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: true,
        isImage: false,
        error: true,
        result: gameNameWithAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: true,
        isImage: true,
        error: true,
        result: gameNameWithAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: false,
        isImage: false,
        error: true,
        result: gameNameWithAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: false,
        isImage: true,
        error: true,
        result: gameNameWithAdditionalInfo,
      },
      {
        gameName: gameNameWithoutAdditionalInfo,
        alwaysGameName: false,
        isImage: true,
        error: true,
        result: gameNameWithoutAdditionalInfo,
      },
    ];

    tests.forEach(({ gameName, alwaysGameName, isImage, error, result }) => {
      it(`Should return ${result} if gameName is ${gameName}, alwaysGameName is ${alwaysGameName}, error is ${error} and isImage is ${isImage}`, () => {
        expect(
          getDisplayedName(gameName, alwaysGameName, isImage, error),
        ).toEqual(result);
      });
    });
  });
});
