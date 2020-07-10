// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || 'localhost';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8090;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: ['https://2b0c1feb20cd.ngrok.io'], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2'],
    setResponseHeaders: {'Access-Control-Allow-Origin' : '$http_Origin'}
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
