import * as CGE from './RendererParameter';
import { GraphicsObject } from './GraphicsObject';
import { ShaderConst } from './ShaderConst';
import { Attribute, Buffer } from './Buffer';
import { Bounding, IBounding } from '../bounding/Bounding';
import { AABB } from '../bounding/AABB'
import { Vector3 } from '../math/Vector3';

/**
 * 绘制模式
 */
export enum DrawMode {
    POINTS = CGE.POINTS,
    LINES = CGE.LINES,
    LINE_LOOP = CGE.LINE_LOOP,
    LINE_STRIP = CGE.LINE_STRIP,
    TRIANGLES = CGE.TRIANGLES,
    TRIANGLE_STRIP = CGE.TRIANGLE_STRIP,
    TRIANGLE_FAN = CGE.TRIANGLE_FAN,
}

/**
 * 绘制参数
 */
export interface DrawParameter {
    mode: DrawMode;
    count: number;
    offset: number;
}

export class Geometry extends GraphicsObject {
    protected _drawParameter: DrawParameter = undefined;
    protected _display: boolean = true;
    protected _bounding: IBounding;
    protected _buffers: Buffer[] = []; 
    protected _indexBuffer: Buffer;

    /**
     * position Attribute的引用，用于快速get position结构
     */
    protected _posAttrib: Attribute;
    /**
     * position Buffer的引用，用于快速get position数据
     */
    protected _posBuffer: Buffer;

    constructor() {
        super();
    }

    public addSingleAttribute(name: string, attribute: string | number, num: number, type: number, 
        data: number[] | Float32Array | Uint32Array | Int32Array | Uint16Array | Int16Array | Uint8Array | Int8Array, usage = CGE.STATIC_DRAW) {
        let buffer = new Buffer();
        let attrib = new Attribute(attribute, num, 0, type);
        buffer.addAttribute(attrib);
        buffer.setData(data);
        buffer.setParameter(0, usage, type);
        this._buffers.push(buffer);

        if (attribute === ShaderConst.position) {
            this._posAttrib = attrib;
            this._posBuffer = buffer;
        }
    }

    public addMultiAttribute(attributeParameters, type, stride, data, usage = CGE.STATIC_DRAW) {
        let buffer = new Buffer();
        
        buffer.setData(data);
        this._buffers.push(buffer);
        buffer.setParameter(stride, usage, type);

        attributeParameters.forEach(param => {
            let attrib = new Attribute(param.attribute, param.num, param.offset, param.type);
            buffer.addAttribute(attrib);

            if (param.attribute === ShaderConst.position) {
                this._posAttrib = attrib;
                this._posBuffer = buffer;
            }
        });
    }

    public setIndexData(data, type: number = CGE.UNSIGNED_SHORT, usage: number = CGE.STATIC_DRAW) {
        let buffer = new Buffer();
        buffer.setData(data);
        buffer.setParameter(0, usage, type);
        buffer.setIsIndex(true);
        this._indexBuffer = buffer;
    }

    public getIndexBuffer() {
        return this._indexBuffer;
    }

    public setDrawParameter(count: number, mode: DrawMode = CGE.TRIANGLES, offset: number = 0) {
        this._drawParameter = {
            mode: mode || CGE.TRIANGLES,
            count: count || 0,
            offset: offset || 0,
        };
    }

    public getPosAttrib() {
        return this._posAttrib;
    }

    public getPosBuffer() {
        return this._posBuffer;
    }

    public getBuffers() {
        return this._buffers;
    }

    public getDrawParameter() {
        return this._drawParameter;
    }

    public getBounding() {
        if (this._bounding === undefined) {
            this.buildBounding();
        }
        return this._bounding;
    }

    public removeBounding() {
        this._bounding = null;
    }

    public buildBounding() {
        if (!this._posAttrib || !this._posBuffer) {
            return;
        }

        const buffer = this._posBuffer;
        const posAtt = this._posAttrib;
        const posData = buffer.getData();
        const stride = buffer.getStride() === 0 ? posAtt.num : (buffer.getStride() / posData.BYTES_PER_ELEMENT );
        const offset = posAtt.offset;
        const num = posAtt.num;

        let min: Vector3 = new Vector3();
        let max: Vector3 = new Vector3();
        min.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        max.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE)

        let temp: Vector3 = new Vector3();

        if (this._indexBuffer) {
            const idxData = this._indexBuffer.getData();
            const l = idxData.length;
            let index;
            for (let i = 0; i < l; i++) {
                index = idxData[i] * stride + offset;
                temp.set(posData[index], posData[index + 1], num === 2 ? 0 : posData[index + 2]);
                min.min(temp);
                max.max(temp);
            }
        } else {
            const l = posData.length / stride;
            let index;
            for (let i = 0; i < l; i++) {
                index = i * stride + offset;
                temp.set(posData[index], posData[index+1], num === 2 ? 0 : posData[index+2]);
                min.min(temp);
                max.max(temp);
            }
        }

        let aabb = new AABB()
        aabb.setMinAt(min);
        aabb.setMaxAt(max);

        this._bounding = aabb;
    }

    public destroy() {
        
    }
}
