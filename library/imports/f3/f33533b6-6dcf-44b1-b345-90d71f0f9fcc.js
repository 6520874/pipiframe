"use strict";
cc._RF.push(module, 'f3353O2bc9EsbNFkNcfD5/M', 'UIHall');
// Script/example/uiviews/UIHall.ts

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
var UIExample_1 = require("../UIExample");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UIHall = /** @class */ (function (_super) {
    __extends(UIHall, _super);
    function UIHall() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.weapon = null;
        return _this;
    }
    UIHall.prototype.onBag = function () {
        UIManager_1.uiManager.open(UIExample_1.UIID.UIBag);
    };
    UIHall.prototype.onNotice = function () {
        UIManager_1.uiManager.open(UIExample_1.UIID.UINotice);
    };
    UIHall.prototype.onTop = function (preID, item) {
        this.weapon.spriteFrame = item;
    };
    __decorate([
        property({ type: cc.Sprite })
    ], UIHall.prototype, "weapon", void 0);
    UIHall = __decorate([
        ccclass
    ], UIHall);
    return UIHall;
}(UIView_1.UIView));
exports.default = UIHall;

cc._RF.pop();