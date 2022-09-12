
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/EmptyScene.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '2d3e36atnNNiLeEqusEYQBm', 'EmptyScene');
// Script/example/EmptyScene.ts

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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var EmptyScene = /** @class */ (function (_super) {
    __extends(EmptyScene, _super);
    function EmptyScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        return _this;
    }
    EmptyScene.prototype.start = function () {
        var ccloader = cc.loader;
        this.label.string = "Current Scene Asset Count " + Object.keys(ccloader._cache).length;
    };
    __decorate([
        property(cc.Label)
    ], EmptyScene.prototype, "label", void 0);
    EmptyScene = __decorate([
        ccclass
    ], EmptyScene);
    return EmptyScene;
}(cc.Component));
exports.default = EmptyScene;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS9FbXB0eVNjZW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFNLElBQUEsa0JBQXFDLEVBQW5DLG9CQUFPLEVBQUUsc0JBQTBCLENBQUM7QUFFNUM7SUFBd0MsOEJBQVk7SUFEcEQ7UUFBQSxxRUFTQztRQU5HLFdBQUssR0FBYSxJQUFJLENBQUM7O0lBTTNCLENBQUM7SUFKRywwQkFBSyxHQUFMO1FBQ0ksSUFBSSxRQUFRLEdBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQztRQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRywrQkFBNkIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBUSxDQUFDO0lBQzNGLENBQUM7SUFMRDtRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDOzZDQUNJO0lBRk4sVUFBVTtRQUQ5QixPQUFPO09BQ2EsVUFBVSxDQVE5QjtJQUFELGlCQUFDO0NBUkQsQUFRQyxDQVJ1QyxFQUFFLENBQUMsU0FBUyxHQVFuRDtrQkFSb0IsVUFBVSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XG5AY2NjbGFzc1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW1wdHlTY2VuZSBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG4gICAgQHByb3BlcnR5KGNjLkxhYmVsKVxuICAgIGxhYmVsOiBjYy5MYWJlbCA9IG51bGw7XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgbGV0IGNjbG9hZGVyOiBhbnkgPSBjYy5sb2FkZXI7XG4gICAgICAgIHRoaXMubGFiZWwuc3RyaW5nID0gYEN1cnJlbnQgU2NlbmUgQXNzZXQgQ291bnQgJHtPYmplY3Qua2V5cyhjY2xvYWRlci5fY2FjaGUpLmxlbmd0aH1gO1xuICAgIH1cbn1cbiJdfQ==