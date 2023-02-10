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
      result?: string;
    };

    const tests: TestProps[] = [
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: true,
        isImage: false,
        result: gameNameWithAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: true,
        isImage: true,
        result: gameNameWithAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: false,
        isImage: false,
        result: gameNameWithAdditionalInfo,
      },
      {
        gameName: gameNameWithAdditionalInfo,
        alwaysGameName: false,
        isImage: true,
        result: additionalInfo,
      },
      {
        gameName: gameNameWithoutAdditionalInfo,
        alwaysGameName: false,
        isImage: true,
        result: undefined,
      },
    ];

    tests.forEach(({ gameName, alwaysGameName, isImage, result }) => {
      it(`Should return ${result} if gameName is ${gameName}, alwaysGameName is ${alwaysGameName} and isImage is ${isImage}`, () => {
        expect(getDisplayedName(gameName, alwaysGameName, isImage)).toEqual(
          result
        );
      });
    });
  });
});
