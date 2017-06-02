# elm-format

Runs `elm-format` on save or manually.

## Installation

1. Get `elm-format` at https://github.com/avh4/elm-format
2. Install Atom package via Atom's UI or
   
```
apm install elm-format
```

## Configuration

**⚠️ Note:** If you've got the `elm-format` binary on any other path than the default `/usr/local/bin/elm-format`, you need to configure the `binary` flag in your Atom config for this package. Otherwise, the package won't run.

In your Atom config file:

```cson
# ...

"elm-format":
    binary: "/usr/local/bin/elm-format" # Needs /to/be/absolute
    formatOnSave: true
    showNotifications: false
    showErrorNotifications: true
```
