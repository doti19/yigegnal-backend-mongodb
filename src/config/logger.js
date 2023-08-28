const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        //
        // - write to all logs with level 'info' and below to 'combined.lot'
        // - write all logs error (and below) to 'error.log'.
        //
        new winston.transports.File({filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log'})
    ]
});

//
// if we're not in production then log to the 'console' with the format:
// `${info.level}: ${info.message} JSON.stringfy({...rest})`
//
if(process.env.NODE_ENV !== 'production'){
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

logger.stream = {
    write: (message)=>{
        logger.info(message.trim());
    },
};

module.exports = logger;