stylecow plugin font-variant
============================

[![Build Status](https://travis-ci.org/stylecow/stylecow-plugin-font-variant.svg)](https://travis-ci.org/stylecow/stylecow-plugin-font-variant)

Stylecow plugin to support [font-variant properties](https://drafts.csswg.org/css-fonts/#propdef-font-variant) using font-feature-settings fallback.
Inspired by the postcss plugin [postcss-font-variant](https://github.com/postcss/postcss-font-variant)

You write:

```css
p {
	font-variant-ligatures: common-ligatures;
}
```

And stylecow converts to:

```css
p {
	font-feature-settings: "liga";
	font-variant-ligatures: common-ligatures;
}
```

More demos in [the tests folder](https://github.com/stylecow/stylecow-plugin-font-variant/tree/master/tests/cases)
