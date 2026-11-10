# MathJax 3.2.2

Locally vendored from the official npm `mathjax@3.2.2` package:
https://registry.npmjs.org/mathjax/-/mathjax-3.2.2.tgz

`tex-svg-full.js` includes the TeX parser, SVG output and TeX glyph paths.
The textmacros component is also available locally; no runtime CDN is used.

Copyright MathJax contributors. Apache License 2.0; see LICENSE.

The site converts Swedish accents, chemical indices and authored labels to TeX,
then uses self-contained SVG paths for DOM, SVG graphs and cached canvas images.
