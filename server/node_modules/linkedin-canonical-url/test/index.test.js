var test       = require('tape');
var dir        = __dirname.split('/')[__dirname.split('/').length-1];
var file       = dir + __filename.replace(__dirname, '') + " > ";

var transform  = require('../lib/index.js');

test(file+'Transform polish url into wwww', function(t) {
  var url   = 'https://sy.linkedin.com/pub/krzysztof-marzec/a7/576/b50?trk=biz_employee_pub';
  var result   = transform(url);
  var expected = 'https://www.linkedin.com/in/krzysztof-marzec-b50576a7';
  t.equal(result, expected, "Polish url was successfully transformed");
  t.end();
});

test(file+'Transform Abdi url into canonical', function(t) {
  var url   = 'https://uk.linkedin.com/pub/abdi-ahmed/100/384/6b0';
  var result   = transform(url);
  var expected = 'https://www.linkedin.com/in/abdi-ahmed-6b0384100';
  t.equal(result, expected, "Abdi's (UK Public) profile url transformed");
  t.end();
});

test(file+'Transform Anita url into canonical', function(t) {
  var url   = 'https://uk.linkedin.com/in/anitaczapla';
  var result   = transform(url);
  var expected = 'https://www.linkedin.com/in/anitaczapla';
  t.equal(result, expected, "Anita's profile url transformed");
  t.end();
});

test(file+'Transform Anita url into canonical even if passed as upper case', function(t) {
  var url   = 'https://uk.LINKEDIN.com/in/anitaczapla';
  var result   = transform(url);
  var expected = 'https://www.linkedin.com/in/anitaczapla';
  t.equal(result, expected, "Anita's profile url transformed");
  t.end();
});

test(file+'Test for Benji', function(t) {
  var url   = 'https://uk.linkedin.com/pub/benjamin-lees/58/75/162';
  var result   = transform(url);
  var expected = 'https://www.linkedin.com/in/benjamin-lees-16207558';
  t.equal(result, expected, "Benji's profile url transformed");
  t.end();
});

test(file+'Test for Jorge Feldmann (trailing language)', function(t) {
  var url   = 'https://br.linkedin.com/in/jotafeldmann/pt';
  var result   = transform(url);
  var expected = 'https://www.linkedin.com/in/jotafeldmann';
  t.equal(result, expected, "Jorge's profile url transformed");
  t.end();
});

test(file+'Test for Eugene Vegner (parts 4 length is 3)', function(t) {
  var url   = 'https://ua.linkedin.com/pub/eugene-vegner-%EF%A3%BF/34/4b0/885';
  var result   = transform(url);
  var expected = 'https://www.linkedin.com/in/eugene-vegner-%ef%a3%bf-8854b034';
  t.equal(result, expected, "Eugene's profile url transformed");
  t.end();
});

test(file+'Test for Flavia Lyons (part 5 length is 2)', function(t) {
  var url   = 'https://uk.linkedin.com/pub/flavia-lyons/84/772/aa';
  var result   = transform(url);
  var expected = 'https://www.linkedin.com/in/flavia-lyons-0aa77284';
  t.equal(result, expected, "Flavia's profile url transformed");
  t.end();
});

test(file+'Test for Hanz Meyer (part 5 length is 1)', function(t) {
  var url   = 'https://www.linkedin.com/pub/hanz-meyer/29/314/b';
  var result   = transform(url);
  var expected = 'https://www.linkedin.com/in/hanz-meyer-00b31429';
  t.equal(result, expected, "Hanz's profile url transformed");
  t.end();
});

test(file+'Test for Raoul (url finishes with /)', function(t) {
  var url   = 'https://www.linkedin.com/in/repejota/';
  var result   = transform(url);
  var expected = 'https://www.linkedin.com/in/repejota';
  t.equal(result, expected, "Raoul's profile url transformed");
  t.end();
});
