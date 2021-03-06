import * as CGE from '../../src/CGE';
import { Manager } from './manager/Manager';

export const manager = new Manager;

export class App extends CGE.EventDispatcher {

    private static _app: App;

    static get instance(): App {
        if (!this._app) {
            this._app = new App;
            this._app.init();
        }
        return this._app;
    }

    private _cgeApp: CGE.Application;

    private _manager: Manager;

    private _scene: CGE.Scene;

    private _timer: CGE.Timer;

    constructor() {
        super();
    }

    private init() {
        let cgeApp = new CGE.Application();

        cgeApp.init(CGE.Platform.width, CGE.Platform.height);
        
        this._timer = cgeApp.getTimer();
        this._scene = cgeApp.getScene();

        this._cgeApp = cgeApp;

        this._manager = manager;
        manager.init();
    }

    get timer(): CGE.Timer {
        return this._timer;
    }

    get cgeApp(): CGE.Application {
        return this._cgeApp;
    }

    get scene(): CGE.Scene {
        return this._scene;
    }

    get manager() {
        return this._manager;
    }
}
