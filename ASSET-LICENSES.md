# Asset and Third-Party Notices

## Publication Status

Permissions and dependency compatibility are not yet fully cleared. Keep `PUBLICATION_APPROVED` unset or `false`. This document records open questions, not a grant of rights to third-party material or a legal determination of compatibility.

## Original Application Code

The author's original application code is offered under GNU GPL version 2 or, at your option, any later version (`GPL-2.0-or-later`), as declared in `package.json`. See `LICENSE`. No warranty is provided. Dependencies and media retain their own terms.

## GSAP

The lockfile currently resolves GSAP 3.15.0, including ScrollTrigger, Observer, and ScrollToPlugin. Its package metadata identifies the Standard "No Charge" GSAP License, not GPL or MIT.

Official terms: https://gsap.com/standard-license/

Those terms contain use restrictions and require preserving proprietary notices. The application's GPL declaration does not override them. Do not describe the combined browser bundle as wholly GPL-licensed. The compatibility and redistribution review remains a release blocker. Obtain appropriate permission or an approved licensing/implementation resolution before publication; do not silently change the author's license. The webpack override preserves upstream legal headers directly in the browser bundle. Retain those headers and any emitted license files in deployment artifacts.

## Fonts

Inter and Plus Jakarta Sans are requested from Google Fonts rather than bundled locally. Review the upstream license and any modifications before self-hosting font files; retain the required font license documents if that changes.

- Inter upstream: https://github.com/rsms/inter
- Plus Jakarta Sans upstream: https://github.com/tokotype/PlusJakartaSans

## Images and Identity

| Material | Source / use | Approval before publication |
| --- | --- | --- |
| `img/about.webp` | Portrait used in About | Confirm subject consent and photographer/publication rights |
| Header monogram, `img/favicon.svg`, `img/favicon.ico` | Favicon derived from the existing header artwork | Confirm ownership or permission; identity artwork is not automatically covered by the code license |
| `img/projects/youbou-code-block-plugin.webp` | Youbou Code Block screenshot | Confirm permission and absence of private or third-party restricted content |
| `img/projects/webpify-plugin.webp` | WebPify screenshot | Confirm permission and absence of private or third-party restricted content |
| `img/projects/youbou-blocks-theme.webp` | Youbou Blocks screenshot | Confirm screenshot and embedded content permissions |
| `img/projects/react-store.webp` | Store demonstration screenshot | Confirm embedded product photography/branding permissions |
| `img/skills-front-end.webp` | Unused source image, excluded from Pages artifact | Review before making the source repository public, or omit with owner approval |
| `img/og-image.jpg` | Generated text-only social card | Does not use the portrait or project photography; review name/title before release |

Until confirmed otherwise, no separate reuse permission for personal photographs, screenshots, or identity artwork is granted by this repository's code license. A screenshot of a project does not establish rights to everything visible inside it.

## Build Dependencies

Build-time packages remain under their respective licenses. Their source and `node_modules` are not part of the deployed site. Keep the lockfile for reproducibility and inspect any newly emitted runtime dependencies/notices when upgrading the toolchain.