// Source: https://www.regextester.com/93652
const settings = require('../settings');
if (settings.isLiveApplication())
    module.exports.url = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,7}(:[0-9]{1,5})?(\/.*)?$/
else
    module.exports.url = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,7}(:[0-9]{1,5})?(\/.*)?$/

module.exports.email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports.password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/
