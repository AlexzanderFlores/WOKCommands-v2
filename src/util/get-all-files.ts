import fs from "fs";
import p from "path";

import { FileData } from "../../typings";

const getAllFiles = (path: string, foldersOnly = false) => {
  const files = fs.readdirSync(path, {
    withFileTypes: true,
  });
  let filesFound: FileData[] = [];

  for (const file of files) {
    const filePath = p.join(path, file.name);

    if (file.isDirectory()) {
      if (foldersOnly) {
        filesFound.push({
          filePath,
          fileContents: file,
        });
      } else {
        filesFound = [...filesFound, ...getAllFiles(filePath)];
      }
      continue;
    }

    const fileContents = require(filePath);
    filesFound.push({
      filePath,
      fileContents: fileContents?.default || fileContents,
    });
  }

  return filesFound;
};

export default getAllFiles;
