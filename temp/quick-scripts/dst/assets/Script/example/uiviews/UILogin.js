
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/uiviews/UILogin.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS91aXZpZXdzL1VJTG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQXlDO0FBQ3pDLGdEQUErQztBQUMvQywwQ0FBb0M7QUFFOUIsSUFBQSxrQkFBbUMsRUFBbEMsb0JBQU8sRUFBRSxzQkFBeUIsQ0FBQztBQUcxQztJQUFxQywyQkFBTTtJQUEzQzs7SUFPQSxDQUFDO0lBTFUseUJBQU8sR0FBZDtRQUNJLFdBQVc7UUFDWCxxQkFBUyxDQUFDLE9BQU8sQ0FBQyxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLHFCQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQU5nQixPQUFPO1FBRDNCLE9BQU87T0FDYSxPQUFPLENBTzNCO0lBQUQsY0FBQztDQVBELEFBT0MsQ0FQb0MsZUFBTSxHQU8xQztrQkFQb0IsT0FBTyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVJVmlldyB9IGZyb20gXCIuLi8uLi91aS9VSVZpZXdcIjtcbmltcG9ydCB7IHVpTWFuYWdlciB9IGZyb20gXCIuLi8uLi91aS9VSU1hbmFnZXJcIjtcbmltcG9ydCB7IFVJSUQgfSBmcm9tIFwiLi4vVUlFeGFtcGxlXCI7XG5cbmNvbnN0IHtjY2NsYXNzLCBwcm9wZXJ0eX0gPSBjYy5fZGVjb3JhdG9yO1xuXG5AY2NjbGFzc1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVUlMb2dpbiBleHRlbmRzIFVJVmlldyB7XG5cbiAgICBwdWJsaWMgb25Mb2dpbigpIHtcbiAgICAgICAgLy8g6L+e57ut5omT5byAMuS4queVjOmdolxuICAgICAgICB1aU1hbmFnZXIucmVwbGFjZShVSUlELlVJSGFsbCk7XG4gICAgICAgIHVpTWFuYWdlci5vcGVuKFVJSUQuVUlOb3RpY2UpO1xuICAgIH1cbn1cbiJdfQ==