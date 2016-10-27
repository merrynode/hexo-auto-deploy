# hexo博客自动同步git

这是项目 [hexo-auto-deploy](https://github.com/merrynode/hexo-auto-deploy) ，
欢迎Star。
如有问题可以联系我的邮箱:731615400@qq.com
******
## 说明

> 这个程序将会在你`push`你的博客到`github`上时，检测`github`的`webhook`来，然后更新你的博客。
******
## 使用

### 将博客放到git上
>首先你需要将你的博客放到github上,只放需要修改的文件和文件夹，其他都过滤掉。我的目录树如下：
```bash
blog
│   ├── _config.yml     # 配置文件
│   ├── db.json
│   ├── node_modules
│   ├── package.json
│   ├── public
│   ├── scaffolds       # 存放模板的文件夹
│   ├── source          # 存放源文件的文件夹
│   └── themes
```
>编辑`.gitignore`, 只保留 scaffolds、_config.yml、source,其余文件都过滤
```
  .DS_Store
  Thumbs.db
  db.json
  *.log
  package.json
  node_modules/
  public/
  .deploy*/
  themes
  .idea
```

### 部署项目

>克隆项目
```bash
git clone https://github.com/merrynode/hexo-auto-deploy
```

>编辑配置文件，在项目目录的config/config.json
```json
{
  "PORT": 2333,               //接受webhook的端口
  "URL_PATH": "/update",      //路径
  "SECRET": "secret",         //密钥
  "FILE_PATH": "/home/blog/"  //博客路径
}
```

>启动项目
```bash
node run.js
```
>使用[pm2](http://pm2.keymetrics.io/docs/usage/quick-start/)
```bash
pm2 --merge-logs start run.js
```

### 配置`github`的`webhook`

>步骤:
1. 登录你的`github`,点击右上角settings
2. 然后点击左边的webhooks，之后点击Add webhook
3. 在payloadURL填入你的服务器地址+PORT+URL_PATH 【例:http://127.0.0.1:2333/update】
4. 在Secret填入你的私钥
5. 点击`add webhook`完成添加

******
## 测试
>在你的博客目录下新建个或修改文件,然后提交到github:
```bash
git add --all
git commit -m "test"
git push origin master
```
>如果成功将会看到如下输出日志:
```
0|run      | hexo stop!
0|run      | stdout: Updating 80ffd12..c35f182
0|run      | Fast-forward
0|run      |  ...24\250superagent\344\270\213\350\275\275\346\226\207\344\273\266.md" | 2 +-
0|run      |  1 file changed, 1 insertion(+), 1 deletion(-)
0|run      | INFO  Generated: 2016/09/29/【Node-js】使用superagent下载文件/index.html
0|run      | INFO  Generated: 2016/09/21/【electron】如何在渲染进程跳转时保存socket连接/index.html
0|run      | INFO  Generated: js/src/schemes/pisces.js
0|run      | INFO  79 files generated in 2.25 s
0|run      | 
0|run      | stderr: From github.com:merrynode/blog-hexo
0|run      |    80ffd12..c35f182  master     -> origin/master
0|run      | 
0|run      | blog start!
```

