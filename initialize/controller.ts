import fs from 'fs'
import { promisify } from 'util'
import { ServerUnaryCall, sendUnaryData } from 'grpc'
import { Framework, Controller, Context } from '../class'
import util from '../util'

export default async (app: Framework) => {
    const possibleDist = /\.ts$/.test(__filename) ? '' : '/dist'
    const controllerPath = `${app.appInfo.rootPath}${possibleDist}/controller`
    const files = await promisify(fs.readdir)(controllerPath)
    for (const file of files) {

        const module = await import(`${controllerPath}/${file}`)
        const controller: Controller = new module.default(app)

        const impl: Indexed = {}

        for (const member of Object.getOwnPropertyNames(Object.getPrototypeOf(controller))) {
            if (
                member === 'constructor' ||
                typeof controller[member] !== 'function'
            ) continue

            impl[member] = async (call: ServerUnaryCall<object>, callback: sendUnaryData<object>) => {
                try {
                    await app.midware.execute(
                        new Context(
                            controller.app,
                            controller.service,
                            member,
                            call.metadata.getMap(),
                        ),
                        call.request,
                        async (ctx: Context, req: object) => {
                            const data = await controller[member](ctx, req)
                            callback(undefined, data)
                            ctx.response = data
                        },
                    )
                } catch (error) {
                    // TODO: handle errors
                    console.log(error)
                }
            }
        }

        const pack = util.loadPackage(controller.package)
        app.server.addService(pack[controller.service].service, impl)
    }
}
