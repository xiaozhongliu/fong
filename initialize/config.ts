import { promises as fs } from 'fs'
import { Framework } from '../class'

export default async ({ appInfo }: Framework) => {
    const possibleDist = /\.ts$/.test(__filename) ? '' : '/dist'
    const configPath = `${appInfo.rootPath}${possibleDist}/config`
    const files = await fs.readdir(configPath)
    const env = process.env.NODE_ENV
    let defaultConfig: Function
    let envConfig: Function

    for (const file of files) {
        if (![
            'config.default.ts',
            'config.default.js',
            `config.${env}.ts`,
            `config.${env}.js`,
        ].includes(file)) {
            continue
        }
        const module = await import(`${configPath}/${file}`)
        const config: Function = module.default
        if (file.startsWith('config.default.')) {
            defaultConfig = config
        } else if (file.startsWith(`config.${env}.`)) {
            envConfig = config
        }
    }

    if (!defaultConfig) throw new Error('default config file not found')
    if (!envConfig) throw new Error('env config file not found')

    return deepMerge(defaultConfig(appInfo), envConfig(appInfo))
}

/**
 * helper functions (they should be here other than in ..util namespace)
 */
function deepMerge(target: Indexed, source: Indexed): Config {
    const output = Object.assign({}, target)
    if (!isObject(target) || !isObject(source)) {
        return output
    }
    Object.keys(source).forEach(key => {
        if (target[key] && isObject(source[key])) {
            output[key] = deepMerge(target[key], source[key])
            return
        }
        output[key] = source[key]
    })
    return output
}

function isObject(item: Indexed) {
    return item && typeof item === 'object' && !Array.isArray(item)
}
