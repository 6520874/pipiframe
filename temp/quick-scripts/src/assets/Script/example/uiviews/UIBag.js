"use strict";
cc._RF.push(module, 'fca327d1KhLiq6nzIlLgtCj', 'UIBag');
// Script/example/uiviews/UIBag.ts

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
var UIView_1 = require("../../ui/UIView");
var UIManager_1 = require("../../ui/UIManager");
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UIBag = /** @class */ (function (_super) {
    __extends(UIBag, _super);
    function UIBag() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectItem = null;
        _this.selectNode = null;
        return _this;
    }
    UIBag.prototype.init = function () {
    };
    UIBag.prototype.onClick = function (event) {
        if (this.selectNode) {
            this.selectNode.setScale(1);
        }
        var node = event.target;
        this.selectNode = node;
        this.selectNode.setScale(1.5);
        var sprite = node.getComponent(cc.Sprite);
        this.selectItem = sprite.spriteFrame;
    };
    UIBag.prototype.onOkClick = function () {
        UIManager_1.uiManager.close();
    };
    UIBag.prototype.onClose = function () {
        return this.selectItem;
    };
    UIBag = __decorate([
        ccclass
    ], UIBag);
    return UIBag;
}(UIView_1.UIView));
exports.default = UIBag;

cc._RF.pop();