
const http = require('http');
const util = require('util');
// const getRawBody = require('raw-body');

let server = http.createServer(function (request, response) {
    console.log(request.method);
    console.log(request.url);
    if (request.method === 'POST' && request.url === '/upblog') {
        let data = '';
        request.on('data', function (chunk) {
            data += chunk;
        })
        request.on('end', function () {
            let transcode = '';
            let dataJson = {};
            console.log(util.inspect(data));
            transcode = decodeURIComponent(util.inspect(data));
            try {
                dataJson = JSON.parse(transcode.replace(/payload=|\'/g, ''));
            } catch (err) {
                console.log(err);
            }
            console.log(dataJson);
            response.statusCode = 200;
            response.end(util.inspect(data));
        })
    }
})

server.listen(2333, () => console.log('listen to', 2333));