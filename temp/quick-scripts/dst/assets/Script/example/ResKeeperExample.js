
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/ResKeeperExample.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '44dff6sUhxOK5EHy6webOHq', 'ResKeeperExample');
// Script/example/ResKeeperExample.ts

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
var ResLeakChecker_1 = require("../res/ResLeakChecker");
var ResLoader_1 = require("../res/ResLoader");
var ResUtil_1 = require("../res/ResUtil");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NetExample = /** @class */ (function (_super) {
    __extends(NetExample, _super);
    function NetExample() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resUtilMode = true;
        _this.attachNode = null;
        _this.dumpLabel = null;
        _this.checker = new ResLeakChecker_1.ResLeakChecker();
        return _this;
    }
    NetExample.prototype.start = function () {
        this.checker.startCheck();
    };
    NetExample.prototype.onAdd = function () {
        var _this = this;
        ResLoader_1.default.load("prefabDir/HelloWorld", cc.Prefab, function (error, prefab) {
            if (!error) {
                var myNode = ResUtil_1.ResUtil.instantiate(prefab);
                myNode.parent = _this.attachNode;
                myNode.setPosition((Math.random() * 500) - 250, myNode.position.y);
                console.log(myNode.position);
                prefab.decRef();
            }
        });
    };
    NetExample.prototype.onSub = function () {
        if (this.attachNode.childrenCount > 0) {
            this.attachNode.children[this.attachNode.childrenCount - 1].destroy();
        }
    };
    NetExample.prototype.onAssign = function () {
        var _this = this;
        ResLoader_1.default.load("images/test", cc.SpriteFrame, function (error, sp) {
            _this.checker.traceAsset(sp);
            if (_this.attachNode.childrenCount > 0) {
                var targetNode = _this.attachNode.children[_this.attachNode.childrenCount - 1];
                targetNode.getComponent(cc.Sprite).spriteFrame = ResUtil_1.ResUtil.assignWith(sp, targetNode, true);
            }
            sp.decRef();
        });
    };
    NetExample.prototype.onClean = function () {
        this.attachNode.destroyAllChildren();
    };
    NetExample.prototype.onDump = function () {
        this.checker.dump();
        var Loader = cc.loader;
        this.dumpLabel.string = "\u5F53\u524D\u8D44\u6E90\u603B\u6570:" + Object.keys(Loader._cache).length;
    };
    NetExample.prototype.onLoadClick = function () {
        cc.director.loadScene("example_empty");
    };
    NetExample.prototype.onPreloadClick = function () {
        cc.director.preloadScene("example_empty");
    };
    __decorate([
        property(cc.Boolean)
    ], NetExample.prototype, "resUtilMode", void 0);
    __decorate([
        property(cc.Node)
    ], NetExample.prototype, "attachNode", void 0);
    __decorate([
        property(cc.Label)
    ], NetExample.prototype, "dumpLabel", void 0);
    NetExample = __decorate([
        ccclass
    ], NetExample);
    return NetExample;
}(cc.Component));
exports.default = NetExample;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS9SZXNLZWVwZXJFeGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdEQUF1RDtBQUN2RCw4Q0FBd0Q7QUFDeEQsMENBQXlDO0FBRW5DLElBQUEsa0JBQXFDLEVBQW5DLG9CQUFPLEVBQUUsc0JBQTBCLENBQUM7QUFHNUM7SUFBd0MsOEJBQVk7SUFEcEQ7UUFBQSxxRUE0REM7UUF6REcsaUJBQVcsR0FBRyxJQUFJLENBQUM7UUFFbkIsZ0JBQVUsR0FBWSxJQUFJLENBQUM7UUFFM0IsZUFBUyxHQUFhLElBQUksQ0FBQztRQUMzQixhQUFPLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7O0lBb0RuQyxDQUFDO0lBbERHLDBCQUFLLEdBQUw7UUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCwwQkFBSyxHQUFMO1FBQUEsaUJBVUM7UUFURyxtQkFBUyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBWSxFQUFFLE1BQWlCO1lBQzlFLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1IsSUFBSSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNuQjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDBCQUFLLEdBQUw7UUFDSSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxHQUFHLENBQUMsRUFBRTtZQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN6RTtJQUNMLENBQUM7SUFFRCw2QkFBUSxHQUFSO1FBQUEsaUJBU0M7UUFSRyxtQkFBUyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFDLEtBQVksRUFBRSxFQUFrQjtZQUMzRSxLQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QixJQUFJLEtBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxHQUFHLENBQUMsRUFBRTtnQkFDbkMsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzdFLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsR0FBRyxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzdGO1lBQ0QsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDRCQUFPLEdBQVA7UUFDSSxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELDJCQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLElBQUksTUFBTSxHQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsMENBQVUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBUSxDQUFDO0lBQzFFLENBQUM7SUFFRCxnQ0FBVyxHQUFYO1FBQ0ksRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELG1DQUFjLEdBQWQ7UUFDSSxFQUFFLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBeEREO1FBREMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUM7bURBQ0Y7SUFFbkI7UUFEQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztrREFDUztJQUUzQjtRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO2lEQUNRO0lBTlYsVUFBVTtRQUQ5QixPQUFPO09BQ2EsVUFBVSxDQTJEOUI7SUFBRCxpQkFBQztDQTNERCxBQTJEQyxDQTNEdUMsRUFBRSxDQUFDLFNBQVMsR0EyRG5EO2tCQTNEb0IsVUFBVSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlc0xlYWtDaGVja2VyIH0gZnJvbSBcIi4uL3Jlcy9SZXNMZWFrQ2hlY2tlclwiO1xyXG5pbXBvcnQgUmVzTG9hZGVyLCB7IHJlc0xvYWRlciB9IGZyb20gXCIuLi9yZXMvUmVzTG9hZGVyXCI7XHJcbmltcG9ydCB7IFJlc1V0aWwgfSBmcm9tIFwiLi4vcmVzL1Jlc1V0aWxcIjtcclxuXHJcbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG5AY2NjbGFzc1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOZXRFeGFtcGxlIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuICAgIEBwcm9wZXJ0eShjYy5Cb29sZWFuKVxyXG4gICAgcmVzVXRpbE1vZGUgPSB0cnVlO1xyXG4gICAgQHByb3BlcnR5KGNjLk5vZGUpXHJcbiAgICBhdHRhY2hOb2RlOiBjYy5Ob2RlID0gbnVsbDtcclxuICAgIEBwcm9wZXJ0eShjYy5MYWJlbClcclxuICAgIGR1bXBMYWJlbDogY2MuTGFiZWwgPSBudWxsO1xyXG4gICAgY2hlY2tlciA9IG5ldyBSZXNMZWFrQ2hlY2tlcigpO1xyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tlci5zdGFydENoZWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25BZGQoKSB7XHJcbiAgICAgICAgUmVzTG9hZGVyLmxvYWQoXCJwcmVmYWJEaXIvSGVsbG9Xb3JsZFwiLCBjYy5QcmVmYWIsIChlcnJvcjogRXJyb3IsIHByZWZhYjogY2MuUHJlZmFiKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGxldCBteU5vZGUgPSBSZXNVdGlsLmluc3RhbnRpYXRlKHByZWZhYik7XHJcbiAgICAgICAgICAgICAgICBteU5vZGUucGFyZW50ID0gdGhpcy5hdHRhY2hOb2RlO1xyXG4gICAgICAgICAgICAgICAgbXlOb2RlLnNldFBvc2l0aW9uKChNYXRoLnJhbmRvbSgpICogNTAwKSAtIDI1MCwgbXlOb2RlLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXlOb2RlLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIHByZWZhYi5kZWNSZWYoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uU3ViKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmF0dGFjaE5vZGUuY2hpbGRyZW5Db3VudCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5hdHRhY2hOb2RlLmNoaWxkcmVuW3RoaXMuYXR0YWNoTm9kZS5jaGlsZHJlbkNvdW50IC0gMV0uZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkFzc2lnbigpIHtcclxuICAgICAgICBSZXNMb2FkZXIubG9hZChcImltYWdlcy90ZXN0XCIsIGNjLlNwcml0ZUZyYW1lLCAoZXJyb3I6IEVycm9yLCBzcDogY2MuU3ByaXRlRnJhbWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jaGVja2VyLnRyYWNlQXNzZXQoc3ApO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hdHRhY2hOb2RlLmNoaWxkcmVuQ291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0Tm9kZSA9IHRoaXMuYXR0YWNoTm9kZS5jaGlsZHJlblt0aGlzLmF0dGFjaE5vZGUuY2hpbGRyZW5Db3VudCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IFJlc1V0aWwuYXNzaWduV2l0aChzcCwgdGFyZ2V0Tm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3AuZGVjUmVmKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25DbGVhbigpIHtcclxuICAgICAgICB0aGlzLmF0dGFjaE5vZGUuZGVzdHJveUFsbENoaWxkcmVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25EdW1wKCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tlci5kdW1wKCk7XHJcbiAgICAgICAgbGV0IExvYWRlcjogYW55ID0gY2MubG9hZGVyO1xyXG4gICAgICAgIHRoaXMuZHVtcExhYmVsLnN0cmluZyA9IGDlvZPliY3otYTmupDmgLvmlbA6JHtPYmplY3Qua2V5cyhMb2FkZXIuX2NhY2hlKS5sZW5ndGh9YDtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWRDbGljaygpIHtcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJleGFtcGxlX2VtcHR5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUHJlbG9hZENsaWNrKCkge1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLnByZWxvYWRTY2VuZShcImV4YW1wbGVfZW1wdHlcIik7XHJcbiAgICB9XHJcbn1cclxuIl19