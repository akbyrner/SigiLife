const crypto = require('crypto');
function sign(val, secret) {
  return 's:' + val + '.' + crypto
    .createHmac('sha256', secret)
    .update(val)
    .digest('base64')
    .replace(/\=+$/, '');
}
console.log(sign('Lg-TZBWjOCBA6_RsqikQ1VOmGplacZ87', '6133ae4665471824739d603404026ce263db3af3805d0530e44d10ea8eabe5d0'));
