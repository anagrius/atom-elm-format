'use babel';

import { CompositeDisposable } from 'atom'; // eslint-disable-line
import path from 'path';
import childProcess from 'child_process';
import fs from 'fs';
import config from './settings';
import { installInstructions } from './helpers';

export default {
  config,
  subscriptions: null,
  errorLineNum: null,

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'elm-format:file': () => this.formatCurrentFile(),
      'elm-format:jump-to-syntax-error': () => this.jumpToSyntaxError(),
    }));
    this.subscriptions.add(atom.workspace.observeTextEditors(e => this.handleEvents(e)));
  },

  handleEvents(editor) {
    editor.getBuffer().onWillSave(() => {
      const formatOnSave = atom.config.get('elm-format.formatOnSave');
      if (formatOnSave && this.isElmEditor(editor)) {
        this.format(editor);
      }
    });
  },

  jumpToSyntaxError() {
    if (this.errorLineNum !== null) {
      const editor = atom.workspace.getActiveTextEditor();
      this.gotoLine(editor, this.errorLineNum);
    }
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  error(str, options = {}) {
    if (atom.config.get('elm-format.showErrorNotifications')) {
      atom.notifications.addError(str, options);
    }
  },

  success(str) {
    if (atom.config.get('elm-format.showNotifications')) {
      atom.notifications.addSuccess(str);
    }
  },

  formatCurrentFile() {
    const editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      return;
    }
    if (this.isElmEditor(editor)) {
      this.format(editor);
    } else {
      atom.notifications.addInfo('Not an Elm file', {
        dismissable: false,
        detail: 'I only know how to format .elm-files, sorry!',
      });
    }
  },

  isElmEditor(editor) {
    return editor && editor.getPath && editor.getPath() &&
      path.extname(editor.getPath()) === '.elm';
  },

  gotoLine(editor, lineNum) {
    editor.getSelections()[0].cursor.setScreenPosition({ row: lineNum - 1, column: 0 });
    editor.scrollToCursorPosition();
  },

  format(editor) {
    try {
      // Reset the error tracker.
      this.errorLineNum = null;
      const binary = atom.config.get('elm-format.binary');
      const elmVersion = atom.config.get('elm-format.elmVersion') || '0.19';

      const { status, stdout, stderr } = childProcess.spawnSync(
        binary,
        ['--elm-version', elmVersion, '--stdin'], { input: editor.getText() });

      switch (status) {
        case 0: {
          const cursorPosition = editor.getCursorScreenPosition();
          editor.buffer.setTextViaDiff(stdout.toString());
          editor.setCursorScreenPosition(cursorPosition);
          this.success('File Formatted');
          break;
        }
        case 1: {
          // Remove term colors
          const errorText = stderr.toString()
            .replace(/\[\d{1,2}m/g, '')
            .replace(/[\s\S]*\x1bI ran into something unexpected when parsing your code!/i, ''); // eslint-disable-line no-control-regex

          const matches = errorText.match(/(\d+)│\s/);
          const options = {};

          if (matches && matches.length > 1) {
            this.errorLineNum = parseInt(matches[1], 10);
            const shouldAutoJump = atom.config.get('elm-format.autoJumpToSyntaxError');

            if (shouldAutoJump) {
              this.gotoLine(editor, this.errorLineNum);
            } else {
              options.buttons = [{
                className: 'btn btn-error',
                onDidClick: () => {
                  this.gotoLine(editor, this.errorLineNum);
                },
                text: 'Jump to Syntax Error',
              }];
            }
          }

          this.error(`Elm Format Failed\n\n${errorText}`, options);
          break;
        }
        case null: {
          if (fs.existsSync(binary)) {
            this.error('Can\'t execute the elm-format binary, is it executable?', installInstructions);
          } else {
            this.error('Can\'t find the elm-format binary, check the "elm-format" package settings page', installInstructions);
          }
          break;
        }
        default: {
          this.error(`elm-format exited with code ${status}.`);
        }
      }
    } catch (exception) {
      this.error(`elm-format exception: ${exception}`);
    }
  },
};
