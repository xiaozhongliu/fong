import fs from 'fs'
import { promisify } from 'util'
import { Framework } from '../class'

export default async (app: Framework) => {
    const possibleDist = /\.ts$/.test(__filename) ? '' : '/dist'
    const midwarePath = `${app.appInfo.rootPath}${possibleDist}/midware`
    const files = await promisify(fs.readdir)(midwarePath)
    for (const file of files) {

        const module = await import(`${midwarePath}/${file}`)
        const midware: Function = module.default
        app.midware.use(midware)
    }
}
