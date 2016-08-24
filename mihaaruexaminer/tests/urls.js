var UrlParser = require("../modules/urlparser")

var urlParser = new UrlParser()

var parsedLink = urlParser.parse("http://mihaaru.com/metabolic/hyperbolic/andromeda/")

console.log(parsedLink)