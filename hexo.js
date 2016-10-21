/**
 * Created by 73161 on 2016/10/21.
 */

const {spawn} = require('child_process');
const {BLOG_PATH} = require('./config/config.json');


let hexo = spawn('hexo server -p 80',{cwd: BLOG_PATH});

init(hexo);

function init (exec) {
    exec.on('data', console.info);
    exec.on('exit', function (code) {
        console.log(`exit code：${code}`);
    })
    return exec;
}

function upStart () {
    hexo && hexo.kill('SIGINT');
    hexo = spawn('git pull \n hexo clean \n hexo g \n hexo server -p 80', {cwd: BLOG_PATH});
    return init(hexo);
}

exports = {
    init: init,
    upStart: upStart
};
