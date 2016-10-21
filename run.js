const http = require('http');
const {createHmac} = require('crypto');
const {execFile} = require('child_process');

const {PORT, URL_PATH, SECRET, BLOG_PATH} = require('./config/config.json');

let hexo = '';

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
            hexo && hexo.kill('SIGINT');
            setTimeout(() => {
                hexo = exec('hexo clean \n hexo g \n hexo server', {cwd: BLOG_PATH}, (err, stdout, stderr) => {
                    if (err) {
                        throw Error(err);
                    }
                    console.info(stdout);
                    console.error(stderr);
                    let dataJson = JSON.parse(dataString.replace(/payload=|\'/g, ''));
                    response.end(dataJson);
                }, 1000);
            })
        } catch (err) {
            console.error(err);
            response.statusCode = 400;
            response.end('update blog failed!');
        }
    })
})

server.listen(PORT, () => console.log('listen to', PORT));