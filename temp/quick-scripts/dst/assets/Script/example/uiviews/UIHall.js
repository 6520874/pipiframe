
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/uiviews/UIHall.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS91aXZpZXdzL1VJSGFsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBeUM7QUFDekMsZ0RBQStDO0FBQy9DLDBDQUFvQztBQUU5QixJQUFBLGtCQUFtQyxFQUFsQyxvQkFBTyxFQUFFLHNCQUF5QixDQUFDO0FBRzFDO0lBQW9DLDBCQUFNO0lBRDFDO1FBQUEscUVBaUJDO1FBYkcsWUFBTSxHQUFjLElBQUksQ0FBQzs7SUFhN0IsQ0FBQztJQVhVLHNCQUFLLEdBQVo7UUFDSSxxQkFBUyxDQUFDLElBQUksQ0FBQyxnQkFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTSx5QkFBUSxHQUFmO1FBQ0kscUJBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sc0JBQUssR0FBWixVQUFhLEtBQWEsRUFBRSxJQUFvQjtRQUM1QyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDbkMsQ0FBQztJQVpEO1FBREMsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUMsQ0FBQzswQ0FDSjtJQUhSLE1BQU07UUFEMUIsT0FBTztPQUNhLE1BQU0sQ0FnQjFCO0lBQUQsYUFBQztDQWhCRCxBQWdCQyxDQWhCbUMsZUFBTSxHQWdCekM7a0JBaEJvQixNQUFNIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVUlWaWV3IH0gZnJvbSBcIi4uLy4uL3VpL1VJVmlld1wiO1xuaW1wb3J0IHsgdWlNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uL3VpL1VJTWFuYWdlclwiO1xuaW1wb3J0IHsgVUlJRCB9IGZyb20gXCIuLi9VSUV4YW1wbGVcIjtcblxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XG5cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVSUhhbGwgZXh0ZW5kcyBVSVZpZXcge1xuXG4gICAgQHByb3BlcnR5KHt0eXBlIDogY2MuU3ByaXRlfSlcbiAgICB3ZWFwb246IGNjLlNwcml0ZSA9IG51bGw7XG5cbiAgICBwdWJsaWMgb25CYWcoKSB7XG4gICAgICAgIHVpTWFuYWdlci5vcGVuKFVJSUQuVUlCYWcpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbk5vdGljZSgpIHtcbiAgICAgICAgdWlNYW5hZ2VyLm9wZW4oVUlJRC5VSU5vdGljZSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uVG9wKHByZUlEOiBudW1iZXIsIGl0ZW06IGNjLlNwcml0ZUZyYW1lKSB7XG4gICAgICAgIHRoaXMud2VhcG9uLnNwcml0ZUZyYW1lID0gaXRlbTtcbiAgICB9XG59XG4iXX0=