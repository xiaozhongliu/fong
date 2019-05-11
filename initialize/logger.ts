import log4js from 'log4js'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
dayjs.locale('zh-cn')
import { Framework } from '../class'

export default async ({ config }: Framework) => {

    const layout = { type: 'pattern', pattern: '%m' }
    const commonLevel = config.DEBUG ? 'debug' : 'info'
    const appenders: any = {
        common: getAppender('common'),
        request: getAppender('request'),
    }
    const categories = {
        default: { appenders: ['common'], level: commonLevel },
        request: { appenders: ['request'], level: 'info' },
    }
    // output logs to console in debug mode
    if (config.DEBUG) {
        appenders.console = { type: 'console', layout }
        categories.default.appenders.push('console')
        categories.request.appenders.push('console')
    }

    log4js.configure({
        appenders,
        categories,
        disableClustering: true,
    })
    const commonLogger = log4js.getLogger('common')
    const requestLogger = log4js.getLogger('request')

    function getAppender(type: string) {
        return {
            type: 'dateFile',
            category: type,
            alwaysIncludePattern: true,
            pattern: `.yyyyMMdd.log`,
            filename: config[`${type.toUpperCase()}_LOG_PATH`],
            layout,
        }
    }

    function mergeData(data: object, level?: LogLevel) {
        return JSON.stringify({
            '@env': process.env.NODE_ENV,
            '@region': process.env.REGION,
            '@timestamp': dayjs(),
            level: level,
            ...data,
        })
    }

    return {
        request(data: object) {
            requestLogger.info(mergeData(data))
        },
        debug(data: string | object) {
            const dataObj = typeof data === 'string' ? { message: data } : data
            commonLogger.debug(mergeData(dataObj, LogLevel.DEBUG))
        },
        info(data: string | object) {
            const dataObj = typeof data === 'string' ? { message: data } : data
            commonLogger.info(mergeData(dataObj, LogLevel.INFO))
        },
        warn(data: string | object) {
            const dataObj = typeof data === 'string' ? { message: data } : data
            commonLogger.warn(mergeData(dataObj, LogLevel.WARN))
        },
        error(data: string | object) {
            const dataObj = typeof data === 'string' ? { message: data } : data
            commonLogger.error(mergeData(dataObj, LogLevel.ERROR))
        },
        fatal(data: string | object) {
            const dataObj = typeof data === 'string' ? { message: data } : data
            commonLogger.fatal(mergeData(dataObj, LogLevel.FATAL))
        },
    }
}

enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    FATAL = 'FATAL',
}
