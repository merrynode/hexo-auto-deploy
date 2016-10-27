const http = require('http');
const {createHmac} = require('crypto');

const config = require('./config/config.json');
const hexo = require('./hexo');

//默认参数
let PORT = config.PORT || 3000;
let URL_PATH = config.URL_PATH || '/';
let SECRET = config.SECRET || '';

let server = http.createServer((request, response) => {

    //检测method和url路径
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
            response.statusCode = 400;
            response.end('check signature failed!');
        }

        let dataString = decodeURIComponent(data);

        try {
            hexo.restart((err, result) => {
                if (err) {
                    response.statusCode = 500;
                    response.end(err.message);
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
