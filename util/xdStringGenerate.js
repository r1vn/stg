'use strict'; // 2021-07-31 10.58
Object.defineProperty(exports, "__esModule", { value: true });
exports.xdStringGenerate = void 0;
/**
generates a random string according to the specified opts:<br>
`preset` - array of substrings to generate the output from<br>
`length` - the number of preset substrings that will be used to for output<br>
`case` - converts the output string into the specified (lower/upper/mixed) case if set
`separator` - optional separator between substrings<br>
`interval` - interval at which the separator is inserted <br>
@example
xdStringGenerate({
    preset: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'],
    length: 32
}) // 79e9f3cdedea7410e8f742cc94841e3b

xdStringGenerate({
    preset:    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'],
    length:    32,
    case:      'upper',
    separator: '-',
    interval:  4
}) // 8AAB-B445-9AF5-1785-5531-4BA4-CB9B-8614

xdStringGenerate({
    preset: [
        'alpha', 'beta',    'gamma',
        'delta', 'epsilon', 'zeta',
        'eta',   'theta',   'iota',
        'kappa', 'lambda',  'mu',
        'nu',    'xi',      'omicron',
        'pi',    'rho',     'sigma',
        'tau',   'upsilon', 'phi',
        'chi',   'psi',     'omega'
    ],
    length: 8,
    separator: ' ',
    interval: 1
}) // nu sigma iota lambda gamma upsilon delta omega
*/
function xdStringGenerate(opts) {
    let str = '';
    for (let i = 0; i < opts.length; i++) {
        if (opts.interval && opts.separator && i > 0 && i % opts.interval === 0) {
            str += opts.separator;
        }
        str += opts.preset[Math.floor(Math.random() * opts.preset.length)];
    }
    if (opts.case) {
        if (opts.case === 'lower') {
            str = str.toLowerCase();
        }
        else if (opts.case === 'upper') {
            str = str.toUpperCase();
        }
        else {
            let mstr = '';
            for (const char of str) {
                mstr += (Math.random() < 0.5) ? char.toLowerCase() : char.toUpperCase();
            }
            str = mstr;
        }
    }
    return str;
}
exports.xdStringGenerate = xdStringGenerate;
