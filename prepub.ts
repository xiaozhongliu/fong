import fsAsync from 'fs'
import { promises as fs } from 'fs'

async function main() {
    fsAsync.existsSync('./interface') || fsAsync.mkdirSync('./interface')

    const noModifyComment = '// generated. no need to modify.'
    const classes: string[] = []
    const interfaces: string[] = []
    const excludedTypes = [
        'MidwareList',
        'Indexed',
    ]

    // classes
    for (const item of await fs.readdir('./class')) {
        const content = (await fs.readFile(`./class/${item}`)).toString()
        const match = content.match(/class\s([a-zA-Z]+)\s/)
        if (match && !excludedTypes.includes(match[1])) {
            classes.push(match[1])
        }
    }

    // interfaces
    for (const item of await fs.readdir('./typings')) {
        if (!item.endsWith('.d.ts')) continue

        const defination = `./typings/${item}`
        const content = (await fs.readFile(defination)).toString()
        const match = content.match(/interface\s([a-zA-Z]+)\s/)
        if (match && !excludedTypes.includes(match[1])) {
            interfaces.push(match[1])

            const comment = `${noModifyComment} from defination: .${defination}`
            const file = `./interface/${item.replace('.d.ts', '.ts')}`
            fs.writeFile(file, `${comment}\nexport default ${content}`)
            console.log('generated', file)
        }
    }

    // ./interface/index.ts
    await fs.writeFile('./interface/index.ts',
        `${noModifyComment}
${interfaces.map(item => `import ${item} from './${item.toLowerCase()}'`).join('\n')}

export {
${interfaces.map(item => `    ${item},`).join('\n')}
}
`)
    console.log('generated', './interface/index.ts')

    // ./index.ts
    await fs.writeFile('./index.ts',
        `${noModifyComment}
import {
${classes.map(item => `    ${item},`).join('\n')}
} from './class'

import {
${interfaces.map(item => `    ${item},`).join('\n')}
} from './interface'

export {
${classes.map(item => `    ${item},`).join('\n')}
${interfaces.map(item => `    ${item},`).join('\n')}
}

export default Framework
`)
    console.log('generated', './index.ts')
}
main()
