"use strict";
cc._RF.push(module, '35e3enlxPVNnbcdFPQpVJAV', 'ResExample');
// Script/example/ResExample.ts

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
var ResLoader_1 = require("../res/ResLoader");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NetExample = /** @class */ (function (_super) {
    __extends(NetExample, _super);
    function NetExample() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.attachNode = null;
        _this.dumpLabel = null;
        _this.ress = null;
        _this.remoteRes = null;
        return _this;
    }
    NetExample.prototype.start = function () {
    };
    NetExample.prototype.onLoadRes = function () {
        var _this = this;
        cc.loader.loadRes("prefabDir/HelloWorld", cc.Prefab, function (error, prefab) {
            if (!error) {
                cc.instantiate(prefab).parent = _this.attachNode;
            }
        });
    };
    NetExample.prototype.onUnloadRes = function () {
        this.attachNode.destroyAllChildren();
        cc.loader.releaseRes("prefabDir/HelloWorld");
    };
    NetExample.prototype.onMyLoadRes = function () {
        var _this = this;
        ResLoader_1.default.loadDir("prefabDir", cc.Prefab, function (error, prefabs) {
            if (!error) {
                _this.ress = prefabs;
                for (var i = 0; i < prefabs.length; ++i) {
                    cc.instantiate(prefabs[i]).parent = _this.attachNode;
                }
            }
        });
    };
    NetExample.prototype.onMyUnloadRes = function () {
        this.attachNode.destroyAllChildren();
        if (this.ress) {
            for (var _i = 0, _a = this.ress; _i < _a.length; _i++) {
                var item = _a[_i];
                ResLoader_1.default.release(item);
            }
            this.ress = null;
        }
    };
    NetExample.prototype.onLoadRemote = function () {
        var _this = this;
        ResLoader_1.default.load("http://tools.itharbors.com/christmas/res/tree.png", function (err, res) {
            if (err || !res)
                return;
            _this.remoteRes = res;
            var spriteFrame = new cc.SpriteFrame(res);
            var node = new cc.Node("tmp");
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            node.parent = _this.attachNode;
        });
    };
    NetExample.prototype.onUnloadRemote = function () {
        this.attachNode.destroyAllChildren();
        this.remoteRes.decRef();
    };
    NetExample.prototype.onDump = function () {
        var Loader = cc.loader;
        this.dumpLabel.string = "\u5F53\u524D\u8D44\u6E90\u603B\u6570:" + Object.keys(Loader._cache).length;
    };
    __decorate([
        property(cc.Node)
    ], NetExample.prototype, "attachNode", void 0);
    __decorate([
        property(cc.Label)
    ], NetExample.prototype, "dumpLabel", void 0);
    NetExample = __decorate([
        ccclass
    ], NetExample);
    return NetExample;
}(cc.Component));
exports.default = NetExample;

cc._RF.pop();