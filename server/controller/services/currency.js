const settings = require('../../settings');

const currencyRatesUSD = {
    EUR: settings.CURRENCY_RATES_USD.Euro,
    USD: 1,
    GBP: settings.CURRENCY_RATES_USD.GBP
};

function mapCurrencyName(name) {
    switch(name) {
        case "€ EUR":
            return "EUR";
        case "$ USD":
            return "USD";
        case "£ GBP":
            return "GBP";
    }
}
module.exports.convert = function(base, dest, price) {
    const usdPrice = price / currencyRatesUSD[mapCurrencyName(base)];
    return usdPrice * currencyRatesUSD[mapCurrencyName(dest)];
};