## 开发

```bash

# node版本
>=13.14.0

# npm版本
>= 6.14.4

# 安装依赖

npm install

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80/

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```
考官可以进行考生排考，大屏显示考试名单，可以对不同状态的考生进行开考控制，
接入海康视频插件进行考试监考，支持视频回放，接入智创签批板OCX控件版，
考官进行确认签名，统计考试成绩，打印成绩单，使用图标对考试合格率，进行统计。
