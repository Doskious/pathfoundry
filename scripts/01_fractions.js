/* jshint -W104 *//* jshint -W119 *//*
This code is licensed under the GPLv3 license terms.
(https://www.gnu.org/licenses/gpl-3.0.en.html)*/
var fractions, rx;
fractions = {[8585]: 0.0, [8530]: 0.1, [8529]: (1.0 / 9.0), [8539]: 0.125, [8528]: (1.0 / 7.0), [8537]: (1.0 / 6.0), [8533]: 0.2, [188]: 0.25, [8531]: (1.0 / 3.0), [8540]: 0.375, [8534]: 0.4, [189]: 0.5, [8535]: 0.6, [8541]: 0.625, [8532]: (2.0 / 3.0), [190]: 0.75, [8536]: 0.8, [8538]: (5.0 / 6.0), [8542]: 0.875};
rx = /([+-])?([0-9]*)?(\u2158|\u2189|\u215e|\u215d|\u2150|\u2151|\u2152|\u2153|\u2154|\u2155|\u2156|\u2157|\u215c|\u2159|\u215a|\u215b|\xbc|\xbd|\xbe)?/g;

function arrSum(arr) { return arr.reduce((a,b) => a + b, 0); }

function fixup_vulgar_fractions(test) {
    return arrSum(Array.from(gen_mathy_nums(test)));
}

function* gen_mathy_nums(test) {
    var d, f, maybe_mathy, number, sign, lastPos;
    lastPos = test.length;
    while ((maybe_mathy = rx.exec(test)) !== null) {
        sign = maybe_mathy[1];
        d = maybe_mathy[2];
        f = maybe_mathy[3];
        if ((!(sign || d || f))) {
            rx.lastIndex++;
        } else {
            sign = ((sign === "-") ? (- 1) : 1);
            d = (d ? Number.parseInt(d) : 0);
            f = (f ? f.charCodeAt(0) : null);
            number = (sign * (d + (fractions[f] || 0)));
            if (rx.lastIndex >= lastPos) {
                rx.lastIndex++;
            }
            yield number;
        }
    }
}