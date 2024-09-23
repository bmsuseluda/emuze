import { readFileHome, writeFileHome } from "./readWriteData.server";

// TODO: create npm package
export class FileDataCache<Content> {
  constructor(filePath: string, defaultContent?: Content) {
    this.filePath = filePath;
    this.cache = new MultipleFileDataCache<Content>(defaultContent);
  }
  filePath: string;
  cache: MultipleFileDataCache<Content>;

  readFile() {
    return this.cache.readFile(this.filePath);
  }

  writeFile(content: Content) {
    this.cache.writeFile(content, this.filePath);
  }

  invalidateCache() {
    this.cache.invalidateCache();
  }
}

export class MultipleFileDataCache<Content> {
  constructor(defaultContent?: Content) {
    this.defaultContent = defaultContent;
  }
  content: Record<string, Content | null> = {};
  defaultContent?: Content;

  readFile(filePath: string) {
    if (!this.content[filePath]) {
      const result = readFileHome<Content>(filePath);
      if (result) {
        this.content[filePath] = result;
      } else if (this.defaultContent) {
        this.writeFile(this.defaultContent, filePath);
      }
    }
    return this.content[filePath];
  }

  writeFile(content: Content, filePath: string) {
    writeFileHome(content, filePath);
    this.content[filePath] = content;
  }

  invalidateCache() {
    this.content = {};
  }
}
