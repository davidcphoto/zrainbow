# Change Log

All notable changes to the "zRainbow" extension will be documented in this file.

## [0.0.1] - 2026-03-18

### Added
- Rainbow coloring for COBOL conditional structures
- Support for IF...ELSE...END-IF statements
- Support for PERFORM...END-PERFORM statements (inline performs with UNTIL/VARYING/TIMES)
- Support for EVALUATE...WHEN...END-EVALUATE statements
- Automatic detection of nested structures with different colors per level
- Toggle command to enable/disable rainbow coloring
- Configuration setting `zrainbow.enabled` to control activation
- Automatic activation when opening COBOL files (.cbl, .cob, .cobol)
- Real-time color updates as you type
- 6-level rainbow color scheme that cycles through nesting levels

### Features
- Bold formatting for all conditional keywords
- Separate coloring for opening, middle (ELSE/WHEN), and closing keywords
- Smart parsing that respects COBOL column layout (ignores comment lines)
- Support for multiple nesting levels with distinct colors

### Technical Details
- Uses VS Code decoration API for efficient rendering
- Parses code in real-time without external dependencies
- Tracks nesting stack to properly match opening/closing keywords