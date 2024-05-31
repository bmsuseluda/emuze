import { FileDataCache, MultipleFileDataCache } from "../FileDataCache.server";

const readFileMock = vi.fn();
const writeFileMock = vi.fn();
vi.mock("../readWriteData.server", () => ({
  readFileHome: (path: string) => readFileMock(path),
  writeFileHome: (object: unknown, path: string) => writeFileMock(object, path),
}));

describe("FileDataCache", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("FileDataCache", () => {
    it("Should return data from cache", () => {
      const filePath = "/sdfsd/dsfsd.json";
      const result = "this is the result";
      const dataCache = new FileDataCache<string>(filePath);

      readFileMock.mockReturnValue(result);

      dataCache.readFile();
      dataCache.readFile();
      expect(dataCache.readFile()).toBe(result);

      expect(readFileMock).toBeCalledTimes(1);
    });

    it("Should return updated data from cache", () => {
      const filePath = "/sdfsd/dsfsd.json";
      const initialResult = "this is the result";
      const dataCache = new FileDataCache<string>(filePath);

      readFileMock.mockReturnValueOnce(initialResult);
      expect(dataCache.readFile()).toBe(initialResult);

      const newResult = "This is the new result";
      dataCache.writeFile(newResult);

      expect(dataCache.readFile()).toBe(newResult);

      expect(writeFileMock).toBeCalledWith(newResult, filePath);
      expect(readFileMock).toBeCalledTimes(1);
      expect(writeFileMock).toBeCalledTimes(1);
    });
  });

  describe("MultipleFileDataCache", () => {
    it("Should return specific data for filePath and not overwrite data for other filePath", () => {
      const dataCache = new MultipleFileDataCache<string>();
      const files = [
        {
          filePath: "/file1",
          content: "content from file1",
        },
        {
          filePath: "/file2",
          content: "content from file2",
        },
      ];

      readFileMock.mockReturnValueOnce(files[0].content);
      dataCache.readFile(files[0].filePath);
      dataCache.readFile(files[0].filePath);
      expect(dataCache.readFile(files[0].filePath)).toBe(files[0].content);

      readFileMock.mockReturnValueOnce(files[1].content);
      dataCache.readFile(files[1].filePath);
      dataCache.readFile(files[1].filePath);
      expect(dataCache.readFile(files[1].filePath)).toBe(files[1].content);

      expect(readFileMock).toBeCalledTimes(2);
    });

    it("Should return specific updated data for filePath from cache and not overwrite data for other filePath", () => {
      const dataCache = new MultipleFileDataCache<string>();
      const files = [
        {
          filePath: "/file1",
          initialContent: "initialContent from file1",
          updatedContent: "updatedContent from file1",
        },
        {
          filePath: "/file2",
          initialContent: "initialContent from file2",
          updatedContent: "updatedContent from file2",
        },
      ];

      readFileMock.mockReturnValueOnce(files[0].initialContent);
      expect(dataCache.readFile(files[0].filePath)).toBe(
        files[0].initialContent,
      );

      readFileMock.mockReturnValueOnce(files[1].initialContent);
      expect(dataCache.readFile(files[1].filePath)).toBe(
        files[1].initialContent,
      );

      dataCache.writeFile(files[1].updatedContent, files[1].filePath);

      expect(dataCache.readFile(files[0].filePath)).toBe(
        files[0].initialContent,
      );
      expect(dataCache.readFile(files[1].filePath)).toBe(
        files[1].updatedContent,
      );

      expect(writeFileMock).toBeCalledWith(
        files[1].updatedContent,
        files[1].filePath,
      );
      expect(readFileMock).toBeCalledTimes(2);
      expect(writeFileMock).toBeCalledTimes(1);
    });
  });
});
