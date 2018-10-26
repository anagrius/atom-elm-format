'use babel';

import fs from 'fs';
import path from 'path';
import open from 'opn';

export const installInstructions = {
  buttons: [{
    className: 'btn btn-error',
    onDidClick: () => {
      open('https://github.com/avh4/elm-format#atom-elm-format-installation');
    },
    text: 'Open instructions',
  }],
};

const fileExists = (filePath) => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
};

const findLocalElmFormat = (dir) => {
  const localBinary = path.join(dir, 'node_modules', '.bin', 'elm-format');
  const elmPackageFile018 = path.join(dir, 'elm-package.json');
  const elmPackageFile019 = path.join(dir, 'elm.json');
  let localElmVersion = false;

  if (fileExists(elmPackageFile018)) {
    localElmVersion = '0.18';
  } else if (fileExists(elmPackageFile019)) {
    localElmVersion = '0.19';
  }

  if (fileExists(localBinary) && localElmVersion) {
    return { localBinary, localElmVersion };
  }

  return false;
};

export const resolveLocalBinary = () => {
  const projectPaths = atom.project.getPaths();
  const results = projectPaths
    .map(findLocalElmFormat)
    .filter(a => a !== false);

  if (results && results[0]) {
    return results[0];
  }

  return false;
};
