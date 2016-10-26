/**
 * Created by 73161 on 2016/10/21.
 */

const {spawn, exec} = require('child_process');
const {BLOG_PATH} = require('./config/config.json');


let hexo = spawn('hexo',['server', '-p', '80'], {cwd: BLOG_PATH});

init(hexo);

function init (exec) {
    exec.on('data', (data) => console.log(data));
    exec.on('exit', () => {console.info(`hexo stop`)});
    return exec;
}

function restart (callback) {
    hexo && hexo.kill('SIGINT');
    exec('git pull \n hexo clean \n hexo g', {cwd: BLOG_PATH}, (err, stdout, stderr) => {

        if (err) {
            callback(err);
        }

        console.info('stdout:', stdout);
        console.info('stderr:', stderr);

        hexo = spawn('hexo', ['server', '-p', '80'], {cwd: BLOG_PATH});

        callback(null, init(hexo));
    })
}

exports = {
    init: init,
    restart: restart
};
