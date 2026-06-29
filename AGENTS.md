# AGENTS.md

## 1. Project Scope

- Project: LoFi prototype for member tags / labels.
- Target modes: Web and Mobile through responsive CSS.
- Stack: Vanilla HTML, CSS, and JavaScript only.
- Purpose: Keep prototype code simple, consistent, and easy for Codex or downstream analysis tools to read.

## 2. Core Rules

- Keep the prototype static.
- Do not use frameworks, external libraries, build tools, or backend assumptions unless explicitly requested.
- Keep UI at LoFi wireframe level unless visual refinement is explicitly requested.
- Prioritize product flow, state, behavior, and information structure over visual polish.
- Do not create sample data unless explicitly requested.
- Render empty states when data is missing.
- Keep HTML, CSS, and JavaScript responsibilities separated.

## 3. Runtime, Screens, And Rendering

- Use `public/index.html` as the default screen entrypoint.
- Prefer one static HTML structure per screen.
- Distinct screens should keep their main structure in HTML.
- Do not collapse multiple screens into one large JavaScript-rendered runtime.
- Do not generate entire static screens from JavaScript.

### HTML
- HTML owns stable screen structure, semantic layout, forms, sections, fixed actions, and `data-*` hooks.

### Page JS
- Page-level JS should initialize screens, bind events, coordinate modules, and trigger renders.
- Page JS should not generate entire screen markup strings.

### Renderer JS
- Renderers are only for dynamic or repeated regions such as:
  - lists
  - empty states
  - conditional fragments
  - transient UI

### Service / Storage
- Business rules and persistence logic must live outside page files.
- Do not mix storage access into render functions.

- Keep HTML, CSS, and JavaScript responsibilities separated.
- Use CSS media queries for responsive differences.
- Web and Mobile should share product logic, state, constants, and services unless behavior truly differs.

## 4. Feature Implementation

- Organize behavior by feature and separate validation, state, persistence, and rendering responsibilities.
- Preserve product-critical states, flows, and business rules.
- Keep runtime logic thin and avoid large mixed-purpose functions.
- Use clear domain-specific naming.

## 5. Member Tag / Label Language

- Use `memberTag` as the default code term.
- Use `태그` as the default Korean UI term.
- Use `label` only if the product explicitly distinguishes labels from tags.
- Keep terminology consistent across files, variables, functions, and UI copy.

## 6. DOM Hooks

- Use `data-*` attributes to expose product meaning and runtime behavior.
- CSS classes are for reusable visual or structural roles only.
- Do not use CSS classes as primary JavaScript hooks.
- Prefer hooks such as:
  - `data-screen`
  - `data-area`
  - `data-modal`
  - `data-action`
  - `data-field`
  - `data-state`
  - `data-entity-id`
- Use `data-modal` for modal UI roots such as dialogs, alerts, and bottom sheets.
- Avoid screen-specific or structure-dependent selectors.
- Use `data-platform` only when a real runtime mode exists, not just to describe responsive layout.
- If a visual class represents product state, also expose that state through a `data-*` hook.

## 7. Storage

- localStorage is the prototype data source.
- All localStorage access must go through storage modules.
- Do not access localStorage directly from runtime files, renderers, or reusable components.
- Storage keys should be stable and feature-specific.
- Do not duplicate the same data across multiple storage keys unless explicitly needed.

## 8. CSS

- Use layered CSS responsibilities: `base` for global foundations, `components` for reusable UI, `layout` for shared structure/responsive layout, and `pages` for screen-specific exceptions only.
- Extract repeated patterns into shared component or layout styles instead of duplicating page CSS.
- Do not duplicate the same UI pattern in multiple page CSS files. If a page-specific style becomes useful across screens, promote it to the shared `components` or `layout` layer and keep page CSS for screen-specific exceptions.
- Preserve Web and Mobile/App layout differences primarily through layout/page CSS and responsive rules.
- Keep styles minimal and LoFi unless visual refinement is explicitly requested.
- When matching a reference image, prioritize structural fidelity over visual recreation. Reuse existing styles whenever possible and introduce only the minimum CSS required.

## 9. Figma References

- Treat provided Figma frames as the source of truth for structure and platform-specific UX.
- Preserve structural and responsive differences between Web and Mobile/App implementations.
- Do not simplify or normalize Figma structure unless explicitly requested.

## 10. Change Workflow

Before editing:

1. Identify all affected entry points, render paths, shared modules, and platform variants before editing. Do not modify only the first matching implementation.
2. Preserve existing structural hierarchy, section order, and platform-specific layout behavior unless explicitly requested otherwise.
3. Reuse existing structure first, avoid unrelated changes, and keep product-critical states and business rules intact.
4. Before adding new CSS, check whether existing component or layout styles already solve the need.
5. When reusing an existing UI in a new screen, match its structure and classes first; express required differences with the smallest practical modifier class or `data-*` attribute.

## 11. Do Not

- Do not overbuild visual polish, infrastructure, or unrelated product areas.
- Do not add sample datasets by default.
- Do not leave required UI actions, validation, persistence, or edge-case behavior as stubs.
- Do not mix responsive layout code into feature service logic.
- Do not define product behavior through CSS alone.
- Do not create platform-specific HTML or renderers unless product behavior truly requires it.
- Do not use LoFi as a reason to ignore Figma section structure, action placement, or responsive layout intent.
