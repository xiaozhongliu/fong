import { promises as fs } from 'fs'

async function clean(dir: string, depth: number = 0) {
    let printedDir = false

    for (const item of await fs.readdir(dir)) {
        if (/^\.|node_modules/.test(item)) continue
        const fullPath = `${dir}${item}`
        const stat = await fs.stat(fullPath)

        if (stat.isDirectory()) {
            await clean(`${fullPath}/`, depth + 1)
            continue
        }

        if (fullPath === './index.js') continue

        if (item.endsWith('.js')) {
            if (!printedDir) {
                console.log(dir.padStart(depth * 4 + dir.length + 8, '-'))
                printedDir = true
            }

            fs.unlink(fullPath)
            console.log('deleted', item.padStart(depth * 4 + item.length, ' '))
        }
    }
}
clean('./')
