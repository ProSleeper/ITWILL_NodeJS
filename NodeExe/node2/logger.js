//로그 처리 모듈
const { transport } = require('winston');
const winston = require('winston')

//일별 로그 처리 모듈
const winstonDaily = require('winston-daily-rotate-file')

const logger = winston.createLogger({
  
  //로그 수준(debug:0->info:1->notice:2->warning:3->error:4->crit:5->alert:6->emerg:7)
  
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new (winston.transports.Console)({
        colorize:true
    }),
    new(winstonDaily)({
      filename: './log/server_%DATE%.log',
      maxsize: '10m',
      datePattern:'YYYY-MM-DD HH-mm-ss'
  })
  ]
});

module.exports = logger;