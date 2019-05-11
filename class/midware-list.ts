import Context from './context'

export default class MidwareList {

    private list: Function[] = []

    use(midware: Function) {
        this.list.push(midware)
    }

    async execute(ctx: Context, req: object, final: Function) {
        let index = 0

        const next = async () => {
            const midware = this.list[index++]
            if (midware) {
                return midware(ctx, req, next)
            }
            return final(ctx, req)
        }

        return next()
    }
}
