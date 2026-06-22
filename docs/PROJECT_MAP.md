# Project Map

Source of truth for audience/runtime scope: `project-profile.json`

## Entrypoints

- `public/index.html`: default prototype entrypoint. Screens should render here and adapt with CSS media queries.
- `public/hotel-home.html`: responsive hoteling home entrypoint.
- `public/member-registration.html`: responsive member registration entrypoint for guardian lookup follow-up.
- CSS is loaded as `styles/main.css` for shared layers plus one or more screen-specific files from `styles/pages/`.
- Mobile layout mode is `@media (max-width: 430px)`.
- Web layout mode is any width above `430px`.

## Runtime

- `src/platforms/app.js`: mounts the current prototype screen.
- `src/platforms/hotel-home.js`: mounts the hoteling home screen.
- `src/platforms/member-registration.js`: mounts the member registration screen.
- Runtime files should mount screens and keep product behavior in feature modules.

## Hotel Home Feature

- `src/features/hotel-home/hotel-home-state.js`: shared hoteling calendar, filter, and detail-panel state rules.
- `src/features/hotel-home/hotel-home-renderer.js`: semantic hoteling home renderer for Web and Mobile.
- `styles/pages/hotel-home.css`: hoteling home page-specific layout exceptions.

## School Home Feature

- `src/features/school-home/school-home-state.js`: shared school calendar, reservation, and capacity state rules.
- `src/features/school-home/school-home-renderer.js`: semantic school home renderer for Web and Mobile.
- `styles/pages/school-home.css`: school home page-specific layout exceptions.

## Member Home Feature

- `src/features/member-home/member-home-state.js`: shared state, filtering, and list-state rules.
- `src/features/member-home/member-home-renderer.js`: semantic member home renderer.
- `styles/pages/member-home.css`: member home and member detail page-specific layout exceptions.

## Member Registration Feature

- `src/features/member-registration/member-registration-state.js`: loads member registration context from URL and storage.
- `src/features/member-registration/member-registration-renderer.js`: semantic member registration renderer.
- `styles/pages/member-registration.css`: member registration page-specific layout exceptions.

## Shared

- `styles/main.css`: common stylesheet entrypoint that imports base, component, and layout layers.
- `styles/base/tokens.css`: shared color, spacing, and radius tokens.
- `styles/base/reset.css`: reset rules.
- `styles/base/base.css`: typography and global element defaults.
- `styles/components/`: reusable UI patterns such as buttons, forms, navigation, modal, calendar, and empty states.
- `styles/layout/shell.css`: shared shells, headers, side navigation, and common screen layout.
- `styles/layout/responsive.css`: shared Web/Mobile display switching rules.
- `src/shared/storage/hotel-home-storage.js`: hoteling reservation localStorage access and fixture fallback.
- `src/shared/storage/member-storage.js`: member localStorage access.
- `src/shared/storage/storage-utils.js`: generic storage helpers.
- `src/shared/components/empty-state.js`: reusable empty state.
- `src/shared/utils/dom.js`: DOM creation helper.
- `src/shared/utils/format.js`: display formatting helper.
