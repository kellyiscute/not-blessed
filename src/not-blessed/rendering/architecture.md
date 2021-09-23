# Architecture

## Render Panel `render-panel.ts`

### Design

    * The root panel expands to the screen's size, the size field is set to the screen's size
    * May contains multiple children. All children should be `RenderPanel`s
    * Contains a `dirty` field to indicate whether rerender is required
    * `dirty` is set to `true` manually by user
    * `dirty` set back to false after each render
    * RenderPanels can have absolute position and size
    * If position is not set, default to (0, 0) of the parent
    * If size is not set, shrinks
    * no overflow allowed, everything that overflows are stripped(forced)
    * size can be set to value "expands", which expands to the size of its parent

### Render Process

    1. `dirty` setter detects change
    2. \_panel field stay the same while render function builds the new screen buffer
    3. diff buffers
    4. move cursor to places require render and rewrite
    5. `dirty` set back to false
    6. \_panel field updated
    7. wait for another detection

## Render Span `render-span.ts`

### Design

    * Represents a span of a line to render
    * `renderString` getter contains the actual data that sends to the terminal(control sequences && content)
    * `width` field indicates the actual content length
    * `type`: `normal` | `styled` | `blankSpace` | `transparent`
    * Can either contain text or child spans
    * implements a combime(`coveredBy`) function that combime with another Render Span

## Styled Span `render-styled-span.ts`

### Design

    * Extends Render Span
    * `styles` field contains all style data
    * `data` field keeps track of the actual content
