"use strict";

let properties = {
    "font-variant-ligatures": {
        "common-ligatures":           ["'liga'", "'clig'"],
        "no-common-ligatures":        ["'liga'", "'clig off'"],
        "discretionary-ligatures":    ["'dlig'"],
        "no-discretionary-ligatures": ["'dlig' off"],
        "historical-ligatures":       ["'hlig'"],
        "no-historical-ligatures":    ["'hlig' off"],
        "contextual":                 ["'calt'"],
        "no-contextual":              ["'calt' off"]
    },

    "font-variant-position": {
        "sub":                        ["'subs'"],
        "super":                      ["'sups'"],
        "normal":                     ["'subs' off", "'sups' off"]
    },

    "font-variant-caps": {
        "small-caps":                 ["'c2sc'"],
        "all-small-caps":             ["'smcp'", "'c2sc'"],
        "petite-caps":                ["'pcap'"],
        "all-petite-caps":            ["'pcap'", "'c2pc'"],
        "unicase":                    ["'unic'"],
        "titling-caps":               ["'titl'"]
    },

    "font-variant-numeric": {
        "lining-nums":                ["'lnum'"],
        "oldstyle-nums":              ["'onum'"],
        "proportional-nums":          ["'pnum'"],
        "tabular-nums":               ["'tnum'"],
        "diagonal-fractions":         ["'frac'"],
        "stacked-fractions":          ["'afrc'"],
        "ordinal":                    ["'ordn'"],
        "slashed-zero":               ["'zero'"]
    },

    "font-kerning": {
        "normal":                     ["'kern'"],
        "none":                       ["'kern' off"]
    }
};

let fontVariant = {};

for (let props in properties) {
    for (let prop in properties[props]) {
        fontVariant[prop] = properties[props][prop];
    }
}

module.exports = function (tasks, stylecow) {

    tasks.addTask({
        filter: {
            type: 'Declaration',
            name: Object.keys(properties)
        },
        fn: function (declaration) {
            declaration
                .getAll('Keyword')
                .forEach(keyword => addFontFeatureSettings(declaration, properties[declaration.name][keyword.name]));
        }
    });

    tasks.addTask({
        filter: {
            type: 'Declaration',
            name: 'font-variant'
        },
        fn: function (declaration) {
            declaration
                .getAll('Keyword')
                .forEach(function (keyword) {
                    if (keyword.name === 'normal' || keyword.name === 'inherit') {
                        return getFontFeatureSetting(declaration).empty().pushCode(keyword.name, 'Value');
                    }

                    addFontFeatureSettings(declaration, fontVariant[keyword.name]);
                });
        }
    });

    function getFontFeatureSetting (declaration) {
        let fontFeatureSetting = declaration.getSibling({type: 'Declaration', name: 'font-feature-settings'});

        if (!fontFeatureSetting) {
            fontFeatureSetting = (new stylecow.Declaration()).setName('font-feature-settings');
            declaration.before(fontFeatureSetting);
        }

        return fontFeatureSetting;
    }

    function addFontFeatureSettings (declaration, values) {
        if (!values) {
            return;
        }

        let fontFeatureSetting = getFontFeatureSetting(declaration);
        values.forEach(value => fontFeatureSetting.pushCode(value, 'Value'));
    }
};
