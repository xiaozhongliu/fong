// generated. no need to modify. <<<<<< start <<<<<<
import { AppInfo, Config, Logger } from '../interface'
// generated. no need to modify. >>>>>>> end >>>>>>>
import path from 'path'
import grpc, { Server } from 'grpc'
import MidwareList from './midware-list'
import {
    initConfig,
    initLogger,
    initMidwares,
    initControllers,
} from '../initialize'

export default class Framework {

    private _appInfo: AppInfo
    private _server: Server
    private _config: Config
    private _logger: Logger
    private _midware: MidwareList

    get appInfo(): AppInfo {
        return this._appInfo
    }
    get server(): Server {
        return this._server
    }
    get config(): Config {
        return this._config
    }
    get logger(): Logger {
        return this._logger
    }
    get midware(): MidwareList {
        return this._midware
    }

    constructor() {
        if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev'
        if (!process.env.REGION) process.env.REGION = 'unknown'
        this._server = new Server()
        this._midware = new MidwareList()
    }

    async start() {
        try {
            // use same root path for js and ts
            const rootPath = path.resolve('./').replace('/dist', '')
            const pack = (await import(`${rootPath}/package.json`)).default

            this._appInfo = {
                name: pack.name,
                version: pack.version,
                rootPath: rootPath,
            }
            this._config = await initConfig(this)
            this._logger = await initLogger(this)
            await initMidwares(this)
            await initControllers(this)

            const port = this._config.PORT || 50051
            const serverAddress = `0.0.0.0:${port}`
            const credential = grpc.ServerCredentials.createInsecure()
            this._server.bind(serverAddress, credential)
            this._server.start()
        } catch (error) {
            // TODO: handle errors
            throw error
        }

        this.logger.info(`env is: ${process.env.NODE_ENV}`)
    }
}
