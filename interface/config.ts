export default interface Config extends Indexed {
    // basic
    PORT?: number
    DEBUG?: boolean

    // log
    COMMON_LOG_PATH?: string
    REQUEST_LOG_PATH?: string
}
