
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/UIExample.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS9VSUV4YW1wbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUFvRDtBQUdwRCxvQkFBb0I7QUFDcEIsa0ZBQWtGO0FBQ2xGLHlGQUF5RjtBQUN6RixtQkFBbUI7QUFDbkIsNEZBQTRGO0FBQzVGLG1HQUFtRztBQUNuRyw4QkFBOEI7QUFDOUIsNEZBQTRGO0FBQzVGLG1HQUFtRztBQUU3RixJQUFBLGtCQUFxQyxFQUFuQyxvQkFBTyxFQUFFLHNCQUEwQixDQUFDO0FBRTVDLElBQVksSUFLWDtBQUxELFdBQVksSUFBSTtJQUNaLHFDQUFPLENBQUE7SUFDUCxtQ0FBTSxDQUFBO0lBQ04sdUNBQVEsQ0FBQTtJQUNSLGlDQUFLLENBQUE7QUFDVCxDQUFDLEVBTFcsSUFBSSxHQUFKLFlBQUksS0FBSixZQUFJLFFBS2Y7QUFFVSxRQUFBLElBQUk7SUFDWCxHQUFDLElBQUksQ0FBQyxPQUFPLElBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFO0lBQzFDLEdBQUMsSUFBSSxDQUFDLE1BQU0sSUFBRyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUU7SUFDeEMsR0FBQyxJQUFJLENBQUMsUUFBUSxJQUFHLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRTtJQUM1QyxHQUFDLElBQUksQ0FBQyxLQUFLLElBQUcsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUU7UUFDN0Q7QUFHRDtJQUF1Qyw2QkFBWTtJQUFuRDs7SUFRQSxDQUFDO0lBTkcseUJBQUssR0FBTDtRQUNJLHFCQUFTLENBQUMsVUFBVSxDQUFDLFlBQUksQ0FBQyxDQUFDO1FBQzNCLHFCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBTGdCLFNBQVM7UUFEN0IsT0FBTztPQUNhLFNBQVMsQ0FRN0I7SUFBRCxnQkFBQztDQVJELEFBUUMsQ0FSc0MsRUFBRSxDQUFDLFNBQVMsR0FRbEQ7a0JBUm9CLFNBQVMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVSUNvbmYsIHVpTWFuYWdlciB9IGZyb20gXCIuLi91aS9VSU1hbmFnZXJcIjtcbmltcG9ydCB7IHJlc0xvYWRlciB9IGZyb20gXCIuLi9yZXMvUmVzTG9hZGVyXCI7XG5cbi8vIExlYXJuIFR5cGVTY3JpcHQ6XG4vLyAgLSBbQ2hpbmVzZV0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC96aC9zY3JpcHRpbmcvdHlwZXNjcmlwdC5odG1sXG4vLyAgLSBbRW5nbGlzaF0gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnL2RvY3MvY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3R5cGVzY3JpcHQuaHRtbFxuLy8gTGVhcm4gQXR0cmlidXRlOlxuLy8gIC0gW0NoaW5lc2VdIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvemgvc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcbi8vICAtIFtFbmdsaXNoXSBodHRwOi8vd3d3LmNvY29zMmQteC5vcmcvZG9jcy9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XG4vLyAgLSBbQ2hpbmVzZV0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC96aC9zY3JpcHRpbmcvbGlmZS1jeWNsZS1jYWxsYmFja3MuaHRtbFxuLy8gIC0gW0VuZ2xpc2hdIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZy9kb2NzL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9saWZlLWN5Y2xlLWNhbGxiYWNrcy5odG1sXG5cbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XG5cbmV4cG9ydCBlbnVtIFVJSUQge1xuICAgIFVJTG9naW4sXG4gICAgVUlIYWxsLFxuICAgIFVJTm90aWNlLFxuICAgIFVJQmFnLFxufVxuXG5leHBvcnQgbGV0IFVJQ0Y6IHsgW2tleTogbnVtYmVyXTogVUlDb25mIH0gPSB7XG4gICAgW1VJSUQuVUlMb2dpbl06IHsgcHJlZmFiOiBcIlByZWZhYi9Mb2dpblwiIH0sXG4gICAgW1VJSUQuVUlIYWxsXTogeyBwcmVmYWI6IFwiUHJlZmFiL0hhbGxcIiB9LFxuICAgIFtVSUlELlVJTm90aWNlXTogeyBwcmVmYWI6IFwiUHJlZmFiL05vdGljZVwiIH0sXG4gICAgW1VJSUQuVUlCYWddOiB7IHByZWZhYjogXCJQcmVmYWIvQmFnXCIsIHByZXZlbnRUb3VjaDogdHJ1ZSB9LFxufVxuXG5AY2NjbGFzc1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVUlFeGFtcGxlIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcblxuICAgIHN0YXJ0KCkge1xuICAgICAgICB1aU1hbmFnZXIuaW5pdFVJQ29uZihVSUNGKTtcbiAgICAgICAgdWlNYW5hZ2VyLm9wZW4oVUlJRC5VSUxvZ2luKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgKGR0KSB7fVxufVxuIl19