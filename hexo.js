/**
 * Created by 73161 on 2016/10/21.
 */

const {spawn, exec} = require('child_process');
const {FILE_PATH} = require('./config/config.json');

let hexo = spawn(process.platform === "win32" ? "hexo.cmd" : "hexo", ['server', '-p', '80'], {cwd: FILE_PATH});

init(hexo);

function init (exec) {
    exec.stdout.on('data', (data) => console.log('stdout:' + data));
    exec.stderr.on('data', (data) => console.log('stderr:' + data));
    exec.on('exit', () => {console.info(`hexo stop!`)});
    return exec;
}

function restart (callback) {
    hexo && hexo.kill('SIGINT');
    console.info('git pull && hexo clean && hexo g');
    exec('git pull \n hexo clean \n hexo g', {cwd: FILE_PATH}, (err, stdout, stderr) => {

        if (err) {
            callback(err);
        }

        console.info(stdout);
        console.info(stderr);

        hexo = spawn(process.platform === "win32" ? "hexo.cmd" : "hexo", ['server', '-p', '80'], {cwd: FILE_PATH});

        callback(null, init(hexo));
    })
}

module.exports = {
    init: init,
    restart: restart
};
