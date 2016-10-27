const http = require('http');
const {createHmac} = require('crypto');

const {PORT, URL_PATH, SECRET} = require('./config/config.json');
const hexo = require('./hexo');

let server = http.createServer((request, response) => {

    let {method, url} = request;
    if (!(method === 'POST' && url === URL_PATH)) {
        response.end('you get lost?');
    }

    let data = '';

    request.on('data', (chunk) => data += chunk);

    request.on('end', () => {
        //验证secret
        let signature = 'sha1=' + createHmac('sha1', SECRET).update(new Buffer(data)).digest('hex');
        let checkSignature = signature === request.headers['x-hub-signature'];
        if (!checkSignature) {
            throw Error('check signature failed!');
        }

        let dataString = decodeURIComponent(data);

        try {
            hexo.restart((err, result) => {
                if (err) {
                    response.statusCode = 500;
                    response.end(error.message);
                    console.error(err);
                }

                let {commits} = JSON.parse(dataString.replace(/payload=|\'/g, ''));
                console.log(JSON.stringify(commits));
                console.log('blog start!');
                response.end('ok!');
            });
            
        } catch (err) {
            console.error(err);
            response.statusCode = 400;
            response.end('update blog failed!');
        }
    })
})

server.listen(PORT, () => console.log('listen to', PORT));
