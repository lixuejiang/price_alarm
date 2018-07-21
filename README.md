# price_alarm
- 查询powh3d 当前价格，通过钉钉机器人报警

## 使用

### 安装依赖

```
npm install 

```
在这之前可能要设置chromium的下载路径

```
npm config set puppeteer_download_host=https://npm.taobao.org/mirrors
```

### 运行

```
node spider/powh3d.js
```

> 确保node版本大于等于v8.10.0， 支持ES6的语法