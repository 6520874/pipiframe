
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/ResExample.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '35e3enlxPVNnbcdFPQpVJAV', 'ResExample');
// Script/example/ResExample.ts

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
var ResLoader_1 = require("../res/ResLoader");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NetExample = /** @class */ (function (_super) {
    __extends(NetExample, _super);
    function NetExample() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.attachNode = null;
        _this.dumpLabel = null;
        _this.ress = null;
        _this.remoteRes = null;
        return _this;
    }
    NetExample.prototype.start = function () {
    };
    NetExample.prototype.onLoadRes = function () {
        var _this = this;
        cc.loader.loadRes("prefabDir/HelloWorld", cc.Prefab, function (error, prefab) {
            if (!error) {
                cc.instantiate(prefab).parent = _this.attachNode;
            }
        });
    };
    NetExample.prototype.onUnloadRes = function () {
        this.attachNode.destroyAllChildren();
        cc.loader.releaseRes("prefabDir/HelloWorld");
    };
    NetExample.prototype.onMyLoadRes = function () {
        var _this = this;
        ResLoader_1.default.loadDir("prefabDir", cc.Prefab, function (error, prefabs) {
            if (!error) {
                _this.ress = prefabs;
                for (var i = 0; i < prefabs.length; ++i) {
                    cc.instantiate(prefabs[i]).parent = _this.attachNode;
                }
            }
        });
    };
    NetExample.prototype.onMyUnloadRes = function () {
        this.attachNode.destroyAllChildren();
        if (this.ress) {
            for (var _i = 0, _a = this.ress; _i < _a.length; _i++) {
                var item = _a[_i];
                ResLoader_1.default.release(item);
            }
            this.ress = null;
        }
    };
    NetExample.prototype.onLoadRemote = function () {
        var _this = this;
        ResLoader_1.default.load("http://tools.itharbors.com/christmas/res/tree.png", function (err, res) {
            if (err || !res)
                return;
            _this.remoteRes = res;
            var spriteFrame = new cc.SpriteFrame(res);
            var node = new cc.Node("tmp");
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            node.parent = _this.attachNode;
        });
    };
    NetExample.prototype.onUnloadRemote = function () {
        this.attachNode.destroyAllChildren();
        this.remoteRes.decRef();
    };
    NetExample.prototype.onDump = function () {
        var Loader = cc.loader;
        this.dumpLabel.string = "\u5F53\u524D\u8D44\u6E90\u603B\u6570:" + Object.keys(Loader._cache).length;
    };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS9SZXNFeGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUF3RDtBQUVsRCxJQUFBLGtCQUFxQyxFQUFuQyxvQkFBTyxFQUFFLHNCQUEwQixDQUFDO0FBRzVDO0lBQXdDLDhCQUFZO0lBRHBEO1FBQUEscUVBbUVDO1FBaEVHLGdCQUFVLEdBQVksSUFBSSxDQUFDO1FBRTNCLGVBQVMsR0FBYSxJQUFJLENBQUM7UUFDM0IsVUFBSSxHQUFlLElBQUksQ0FBQztRQUN4QixlQUFTLEdBQWEsSUFBSSxDQUFDOztJQTREL0IsQ0FBQztJQTFERywwQkFBSyxHQUFMO0lBQ0EsQ0FBQztJQUVELDhCQUFTLEdBQVQ7UUFBQSxpQkFNQztRQUxHLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFZLEVBQUUsTUFBaUI7WUFDakYsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDUixFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDO2FBQ25EO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsZ0NBQVcsR0FBWDtRQUNJLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNyQyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxnQ0FBVyxHQUFYO1FBQUEsaUJBU0M7UUFSRyxtQkFBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQVksRUFBRSxPQUFvQjtZQUN6RSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNSLEtBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO2dCQUNwQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtvQkFDckMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQztpQkFDdkQ7YUFDSjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGtDQUFhLEdBQWI7UUFDSSxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDckMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1gsS0FBZ0IsVUFBUyxFQUFULEtBQUEsSUFBSSxDQUFDLElBQUksRUFBVCxjQUFTLEVBQVQsSUFBUyxFQUFFO2dCQUF2QixJQUFJLElBQUksU0FBQTtnQkFDUixtQkFBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMzQjtZQUNELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO0lBQ0wsQ0FBQztJQUVELGlDQUFZLEdBQVo7UUFBQSxpQkFVQztRQVRHLG1CQUFTLENBQUMsSUFBSSxDQUFDLG1EQUFtRCxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDekUsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHO2dCQUFFLE9BQU87WUFDeEIsS0FBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7WUFDckIsSUFBSSxXQUFXLEdBQUcsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFDLElBQUksSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsbUNBQWMsR0FBZDtRQUNJLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCwyQkFBTSxHQUFOO1FBQ0ksSUFBSSxNQUFNLEdBQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRywwQ0FBVSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFRLENBQUM7SUFDMUUsQ0FBQztJQS9ERDtRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO2tEQUNTO0lBRTNCO1FBREMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7aURBQ1E7SUFKVixVQUFVO1FBRDlCLE9BQU87T0FDYSxVQUFVLENBa0U5QjtJQUFELGlCQUFDO0NBbEVELEFBa0VDLENBbEV1QyxFQUFFLENBQUMsU0FBUyxHQWtFbkQ7a0JBbEVvQixVQUFVIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlc0xvYWRlciwgeyByZXNMb2FkZXIgfSBmcm9tIFwiLi4vcmVzL1Jlc0xvYWRlclwiO1xyXG5cclxuY29uc3QgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5ldEV4YW1wbGUgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xyXG4gICAgQHByb3BlcnR5KGNjLk5vZGUpXHJcbiAgICBhdHRhY2hOb2RlOiBjYy5Ob2RlID0gbnVsbDtcclxuICAgIEBwcm9wZXJ0eShjYy5MYWJlbClcclxuICAgIGR1bXBMYWJlbDogY2MuTGFiZWwgPSBudWxsO1xyXG4gICAgcmVzczogY2MuQXNzZXRbXSA9IG51bGw7XHJcbiAgICByZW1vdGVSZXM6IGNjLkFzc2V0ID0gbnVsbDtcclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWRSZXMoKSB7XHJcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWJEaXIvSGVsbG9Xb3JsZFwiLCBjYy5QcmVmYWIsIChlcnJvcjogRXJyb3IsIHByZWZhYjogY2MuUHJlZmFiKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNjLmluc3RhbnRpYXRlKHByZWZhYikucGFyZW50ID0gdGhpcy5hdHRhY2hOb2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25VbmxvYWRSZXMoKSB7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hOb2RlLmRlc3Ryb3lBbGxDaGlsZHJlbigpO1xyXG4gICAgICAgIGNjLmxvYWRlci5yZWxlYXNlUmVzKFwicHJlZmFiRGlyL0hlbGxvV29ybGRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgb25NeUxvYWRSZXMoKSB7XHJcbiAgICAgICAgUmVzTG9hZGVyLmxvYWREaXIoXCJwcmVmYWJEaXJcIiwgY2MuUHJlZmFiLCAoZXJyb3I6IEVycm9yLCBwcmVmYWJzOiBjYy5QcmVmYWJbXSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3MgPSBwcmVmYWJzO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmVmYWJzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuaW5zdGFudGlhdGUocHJlZmFic1tpXSkucGFyZW50ID0gdGhpcy5hdHRhY2hOb2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25NeVVubG9hZFJlcygpIHtcclxuICAgICAgICB0aGlzLmF0dGFjaE5vZGUuZGVzdHJveUFsbENoaWxkcmVuKCk7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzcykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGl0ZW0gb2YgdGhpcy5yZXNzKSB7XHJcbiAgICAgICAgICAgICAgICBSZXNMb2FkZXIucmVsZWFzZShpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlc3MgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWRSZW1vdGUoKSB7XHJcbiAgICAgICAgUmVzTG9hZGVyLmxvYWQoXCJodHRwOi8vdG9vbHMuaXRoYXJib3JzLmNvbS9jaHJpc3RtYXMvcmVzL3RyZWUucG5nXCIsIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyIHx8ICFyZXMpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdGVSZXMgPSByZXM7XHJcbiAgICAgICAgICAgIGxldCBzcHJpdGVGcmFtZSA9IG5ldyBjYy5TcHJpdGVGcmFtZShyZXMpO1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBjYy5Ob2RlKFwidG1wXCIpO1xyXG4gICAgICAgICAgICBsZXQgc3ByaXRlID0gbm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcclxuICAgICAgICAgICAgc3ByaXRlLnNwcml0ZUZyYW1lID0gc3ByaXRlRnJhbWU7XHJcbiAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5hdHRhY2hOb2RlO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgb25VbmxvYWRSZW1vdGUoKSB7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hOb2RlLmRlc3Ryb3lBbGxDaGlsZHJlbigpO1xyXG4gICAgICAgIHRoaXMucmVtb3RlUmVzLmRlY1JlZigpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRHVtcCgpIHtcclxuICAgICAgICBsZXQgTG9hZGVyOmFueSA9IGNjLmxvYWRlcjtcclxuICAgICAgICB0aGlzLmR1bXBMYWJlbC5zdHJpbmcgPSBg5b2T5YmN6LWE5rqQ5oC75pWwOiR7T2JqZWN0LmtleXMoTG9hZGVyLl9jYWNoZSkubGVuZ3RofWA7XHJcbiAgICB9XHJcbn1cclxuIl19