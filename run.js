
const http = require('http');
const util = require('util');
let server = http.createServer(function (request, response) {
    console.log(request.method);
    console.log(request.url);
    if (request.method === 'POST' && request.url === '/upblog') {
        let data = '';
        request.on('data', function (chunk) {
            data += chunk;
        })
        request.on('end', function () {
            console.log(util.inspect(data));
            let transcode = decodeURIComponent(util.inspect(data));
            let dataJson = JSON.parse(transcode.replace('‌payload=', ''));

            request
            response.statusCode = 200;
            response.end(util.inspect(data));
        })
    }
})

server.listen(2333, () => console.log('listen to', 2333));