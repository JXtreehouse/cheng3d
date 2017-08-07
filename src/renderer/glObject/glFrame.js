import { Logger } from '../../core/base.js'
import { glObject } from './glObject.js'

export class glFrame extends glObject {
    constructor() {
        super();
        Object.assign(this, {
            _frame: undefined,
            _depthStencil: undefined,
            _drawBufferMap: new Map(),
            _drawBuffers: [],
        });
    }

    checkTextures(renderer, textureMap, depthStencilTexture) {
        let completed = true;
        textureMap.forEach(function(texture2d, location) {
            let glTexture = renderer.initTexture(texture2d);
            if (glTexture === undefined) {
                completed = false;
            }
            this._drawBufferMap.set(location, glTexture);
        }.bind(this));

        if (depthStencilTexture) {
            let glTexture = renderer.initTexture(depthStencilTexture);
            if (glTexture !== undefined ) {
                this._depthStencil = glTexture;
            }
        }
    
        return completed;
    }

    generateFromRenderTarget(gl, renderer, renderTarget, maxFrameAttachment) {
        let textureMap = renderTarget.getTextureMap();
        let depthStencilTexture = renderTarget.getDepthStencilTexture();
        const maxAttachment = maxFrameAttachment || 8;
        this._drawBuffers = [];
        if (this.checkTextures(renderer, textureMap, depthStencilTexture) === false) {
            return undefined;
        }
        let frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        this._drawBufferMap.forEach(function(glTexure2d, location) {
            if (location >= maxAttachment) {
                Logger.error('current just support ' + maxFrameAttachment + ' attachments, but you set ' + location);
                return undefined;
            }
            let attachment = gl.COLOR_ATTACHMENT0 + location;
            this._drawBuffers.push(attachment);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, glTexure2d.getHandler(), 0);
        }.bind(this));
        if (depthStencilTexture) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, this._depthStencil.getHandler(), 0);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this._frame = frameBuffer;
        this.setLocalVersion(renderTarget.getUpdateVersion());
        return this;
    }

    apply(gl) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._frame);
        gl.drawBuffers(this._drawBuffers);
    }
}
