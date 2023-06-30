import { readFileHome, writeFileHome } from "~/server/readWriteData.server";

// TODO: create npm package
export class FileDataCache<Content> {
  constructor(filePath: string) {
    this.filePath = filePath;
    this.cache = new MultipleFileDataCache<Content>();
  }
  filePath: string;
  cache: MultipleFileDataCache<Content>;

  readFile() {
    return this.cache.readFile(this.filePath);
  }

  writeFile(content: Content) {
    this.cache.writeFile(content, this.filePath);
  }
}

export class MultipleFileDataCache<Content> {
  content: Record<string, Content | null> = {};

  readFile(filePath: string) {
    if (!this.content[filePath]) {
      this.content[filePath] = readFileHome<Content>(filePath);
    }
    return this.content[filePath];
  }

  writeFile(content: Content, filePath: string) {
    writeFileHome(content, filePath);
    this.content[filePath] = content;
  }
}
