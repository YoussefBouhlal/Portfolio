# Youssef Bouhlal - Portfolio

A static portfolio built with HTML, SCSS, and GSAP. WordPress scripts compile the assets; WordPress, PHP, and a database are not required to run the site.

Intended public address: https://youssefbouhlal.github.io/Portfolio/

![Portfolio social preview: Youssef Bouhlal, creative developer and digital designer](img/og-image.jpg)

## Development

Use the Node version in `.nvmrc` (24.22.0) and npm 10.2.3 or newer. With nvm installed:

```sh
nvm install
nvm use
npm ci
npm start
```

`npm start` watches and compiles source changes. Open `index.html` in a browser, or serve this directory with a static HTTP server for HTTP-specific checks. For example, if Python 3 is installed:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Visit http://127.0.0.1:8080/. Stop the server with Ctrl+C.

## Production Checks

```sh
npm run lint:js
npm run lint:css
npm run lint:json
npm run build
git diff --check
```

The build replaces files in `build/`; do not hand-edit generated bundles. Keep `package-lock.json` committed and install with `npm ci`.

The baseline is a normal-flow document. JavaScript enhances it with scroll scenes only when reduced motion is not requested. A preference change or initialization failure restores the baseline. Navigation supports the skip link, section/project fragments, focus destinations, and history. Real-browser, assistive-technology, and touch-device testing is still required before release; source and build checks alone do not prove accessibility.

## Google Analytics

Google Analytics 4 is optional and configured through GitHub Actions, not the source HTML:

1. Create a GA4 property and a Web data stream for the published website. Copy its measurement ID (`G-` followed by 10 uppercase letters or digits) from Admin > Data streams > your Web stream.
2. In the GitHub repository, open Settings > Secrets and variables > Actions > Variables > New repository variable. Name it `GA_MEASUREMENT_ID` and paste the measurement ID as its value, without quotes or whitespace. Use a repository variable, not an environment variable or secret.
3. Commit and push the workflow changes to `main`. Once publication is approved, the deployment adds the Google tag only to the staged `_site/index.html` artifact. The existing `PUBLICATION_APPROVED` repository variable must be `true`; this Analytics setup does not bypass that publication gate.
4. After deployment, visit the live website and check Analytics Realtime. Use Reports > User attributes > Demographic details and the Country dimension for geographic reporting. Standard reports can take 24-48 hours to populate.

Changing or removing the variable requires a new deployment: run "Validate and Deploy Portfolio" from Actions on `main`, or push a new commit. An unset or empty value disables injection; a malformed value fails the deployment build. Pull requests, non-main workflow runs, and local builds do not receive the tag. The measurement ID is public in the deployed page even though it is not committed to the repository.

When configured, Analytics loads automatically without a consent banner. Site ownership remains responsible for required privacy disclosures and consent; this configuration does not exempt the site from applicable requirements. Browser blocking and visitor settings can prevent collection, so reports are not a complete count of all visits.

Setup references: [Google tag installation](https://support.google.com/analytics/answer/15756615), [GitHub Actions variables](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-variables), and [Google EU user consent policy](https://www.google.com/about/company/user-consent-policy/).

## Credits and Licensing

Original application code is offered under GPL-2.0-or-later, consistent with `package.json`; see `LICENSE`. This does not relicense dependencies, fonts, photographs, screenshots, logos, or other third-party material. Publication remains blocked until the compatibility/permission review is resolved.

GSAP supplies animation, ScrollTrigger, Observer, and ScrollToPlugin under its own terms. `@wordpress/scripts` supplies build/lint tooling. Google Fonts serves Inter and Plus Jakarta Sans; network requests go to Google's font services. Dependency notices generated with the browser bundle must be retained. See `ASSET-LICENSES.md` for sources, exceptions, and pending approvals.
