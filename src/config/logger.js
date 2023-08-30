const winston = require('winston');
const config = require('./config');

const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
      Object.assign(info, { message: info.stack });
    }
    return info;
  });


const logger = winston.createLogger({
  
    level: config.env === 'development'? 'debug': 'info',
    format: winston.format.combine(
        // enumerateErrorFormat(),
        // winston.format((info)=>`${info}`),
        config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message }) => `${level}: ${message}`),
        // winston.format.printf(()=>'dododo')
      ),
      transports: [
        new winston.transports.Console({
          stderrLevels: ['error'],
          
        }),
      ],

    // format: winston.format.json(),
    // transports: [
    //     //
    //     // - write to all logs with level 'info' and below to 'combined.lot'
    //     // - write all logs error (and below) to 'error.log'.
    //     //
    //     new winston.transports.File({filename: 'error.log', level: 'error' }),
    //     new winston.transports.File({ filename: 'combined.log'})
    // ]
});

//
// if we're not in production then log to the 'console' with the format:
// `${info.level}: ${info.message} JSON.stringfy({...rest})`
//
if(process.env.NODE_ENV !== 'production'){
    // logger.add(new winston.transports.Console({
    //     format: winston.format.simple(),
    // }));
}

logger.stream = {
    write: (message)=>{
        logger.info(message.trim());
    },
};

module.exports = logger;