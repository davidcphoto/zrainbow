# zRainbow - COBOL Rainbow Brackets

A VS Code extension that colorizes COBOL conditional structures to improve code readability, especially when dealing with nested conditions.

## Features

zRainbow automatically colorizes matching pairs of COBOL conditional structures with rainbow colors:

- **IF...ELSE...END-IF** structures
- **PERFORM...END-PERFORM** structures (inline performs with UNTIL/VARYING/TIMES)
- **EVALUATE...WHEN...END-EVALUATE** structures

Each nesting level gets a different color, making it easy to identify:
- The **opening** keyword (IF, PERFORM, EVALUATE) - bold colored
- The **middle** keywords (ELSE, WHEN) - bold colored with accent
- The **closing** keyword (END-IF, END-PERFORM, END-EVALUATE) - bold colored

### Example

```cobol
       IF WS-CONDITION-A = 'Y'              <- Level 1 (Gold)
           IF WS-CONDITION-B = 'Y'          <- Level 2 (Cyan)
               PERFORM PROCESS-DATA
           ELSE                             <- Level 2 (Cyan)
               PERFORM ERROR-ROUTINE
           END-IF                           <- Level 2 (Cyan)
       ELSE                                 <- Level 1 (Gold)
           PERFORM SKIP-ROUTINE
       END-IF                               <- Level 1 (Gold)
```

## Requirements

- VS Code version 1.112.0 or higher
- COBOL language support (any COBOL extension that sets the language ID to "cobol" or "COBOL")

## Extension Settings

This extension contributes the following settings:

* `zrainbow.enabled`: Enable/disable rainbow coloring for COBOL conditional structures (default: `true`)
* `zrainbow.colors`: Customize the colors for each nesting level. Each level has three color properties:
  * `opening`: Color for opening keywords (IF, PERFORM, EVALUATE)
  * `middle`: Color for middle keywords (ELSE, WHEN)
  * `closing`: Color for closing keywords (END-IF, END-PERFORM, END-EVALUATE)

### Example Color Configuration

To customize colors, add to your settings.json:

```json
"zrainbow.colors": [
  { "opening": "#FFD700", "middle": "#FFA500", "closing": "#FFD700" },
  { "opening": "#00CED1", "middle": "#1E90FF", "closing": "#00CED1" },
  { "opening": "#FF69B4", "middle": "#FF1493", "closing": "#FF69B4" },
  { "opening": "#32CD32", "middle": "#228B22", "closing": "#32CD32" },
  { "opening": "#9370DB", "middle": "#8B008B", "closing": "#9370DB" },
  { "opening": "#FF6347", "middle": "#DC143C", "closing": "#FF6347" }
]
```

## Commands

* `zRainbow: Toggle COBOL Rainbow Brackets` - Quickly enable/disable the rainbow coloring

## How It Works

The extension:
1. Activates automatically when you open a COBOL file (.cbl, .cob, .cobol)
2. Parses the code to identify conditional structures
3. Matches opening and closing keywords, tracking nesting levels
4. Applies rainbow colors based on nesting depth
5. Updates colors in real-time as you type

## Color Scheme

The extension uses 6 rainbow colors that cycle through nesting levels:
1. Gold/Orange
2. Cyan/Blue
3. Pink/Deep Pink
4. Lime/Green
5. Purple/Dark Magenta
6. Tomato/Crimson

## Known Issues

- Only detects inline PERFORM statements (those with UNTIL, VARYING, or TIMES)
- Comment detection assumes standard COBOL format (asterisk in column 7)
- Requires proper COBOL syntax (matching END-IF, END-PERFORM, END-EVALUATE)

## Release Notes

### 0.0.1

Initial release of zRainbow:
- Support for IF...ELSE...END-IF structures
- Support for PERFORM...END-PERFORM structures
- Support for EVALUATE...WHEN...END-EVALUATE structures
- Rainbow coloring for up to 6 nesting levels
- Toggle command to enable/disable coloring
- Customizable colors via settings
- String literal detection (keywords inside strings are ignored)

---

**Enjoy coding COBOL with better visibility!**

## Working with Markdown

You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
