
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/uiviews/UIBag.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS91aXZpZXdzL1VJQmFnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUF5QztBQUN6QyxnREFBK0M7QUFFL0Msb0JBQW9CO0FBQ3BCLGtGQUFrRjtBQUNsRix5RkFBeUY7QUFDekYsbUJBQW1CO0FBQ25CLDRGQUE0RjtBQUM1RixtR0FBbUc7QUFDbkcsOEJBQThCO0FBQzlCLDRGQUE0RjtBQUM1RixtR0FBbUc7QUFFN0YsSUFBQSxrQkFBbUMsRUFBbEMsb0JBQU8sRUFBRSxzQkFBeUIsQ0FBQztBQUcxQztJQUFtQyx5QkFBTTtJQUR6QztRQUFBLHFFQTZCQztRQTNCVyxnQkFBVSxHQUFtQixJQUFJLENBQUM7UUFDbEMsZ0JBQVUsR0FBWSxJQUFJLENBQUM7O0lBMEJ2QyxDQUFDO0lBeEJVLG9CQUFJLEdBQVg7SUFFQSxDQUFDO0lBRU0sdUJBQU8sR0FBZCxVQUFlLEtBQUs7UUFDaEIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxJQUFJLEdBQWEsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNsQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU5QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDekMsQ0FBQztJQUVNLHlCQUFTLEdBQWhCO1FBQ0kscUJBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU0sdUJBQU8sR0FBZDtRQUNJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBM0JnQixLQUFLO1FBRHpCLE9BQU87T0FDYSxLQUFLLENBNEJ6QjtJQUFELFlBQUM7Q0E1QkQsQUE0QkMsQ0E1QmtDLGVBQU0sR0E0QnhDO2tCQTVCb0IsS0FBSyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVJVmlldyB9IGZyb20gXCIuLi8uLi91aS9VSVZpZXdcIjtcbmltcG9ydCB7IHVpTWFuYWdlciB9IGZyb20gXCIuLi8uLi91aS9VSU1hbmFnZXJcIjtcblxuLy8gTGVhcm4gVHlwZVNjcmlwdDpcbi8vICAtIFtDaGluZXNlXSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL3poL3NjcmlwdGluZy90eXBlc2NyaXB0Lmh0bWxcbi8vICAtIFtFbmdsaXNoXSBodHRwOi8vd3d3LmNvY29zMmQteC5vcmcvZG9jcy9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvdHlwZXNjcmlwdC5odG1sXG4vLyBMZWFybiBBdHRyaWJ1dGU6XG4vLyAgLSBbQ2hpbmVzZV0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC96aC9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxuLy8gIC0gW0VuZ2xpc2hdIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZy9kb2NzL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9yZWZlcmVuY2UvYXR0cmlidXRlcy5odG1sXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcbi8vICAtIFtDaGluZXNlXSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL3poL3NjcmlwdGluZy9saWZlLWN5Y2xlLWNhbGxiYWNrcy5odG1sXG4vLyAgLSBbRW5nbGlzaF0gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnL2RvY3MvY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcblxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XG5cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVSUJhZyBleHRlbmRzIFVJVmlldyB7XG4gICAgcHJpdmF0ZSBzZWxlY3RJdGVtOiBjYy5TcHJpdGVGcmFtZSA9IG51bGw7XG4gICAgcHJpdmF0ZSBzZWxlY3ROb2RlOiBjYy5Ob2RlID0gbnVsbDtcbiAgICBcbiAgICBwdWJsaWMgaW5pdCgpIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBvbkNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdE5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0Tm9kZS5zZXRTY2FsZSgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBub2RlIDogY2MuTm9kZSA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgdGhpcy5zZWxlY3ROb2RlID0gbm9kZTtcbiAgICAgICAgdGhpcy5zZWxlY3ROb2RlLnNldFNjYWxlKDEuNSk7XG5cbiAgICAgICAgbGV0IHNwcml0ZSA9IG5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIHRoaXMuc2VsZWN0SXRlbSA9IHNwcml0ZS5zcHJpdGVGcmFtZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Pa0NsaWNrKCkge1xuICAgICAgICB1aU1hbmFnZXIuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25DbG9zZSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RJdGVtO1xuICAgIH1cbn1cbiJdfQ==