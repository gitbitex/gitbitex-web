<p align="center"><img width="40%" src="https://getbitex.oss-cn-beijing.aliyuncs.com/projects/image/logo.svg" /></p>

GitBitEx is an open source cryptocurrency exchange.

## Demo
We deployed a demo version on a cloud server (2 Cores CPU 4G RAM). All programs run on this server. include (mysql,kafka,redis,gitbitex-spot,nginx,web...).

https://gitbitex.com:8080/trade/BTC-USDT

## Dependencies
`vue`
`vuex`
`vue-router`
`vue-property-decorator`
`typescript`
`webpack`

## Install
### Server
* git clone https://github.com/gitbitex/gitbitex-spot.git
* Create database and make sure **BINLOG[ROW format]** enabled
* Execute ddl.sql
* Modify conf.json
* Run go build
* Run ./gitbitex-spot
### Web
* git clone https://github.com/gitbitex/gitbitex-web.git
* Run `npm install`
* Run `npm start`
* Run `npm run build` to build production

## Configure BackEnd
* Configure back-end host in `gulpfile.js` use proxy
```
apiProxy = 'https://gitbitex.com:8080/';
```
* Configure websocket host in `src/script/constant.ts`
```
static SOCKET_SERVER = 'wss://gitbitex.com:8080/ws';
```

## Questions?
Please let me know if you have any questions. You can submit an issue or send me an email 
(liyongsheng@me.com)

## Contributing
This project welcomes contributions and suggestions and we are excited to work with the power user community to build the best exchange in the world
