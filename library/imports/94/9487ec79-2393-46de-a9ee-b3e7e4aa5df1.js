"use strict";
cc._RF.push(module, '9487ex5I5NG3qnus+fkql3x', 'ResLeakChecker');
// Script/res/ResLeakChecker.ts

"use strict";
/**
 * 资源泄露检查类，可以用于跟踪资源的引用情况
 *
 * 2021-1-31 by 宝爷
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ResUtil_1 = require("./ResUtil");
var ResLeakChecker = /** @class */ (function () {
    function ResLeakChecker() {
        this.resFilter = null; // 资源过滤回调
        this._checking = false;
        this.traceAssets = new Set();
    }
    /**
     * 检查该资源是否符合过滤条件
     * @param url
     */
    ResLeakChecker.prototype.checkFilter = function (asset) {
        if (!this._checking) {
            return false;
        }
        if (this.resFilter) {
            return this.resFilter(asset);
        }
        return true;
    };
    /**
     * 对资源进行引用的跟踪
     * @param asset
     */
    ResLeakChecker.prototype.traceAsset = function (asset) {
        if (!this.checkFilter(asset)) {
            return;
        }
        if (!this.traceAssets.has(asset)) {
            asset.addRef();
            this.extendAsset(asset);
            this.traceAssets.add(asset);
        }
    };
    /**
     * 扩展asset，使其支持引用计数追踪
     * @param asset
     */
    ResLeakChecker.prototype.extendAsset = function (asset) {
        var addRefFunc = asset.addRef;
        var decRefFunc = asset.decRef;
        var traceMap = new Map();
        asset['@traceMap'] = traceMap;
        asset.addRef = function () {
            var stack = ResUtil_1.ResUtil.getCallStack(1);
            var cnt = traceMap.has(stack) ? traceMap.get(stack) + 1 : 1;
            traceMap.set(stack, cnt);
            return addRefFunc.apply(asset, arguments);
        };
        asset.decRef = function () {
            var stack = ResUtil_1.ResUtil.getCallStack(1);
            var cnt = traceMap.has(stack) ? traceMap.get(stack) + 1 : 1;
            traceMap.set(stack, cnt);
            return decRefFunc.apply(asset, arguments);
        };
    };
    /**
     * 还原asset，使其恢复默认的引用计数功能
     * @param asset
     */
    ResLeakChecker.prototype.resetAsset = function (asset) {
        if (asset['@traceMap']) {
            delete asset.addRef;
            delete asset.decRef;
            delete asset['@traceMap'];
        }
    };
    ResLeakChecker.prototype.untraceAsset = function (asset) {
        if (this.traceAssets.has(asset)) {
            this.resetAsset(asset);
            asset.decRef();
            this.traceAssets.delete(asset);
        }
    };
    ResLeakChecker.prototype.startCheck = function () { this._checking = true; };
    ResLeakChecker.prototype.stopCheck = function () { this._checking = false; };
    ResLeakChecker.prototype.getTraceAssets = function () { return this.traceAssets; };
    ResLeakChecker.prototype.reset = function () {
        var _this = this;
        this.traceAssets.forEach(function (element) {
            _this.resetAsset(element);
            element.decRef();
        });
        this.traceAssets.clear();
    };
    ResLeakChecker.prototype.dump = function () {
        this.traceAssets.forEach(function (element) {
            var traceMap = element['@traceMap'];
            if (traceMap) {
                traceMap.forEach(function (key, value) {
                    console.log(key + " : " + value + " ");
                });
            }
        });
    };
    return ResLeakChecker;
}());
exports.ResLeakChecker = ResLeakChecker;

cc._RF.pop();