import ColorLabelEffect, { CharEffect, CharEffectPlaying } from "./color-label-effect"
import { CharInfo, NativeLabelColors } from "./color-label-parser"

export default class ColorLabelAssemblerFixer {
    private _updateQuads: Function = null
    private _updateColor: Function = null

    private _label: any = null //cc.Label = null

    protected _defaultColorVal: number = 0

    protected _charsInfo: Array<CharInfo> = []

    protected _opacity: number = 255

    protected _effect: ColorLabelEffect = null

    //WebglLetterFontAssembler cachemode=2
    //WebglTTFAssembler cachemode = 0
    constructor(label: any, defaultColor: cc.Color = cc.Color.WHITE) {
        this._label = label
        this._defaultColorVal = defaultColor._val
    }

    public hackAssembler() {
        let label = this._label
        if (!label || label.cacheMode != cc.Label.CacheMode.CHAR) {
            console.log("ColorLabelAssemblerFixer only suport char mode label ")
            return
        }
        let assembler = label._assembler
        this._updateQuads = assembler._updateQuads
        this._updateColor = assembler.updateColor

        label.node.color = cc.Color.WHITE

        let self = this

        assembler.updateColor = function (comp, color) {
            self.updateColor(comp, color)
        }

        if (this.isUsingNativeTTF()) {
            //原生层不会调用到updateQuads这个js层的方法

        } else {
            assembler._updateQuads = function () {
                self.updateQuads()
            }
        }


        assembler.__labelFixed = true
    }


    public setCharsInfo(charsInfo: Array<CharInfo> = []) {
        this._charsInfo = charsInfo
        if (this.isUsingNativeTTF()) {
            this.setCharsColor()
        }
    }

    public getCharsInfo(): Array<CharInfo> {
        return this._charsInfo
    }

    public get assembler() {
        if (this._label) {
            return this._label._assembler
        }
        return null
    }

    public clean() {
        let assembler = this.assembler
        if (assembler && assembler.__labelFixed) {
            assembler._updateQuads = this._updateQuads
            assembler.updateColor = this._updateColor
            assembler.__labelFixed = false
        }


        if (this._effect) {
            this._effect.clean()
            this._effect = null
        }
    }

    public update() {
        if (this._effect) {
            this._effect.update()
        }
    }

    public finishEffect() {
        if (this._effect) {
            this._effect.finish()
        }
    }

    public startEffect(force: boolean = false) {
        if (this._effect) {
            this._effect.start(force)
        }
    }

    public setEffect(effect: CharEffect) {
        this._effect = new ColorLabelEffect(this)
        this._effect.setEffect(effect)
    }


    protected updateColor(comp, color) {
        color = color || comp.node.color._val
        //get opacity from color
        this._opacity = (color >> 24) & 0xff

        //在native层, opacity永远为255， 需要从comp.node.opactiy取真实的opacity
        if (comp && comp.node && comp.node.opacity < this._opacity) {
            this._opacity = comp.node.opacity
        }
        this.setCharsColor()
    }

    public updateQuads() {
        let ret = this._updateQuads.call(this.assembler)

        this.setCharsColor()
        return ret
    }

    public isUsingNativeTTF(): boolean {
        if (cc.sys.isNative && cc.macro.ENABLE_NATIVE_TTF_RENDERER) {
            return true
        }
        return false
    }

    protected setCharsColor() {
        if (this.isUsingNativeTTF()) {
            //cocos 2.4.x之后底层的assembler使用nativeTTF, 取不到顶点数据，只能通过_layout给底层传数据
            this.setNativeCharsColor()
            return
        }
        //reset colors
        let renderData = this.assembler._renderData
        let verts = renderData.vDatas[0]
        let uintVerts = renderData.uintVDatas[0]

        for (let l = 0; l < this._charsInfo.length; l++) {
            let dataOffset = l * this.assembler.floatsPerVert * 4
            let colorOffset = dataOffset + this.assembler.colorOffset

            let color = this._defaultColorVal
            if (this._charsInfo[l].color != null) {
                color = this._charsInfo[l].color._val
            }

            //对每一个color乘以this._a, 后面可以优化 todo!
            //fast setA
            let opacity = this._opacity
            if (this._effect) {
                opacity = this._effect.getOpacityAt(l, opacity)
            }

            color = ((color & 0x00ffffff) | (opacity << 24)) >>> 0

            for (let i = 0; i < 4 && colorOffset < uintVerts.length; i++) {

                uintVerts[colorOffset] = color

                colorOffset += this.assembler.floatsPerVert
            }
        }
    }

    public updateLabelVerts() {
        if (this.isUsingNativeTTF()) {
            //cocos 2.4.x之后底层的assembler使用nativeTTF, 通过_layout给它传数据
            if (this.assembler && this.assembler._layout && this.assembler._updateCfgFlag) {
                this.assembler._updateCfgFlag((1 << 3)) //set update flag to UPDATE_COLORS(1<<3)
                this._label.setVertsDirty()
            }
        } else {
            this._label.setVertsDirty() //会触发后面render()过程中updateQuads()
        }
    }


    protected setNativeCharsColor() {
        if (this.assembler == null) {
            return
        }

        if (this.assembler._layout == null) {
            console.warn("this is not ttf label using char mode")
            return
        }
        let nativeData: NativeLabelColors = {
            index: -1,
            colors: []
        }
        this.assembler._layout.effect = nativeData
        if (this._effect) {
            nativeData.index = this._effect.getPlayingCharIndex()
        }

        for (let l = 0; l < this._charsInfo.length; l++) {
            let color = this._defaultColorVal
            if (this._charsInfo[l].color != null) {
                color = this._charsInfo[l].color._val
            }
            //abgr
            nativeData.colors[l * 4] = (color >> 24) & 0xff
            nativeData.colors[l * 4 + 1] = (color >> 16) & 0xff
            nativeData.colors[l * 4 + 2] = (color >> 8) & 0xff
            nativeData.colors[l * 4 + 3] = (color) & 0xff
        }
    }

}
