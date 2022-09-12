"use strict";
cc._RF.push(module, 'e7548uPzG1IHbJAG5JOhIeu', 'ResKeeper');
// Script/res/ResKeeper.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ResLoader_1 = require("./ResLoader");
/**
 * 资源引用类
 * 1. 提供加载功能，并记录加载过的资源
 * 2. 在node释放时自动清理加载过的资源
 * 3. 支持手动添加记录
 *
 * 2019-12-13 by 宝爷
 */
var ccclass = cc._decorator.ccclass;
var ResKeeper = /** @class */ (function (_super) {
    __extends(ResKeeper, _super);
    function ResKeeper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resCache = new Set();
        return _this;
    }
    ResKeeper.prototype.load = function () {
        var _this = this;
        // 最后一个参数是加载完成回调
        if (arguments.length < 2 || typeof arguments[arguments.length - 1] != "function") {
            console.error("load faile, completed callback not found");
            return;
        }
        // 包装完成回调，添加自动缓存功能
        var finishCallback = arguments[arguments.length - 1];
        arguments[arguments.length - 1] = function (error, resource) {
            if (!error) {
                if (resource instanceof Array) {
                    resource.forEach(function (element) {
                        _this.cacheAsset(element);
                    });
                }
                else {
                    _this.cacheAsset(resource);
                }
            }
            finishCallback();
        };
        // 调用加载接口
        ResLoader_1.default.load.apply(ResLoader_1.default, arguments);
    };
    /**
     * 缓存资源
     * @param asset
     */
    ResKeeper.prototype.cacheAsset = function (asset) {
        if (!this.resCache.has(asset)) {
            asset.addRef();
            this.resCache.add(asset);
        }
    };
    /**
     * 组件销毁时自动释放所有keep的资源
     */
    ResKeeper.prototype.onDestroy = function () {
        this.releaseAssets();
    };
    /**
     * 释放资源，组件销毁时自动调用
     */
    ResKeeper.prototype.releaseAssets = function () {
        this.resCache.forEach(function (element) {
            element.decRef();
        });
        this.resCache.clear();
    };
    ResKeeper = __decorate([
        ccclass
    ], ResKeeper);
    return ResKeeper;
}(cc.Component));
exports.ResKeeper = ResKeeper;

cc._RF.pop();