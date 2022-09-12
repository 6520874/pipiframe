"use strict";
cc._RF.push(module, '1ac13Sq8cxLKZtQe1hCgor0', 'UIExample');
// Script/example/UIExample.ts

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
var _a;
var UIManager_1 = require("../ui/UIManager");
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var _b = cc._decorator, ccclass = _b.ccclass, property = _b.property;
var UIID;
(function (UIID) {
    UIID[UIID["UILogin"] = 0] = "UILogin";
    UIID[UIID["UIHall"] = 1] = "UIHall";
    UIID[UIID["UINotice"] = 2] = "UINotice";
    UIID[UIID["UIBag"] = 3] = "UIBag";
})(UIID = exports.UIID || (exports.UIID = {}));
exports.UICF = (_a = {},
    _a[UIID.UILogin] = { prefab: "Prefab/Login" },
    _a[UIID.UIHall] = { prefab: "Prefab/Hall" },
    _a[UIID.UINotice] = { prefab: "Prefab/Notice" },
    _a[UIID.UIBag] = { prefab: "Prefab/Bag", preventTouch: true },
    _a);
var UIExample = /** @class */ (function (_super) {
    __extends(UIExample, _super);
    function UIExample() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIExample.prototype.start = function () {
        UIManager_1.uiManager.initUIConf(exports.UICF);
        UIManager_1.uiManager.open(UIID.UILogin);
    };
    UIExample = __decorate([
        ccclass
    ], UIExample);
    return UIExample;
}(cc.Component));
exports.default = UIExample;

cc._RF.pop();