"use strict";
cc._RF.push(module, 'db881TdTLhM0Z/O2XQ/E9mc', 'UINotice');
// Script/example/uiviews/UINotice.ts

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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UINotice = /** @class */ (function (_super) {
    __extends(UINotice, _super);
    function UINotice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UINotice.prototype.init = function () {
    };
    UINotice = __decorate([
        ccclass
    ], UINotice);
    return UINotice;
}(UIView_1.UIView));
exports.default = UINotice;

cc._RF.pop();