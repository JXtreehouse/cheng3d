import { Object3D } from '../object/Object3D';
import { Camera } from '../object/Camera';
import { Frame } from '../graphics/Frame'

import { Mesh } from '../object/Mesh';
import { Base } from '../core/Base';

import { PEType, PEBase } from './postEffect/PEBase'
import { Logger } from '../core/Logger';

export class Renderer extends Base {

    /** CGE的结构支持多个Renderer共存，但是不会允许超过一定的数量 */
    protected static Renderers: Renderer[] = [];

    /** 渲染器计数 */
    private static RendererNum = 0;

    /** 当前渲染器的id */
    public readonly rendererId = Renderer.RendererNum++;

    constructor() {
        super();
        if (Renderer.Renderers.length < 4) {
            Renderer.Renderers.push(this);
        } else {
            Logger.error('Too much renderer instance');
        }
    }
}

export interface IRenderer {

    renderScene(scene: Object3D, camera: Camera, frame?: Frame);
    init(width: number, height: number);
    setSize(width: number, height: number);
    retainMesh(mesh: Mesh);
    releaseMesh(mesh: Mesh);
    getRendererId(): number;
    getWidth(): number;
    getHeight(): number;

    disablePostEffect(type: PEType | PEBase);

    enablePostEffect(type: PEType | PEBase);
    getEnablingPostEffect(): PEType[];

    // exchangeFrame();
    getGBufferFrame(): Frame;

    deltaTime: number;
    defCamera: Camera;

    // currentColorFrame: Frame;
    // currectTargetFrame: Frame;
}