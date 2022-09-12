
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/res/ResKeeper.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'e7548uPzG1IHbJAG5JOhIeu', 'ResKeeper');
// Script/res/ResKeeper.ts

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
var ResLoader_1 = require("./ResLoader");
/**
 * 资源引用类
 * 1. 提供加载功能，并记录加载过的资源
 * 2. 在node释放时自动清理加载过的资源
 * 3. 支持手动添加记录
 *
 * 2019-12-13 by 宝爷
 */
var ccclass = cc._decorator.ccclass;
var ResKeeper = /** @class */ (function (_super) {
    __extends(ResKeeper, _super);
    function ResKeeper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resCache = new Set();
        return _this;
    }
    ResKeeper.prototype.load = function () {
        var _this = this;
        // 最后一个参数是加载完成回调
        if (arguments.length < 2 || typeof arguments[arguments.length - 1] != "function") {
            console.error("load faile, completed callback not found");
            return;
        }
        // 包装完成回调，添加自动缓存功能
        var finishCallback = arguments[arguments.length - 1];
        arguments[arguments.length - 1] = function (error, resource) {
            if (!error) {
                if (resource instanceof Array) {
                    resource.forEach(function (element) {
                        _this.cacheAsset(element);
                    });
                }
                else {
                    _this.cacheAsset(resource);
                }
            }
            finishCallback();
        };
        // 调用加载接口
        ResLoader_1.default.load.apply(ResLoader_1.default, arguments);
    };
    /**
     * 缓存资源
     * @param asset
     */
    ResKeeper.prototype.cacheAsset = function (asset) {
        if (!this.resCache.has(asset)) {
            asset.addRef();
            this.resCache.add(asset);
        }
    };
    /**
     * 组件销毁时自动释放所有keep的资源
     */
    ResKeeper.prototype.onDestroy = function () {
        this.releaseAssets();
    };
    /**
     * 释放资源，组件销毁时自动调用
     */
    ResKeeper.prototype.releaseAssets = function () {
        this.resCache.forEach(function (element) {
            element.decRef();
        });
        this.resCache.clear();
    };
    ResKeeper = __decorate([
        ccclass
    ], ResKeeper);
    return ResKeeper;
}(cc.Component));
exports.ResKeeper = ResKeeper;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvcmVzL1Jlc0tlZXBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEU7QUFDNUU7Ozs7Ozs7R0FPRztBQUNLLElBQUEsK0JBQU8sQ0FBbUI7QUFHbEM7SUFBK0IsNkJBQVk7SUFEM0M7UUFBQSxxRUFnRkM7UUE3RVcsY0FBUSxHQUFHLElBQUksR0FBRyxFQUFZLENBQUM7O0lBNkUzQyxDQUFDO0lBbkRVLHdCQUFJLEdBQVg7UUFBQSxpQkFzQkM7UUFyQkcsZ0JBQWdCO1FBQ2hCLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksT0FBTyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxVQUFVLEVBQUU7WUFDOUUsT0FBTyxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1lBQzFELE9BQU87U0FDVjtRQUNELGtCQUFrQjtRQUNsQixJQUFJLGNBQWMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyRCxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFDLEtBQUssRUFBRSxRQUFRO1lBQzlDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1IsSUFBSSxRQUFRLFlBQVksS0FBSyxFQUFFO29CQUMzQixRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTzt3QkFDcEIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDN0IsQ0FBQyxDQUFDLENBQUM7aUJBQ047cUJBQU07b0JBQ0gsS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDN0I7YUFDSjtZQUNELGNBQWMsRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQTtRQUNELFNBQVM7UUFDVCxtQkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksOEJBQVUsR0FBakIsVUFBa0IsS0FBZTtRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDM0IsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUI7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSSw2QkFBUyxHQUFoQjtRQUNJLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQ7O09BRUc7SUFDSSxpQ0FBYSxHQUFwQjtRQUNJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztZQUN6QixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzFCLENBQUM7SUE5RVEsU0FBUztRQURyQixPQUFPO09BQ0ssU0FBUyxDQStFckI7SUFBRCxnQkFBQztDQS9FRCxBQStFQyxDQS9FOEIsRUFBRSxDQUFDLFNBQVMsR0ErRTFDO0FBL0VZLDhCQUFTIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlc0xvYWRlciwgeyBDb21wbGV0ZWRDYWxsYmFjaywgUHJvY2Vzc0NhbGxiYWNrIH0gZnJvbSBcIi4vUmVzTG9hZGVyXCI7XHJcbi8qKlxyXG4gKiDotYTmupDlvJXnlKjnsbtcclxuICogMS4g5o+Q5L6b5Yqg6L295Yqf6IO977yM5bm26K6w5b2V5Yqg6L296L+H55qE6LWE5rqQXHJcbiAqIDIuIOWcqG5vZGXph4rmlL7ml7boh6rliqjmuIXnkIbliqDovb3ov4fnmoTotYTmupBcclxuICogMy4g5pSv5oyB5omL5Yqo5re75Yqg6K6w5b2VXHJcbiAqIFxyXG4gKiAyMDE5LTEyLTEzIGJ5IOWuneeIt1xyXG4gKi9cclxuY29uc3QgeyBjY2NsYXNzIH0gPSBjYy5fZGVjb3JhdG9yO1xyXG5cclxuQGNjY2xhc3NcclxuZXhwb3J0IGNsYXNzIFJlc0tlZXBlciBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcblxyXG4gICAgcHJpdmF0ZSByZXNDYWNoZSA9IG5ldyBTZXQ8Y2MuQXNzZXQ+KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvIDlp4vliqDovb3otYTmupBcclxuICAgICAqIEBwYXJhbSBidW5kbGUgICAgICAgIGFzc2V0YnVuZGxl55qE6Lev5b6EXHJcbiAgICAgKiBAcGFyYW0gdXJsICAgICAgICAgICDotYTmupB1cmzmiJZ1cmzmlbDnu4RcclxuICAgICAqIEBwYXJhbSB0eXBlICAgICAgICAgIOi1hOa6kOexu+Wei++8jOm7mOiupOS4um51bGxcclxuICAgICAqIEBwYXJhbSBvblByb2dlc3MgICAgIOWKoOi9vei/m+W6puWbnuiwg1xyXG4gICAgICogQHBhcmFtIG9uQ29tcGxldGVkICAg5Yqg6L295a6M5oiQ5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBsb2FkKHVybDogc3RyaW5nLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQodXJsOiBzdHJpbmcsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQodXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKHVybDogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQodXJsOiBzdHJpbmdbXSwgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKHVybDogc3RyaW5nW10sIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQodXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQodXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvblByb2dlc3M6IFByb2Nlc3NDYWxsYmFjaywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZywgb25Qcm9nZXNzOiBQcm9jZXNzQ2FsbGJhY2ssIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgbG9hZChidW5kbGU6IHN0cmluZywgdXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvblByb2dlc3M6IFByb2Nlc3NDYWxsYmFjaywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZ1tdLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQoYnVuZGxlOiBzdHJpbmcsIHVybDogc3RyaW5nW10sIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQoYnVuZGxlOiBzdHJpbmcsIHVybDogc3RyaW5nW10sIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZ1tdLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQoKSB7XHJcbiAgICAgICAgLy8g5pyA5ZCO5LiA5Liq5Y+C5pWw5piv5Yqg6L295a6M5oiQ5Zue6LCDXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyIHx8IHR5cGVvZiBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdICE9IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBsb2FkIGZhaWxlLCBjb21wbGV0ZWQgY2FsbGJhY2sgbm90IGZvdW5kYCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5YyF6KOF5a6M5oiQ5Zue6LCD77yM5re75Yqg6Ieq5Yqo57yT5a2Y5Yqf6IO9XHJcbiAgICAgICAgbGV0IGZpbmlzaENhbGxiYWNrID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcclxuICAgICAgICBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdID0gKGVycm9yLCByZXNvdXJjZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVBc3NldChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZUFzc2V0KHJlc291cmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaW5pc2hDYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDosIPnlKjliqDovb3mjqXlj6NcclxuICAgICAgICBSZXNMb2FkZXIubG9hZC5hcHBseShSZXNMb2FkZXIsIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnvJPlrZjotYTmupBcclxuICAgICAqIEBwYXJhbSBhc3NldCBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNhY2hlQXNzZXQoYXNzZXQ6IGNjLkFzc2V0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJlc0NhY2hlLmhhcyhhc3NldCkpIHtcclxuICAgICAgICAgICAgYXNzZXQuYWRkUmVmKCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzQ2FjaGUuYWRkKGFzc2V0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnu4Tku7bplIDmr4Hml7boh6rliqjph4rmlL7miYDmnIlrZWVw55qE6LWE5rqQXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5yZWxlYXNlQXNzZXRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDph4rmlL7otYTmupDvvIznu4Tku7bplIDmr4Hml7boh6rliqjosIPnlKhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbGVhc2VBc3NldHMoKSB7XHJcbiAgICAgICAgdGhpcy5yZXNDYWNoZS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBlbGVtZW50LmRlY1JlZigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVzQ2FjaGUuY2xlYXIoKTtcclxuICAgIH1cclxufSJdfQ==