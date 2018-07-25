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

const findElmFormatBinary = (dir) => {
  const elmFormatFile = path.join(dir, 'node_modules', '.bin', 'elm-format');

  try {
    fs.accessSync(elmFormatFile, fs.constants.F_OK);
    return elmFormatFile;
  } catch (e) {
    return false;
  }
};

export const resolveLocalBinary = () => {
  const projectPaths = atom.project.getPaths();
  const results = projectPaths
    .map(findElmFormatBinary)
    .filter(a => a !== false);

  if (results && results[0]) {
    return results[0];
  }

  return false;
};
