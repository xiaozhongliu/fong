import Framework from './framework'

export default class Context {

    // readonly properties
    private _app: Framework
    private _controller: string
    private _action: string
    private _metadata: object
    get app() {
        return this._app
    }
    get controller() {
        return this._controller
    }
    get action() {
        return this._action
    }
    get metadata() {
        return this._metadata
    }
    get logger() {
        return this._app.logger
    }

    // assignable properties
    response: object

    constructor(
        app: Framework,
        controller: string,
        action: string,
        metadata: object,
    ) {
        this._app = app
        this._controller = controller
        this._action = action
        this._metadata = metadata
    }
}
