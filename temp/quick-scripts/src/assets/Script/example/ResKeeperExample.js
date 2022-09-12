"use strict";
cc._RF.push(module, '44dff6sUhxOK5EHy6webOHq', 'ResKeeperExample');
// Script/example/ResKeeperExample.ts

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
var ResLeakChecker_1 = require("../res/ResLeakChecker");
var ResLoader_1 = require("../res/ResLoader");
var ResUtil_1 = require("../res/ResUtil");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NetExample = /** @class */ (function (_super) {
    __extends(NetExample, _super);
    function NetExample() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resUtilMode = true;
        _this.attachNode = null;
        _this.dumpLabel = null;
        _this.checker = new ResLeakChecker_1.ResLeakChecker();
        return _this;
    }
    NetExample.prototype.start = function () {
        this.checker.startCheck();
    };
    NetExample.prototype.onAdd = function () {
        var _this = this;
        ResLoader_1.default.load("prefabDir/HelloWorld", cc.Prefab, function (error, prefab) {
            if (!error) {
                var myNode = ResUtil_1.ResUtil.instantiate(prefab);
                myNode.parent = _this.attachNode;
                myNode.setPosition((Math.random() * 500) - 250, myNode.position.y);
                console.log(myNode.position);
                prefab.decRef();
            }
        });
    };
    NetExample.prototype.onSub = function () {
        if (this.attachNode.childrenCount > 0) {
            this.attachNode.children[this.attachNode.childrenCount - 1].destroy();
        }
    };
    NetExample.prototype.onAssign = function () {
        var _this = this;
        ResLoader_1.default.load("images/test", cc.SpriteFrame, function (error, sp) {
            _this.checker.traceAsset(sp);
            if (_this.attachNode.childrenCount > 0) {
                var targetNode = _this.attachNode.children[_this.attachNode.childrenCount - 1];
                targetNode.getComponent(cc.Sprite).spriteFrame = ResUtil_1.ResUtil.assignWith(sp, targetNode, true);
            }
            sp.decRef();
        });
    };
    NetExample.prototype.onClean = function () {
        this.attachNode.destroyAllChildren();
    };
    NetExample.prototype.onDump = function () {
        this.checker.dump();
        var Loader = cc.loader;
        this.dumpLabel.string = "\u5F53\u524D\u8D44\u6E90\u603B\u6570:" + Object.keys(Loader._cache).length;
    };
    NetExample.prototype.onLoadClick = function () {
        cc.director.loadScene("example_empty");
    };
    NetExample.prototype.onPreloadClick = function () {
        cc.director.preloadScene("example_empty");
    };
    __decorate([
        property(cc.Boolean)
    ], NetExample.prototype, "resUtilMode", void 0);
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