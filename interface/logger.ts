// generated. no need to modify. from defination: ../typings/logger.d.ts
export default interface Logger {
    request(message: object): void
    debug(message: string | object): void
    info(message: string | object): void
    warn(message: string | object): void
    error(message: string | object): void
    fatal(message: string | object): void
}
