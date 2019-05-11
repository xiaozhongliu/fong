import Framework from './framework'

export default class Controller {

    [index: string]: any

    // readonly properties
    _app: Framework
    _package: string
    _service: string
    get app() {
        return this._app
    }
    get package() {
        return this._package
    }
    get service() {
        return this._service
    }

    constructor(app: Framework) {
        this._app = app
        this._service = this.constructor.name.replace('Controller', '')
        this._package = this._service.toLowerCase()
    }
}
