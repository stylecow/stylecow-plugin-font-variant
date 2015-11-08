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
    },

    "font-variant": {
        "normal":                      ["normal"],
        "inherit":                     ["inherit"],
        "initial":                     ["initial"]
    }
};

for (let props in properties) {
    for (let prop in properties[props]) {
        if (!properties["font-variant"][prop]) {
            properties["font-variant"][prop] = properties[props][prop];
        }
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
                .forEach(function (keyword) {
                    let values = properties[declaration.name][keyword.name];

                    if (values) {
                        let fontFeatureSetting = declaration.getSibling({type: 'Declaration', name: 'font-feature-settings'});

                        if (!fontFeatureSetting) {
                            declaration.before(fontFeatureSetting = (new stylecow.Declaration()).setName('font-feature-settings'));
                        }

                        values.forEach(function (value) {
                            if (value === 'normal' || value === 'inherit' || value === 'initial') {
                                fontFeatureSetting.empty();
                            }

                            fontFeatureSetting.pushCode(value, 'Value');
                        });
                    }
                });
        }
    });
};
