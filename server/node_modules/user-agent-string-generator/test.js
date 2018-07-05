var howMany = 100;
var userAgentGenerator = require('.');
while(howMany) {
    howMany--;
    console.log(userAgentGenerator());
}
