'use babel';

export default {
  binary: {
    title: 'Binary path',
    description: 'Path for elm-format',
    type: 'string',
    default: 'elm-format',
    order: 7,
  },
  preferLocalBinary: {
    title: 'Prefer local binary',
    description: 'Try to resolve the binary from the current project\'s directories if possible',
    type: 'boolean',
    default: false,
    order: 6,
  },
  elmVersion: {
    title: 'Elm Version',
    description: 'The version of Elm to use when formatting.',
    type: 'string',
    default: '0.19',
    enum: ['0.18', '0.19'],
  },
  formatOnSave: {
    title: 'Format on save',
    description: 'Do we format when you save files?',
    type: 'boolean',
    default: true,
    order: 3,
  },
  showNotifications: {
    title: 'Show notifications on save',
    description: 'Do you want to see the bar when we save?',
    type: 'boolean',
    default: false,
    order: 4,
  },
  showErrorNotifications: {
    title: 'Show error notifications on save',
    description: 'Do you want to see the bar when we save?',
    type: 'boolean',
    default: true,
    order: 5,
  },
  autoJumpToSyntaxError: {
    title: 'Automatically jump to syntax errors',
    description: 'If a syntax error is encountered, automatically focus the cursor on the line with the error.',
    type: 'boolean',
    default: true,
    order: 2,
  },
};
