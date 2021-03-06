import { Shadow } from "./Shadow";
import { Texture2D } from "../graphics/Texture2D";
import { Matrix4 } from "../math/Matrix4";

import * as CGE from '../graphics/RendererParameter';
import { LightType } from "./Light";
import { Frame } from "../graphics/Frame";
import { RTLocation } from "../graphics/GraphicsTypes";

export class SpotShadow extends Shadow {

    protected _depthTex: Texture2D;
    protected _size: number = 512;
    public matrix: Matrix4;
    public near: number;
    public far: number;

    public frame: Frame;

    constructor() {
        super();

        this.matrix = new Matrix4();
    }

    public init(size: number = 256) {
        this._size = size;
        let tex = this._depthTex;
        if (!tex) {
            tex = new Texture2D();
            tex.setDataType(CGE.UNSIGNED_BYTE);
            tex.setFilter(CGE.NEAREST, CGE.NEAREST);
            this._depthTex = tex;
        }
        tex.setSize(size, size);

        let frame = this.frame;
        if (!frame) {
            frame = new Frame();
            frame.setTexture2D(RTLocation.COLOR, tex);
            frame.enableDepthStencil();
            frame.getState().clearColor.set(1, 1, 1, 1);
            this.frame = frame;
        }
        frame.setSize(size, size);
    }

    public get depthTex(): Texture2D {
        return this._depthTex;
    }

    public set size(n: number) {
        this._size = n;
        this._depthTex && this._depthTex.setSize(n, n);
    }

    public get size(): number {
        return this._size;
    }

    public get type() {
        return LightType.Spot;
    }
}
