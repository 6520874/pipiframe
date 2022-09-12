"use strict";
cc._RF.push(module, '969aczWd9lHOpX3wou4IN95', 'UILogin');
// Script/example/uiviews/UILogin.ts

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
var UILogin = /** @class */ (function (_super) {
    __extends(UILogin, _super);
    function UILogin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UILogin.prototype.onLogin = function () {
        // 连续打开2个界面
        UIManager_1.uiManager.replace(UIExample_1.UIID.UIHall);
        UIManager_1.uiManager.open(UIExample_1.UIID.UINotice);
    };
    UILogin = __decorate([
        ccclass
    ], UILogin);
    return UILogin;
}(UIView_1.UIView));
exports.default = UILogin;

cc._RF.pop();