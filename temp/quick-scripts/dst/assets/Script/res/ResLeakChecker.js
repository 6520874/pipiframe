
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/res/ResLeakChecker.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvcmVzL1Jlc0xlYWtDaGVja2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHOztBQUVILHFDQUFvQztBQUlwQztJQUFBO1FBQ1csY0FBUyxHQUFtQixJQUFJLENBQUMsQ0FBSSxTQUFTO1FBQzdDLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsZ0JBQVcsR0FBa0IsSUFBSSxHQUFHLEVBQVksQ0FBQztJQWlHN0QsQ0FBQztJQS9GRzs7O09BR0c7SUFDSSxvQ0FBVyxHQUFsQixVQUFtQixLQUFlO1FBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2pCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNoQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7O09BR0c7SUFDSSxtQ0FBVSxHQUFqQixVQUFrQixLQUFlO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzFCLE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM5QixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9CO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNJLG9DQUFXLEdBQWxCLFVBQW1CLEtBQWU7UUFDOUIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM5QixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzlC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LENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxDQUFDO2FBQ047UUFDTCxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFDTCxxQkFBQztBQUFELENBcEdBLEFBb0dDLElBQUE7QUFwR1ksd0NBQWMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog6LWE5rqQ5rOE6Zyy5qOA5p+l57G777yM5Y+v5Lul55So5LqO6Lef6Liq6LWE5rqQ55qE5byV55So5oOF5Ya1XHJcbiAqIFxyXG4gKiAyMDIxLTEtMzEgYnkg5a6d54i3XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgUmVzVXRpbCB9IGZyb20gXCIuL1Jlc1V0aWxcIjtcclxuXHJcbmV4cG9ydCB0eXBlIEZpbHRlckNhbGxiYWNrID0gKGFzc2V0OiBjYy5Bc3NldCkgPT4gYm9vbGVhbjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZXNMZWFrQ2hlY2tlciB7XHJcbiAgICBwdWJsaWMgcmVzRmlsdGVyOiBGaWx0ZXJDYWxsYmFjayA9IG51bGw7ICAgIC8vIOi1hOa6kOi/h+a7pOWbnuiwg1xyXG4gICAgcHJpdmF0ZSBfY2hlY2tpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgdHJhY2VBc3NldHM6IFNldDxjYy5Bc3NldD4gPSBuZXcgU2V0PGNjLkFzc2V0PigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qOA5p+l6K+l6LWE5rqQ5piv5ZCm56ym5ZCI6L+H5ruk5p2h5Lu2XHJcbiAgICAgKiBAcGFyYW0gdXJsIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2hlY2tGaWx0ZXIoYXNzZXQ6IGNjLkFzc2V0KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jaGVja2luZykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlc0ZpbHRlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNGaWx0ZXIoYXNzZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWvuei1hOa6kOi/m+ihjOW8leeUqOeahOi3n+i4qlxyXG4gICAgICogQHBhcmFtIGFzc2V0IFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdHJhY2VBc3NldChhc3NldDogY2MuQXNzZXQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2hlY2tGaWx0ZXIoYXNzZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLnRyYWNlQXNzZXRzLmhhcyhhc3NldCkpIHtcclxuICAgICAgICAgICAgYXNzZXQuYWRkUmVmKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXh0ZW5kQXNzZXQoYXNzZXQpO1xyXG4gICAgICAgICAgICB0aGlzLnRyYWNlQXNzZXRzLmFkZChhc3NldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omp5bGVYXNzZXTvvIzkvb/lhbbmlK/mjIHlvJXnlKjorqHmlbDov73ouKpcclxuICAgICAqIEBwYXJhbSBhc3NldCBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGV4dGVuZEFzc2V0KGFzc2V0OiBjYy5Bc3NldCkge1xyXG4gICAgICAgIGxldCBhZGRSZWZGdW5jID0gYXNzZXQuYWRkUmVmO1xyXG4gICAgICAgIGxldCBkZWNSZWZGdW5jID0gYXNzZXQuZGVjUmVmO1xyXG4gICAgICAgIGxldCB0cmFjZU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XHJcbiAgICAgICAgYXNzZXRbJ0B0cmFjZU1hcCddID0gdHJhY2VNYXA7XHJcbiAgICAgICAgYXNzZXQuYWRkUmVmID0gZnVuY3Rpb24gKCk6IGNjLkFzc2V0IHtcclxuICAgICAgICAgICAgbGV0IHN0YWNrID0gUmVzVXRpbC5nZXRDYWxsU3RhY2soMSk7XHJcbiAgICAgICAgICAgIGxldCBjbnQgPSB0cmFjZU1hcC5oYXMoc3RhY2spID8gdHJhY2VNYXAuZ2V0KHN0YWNrKSArIDEgOiAxO1xyXG4gICAgICAgICAgICB0cmFjZU1hcC5zZXQoc3RhY2ssIGNudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBhZGRSZWZGdW5jLmFwcGx5KGFzc2V0LCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXNzZXQuZGVjUmVmID0gZnVuY3Rpb24gKCk6IGNjLkFzc2V0IHtcclxuICAgICAgICAgICAgbGV0IHN0YWNrID0gUmVzVXRpbC5nZXRDYWxsU3RhY2soMSk7XHJcbiAgICAgICAgICAgIGxldCBjbnQgPSB0cmFjZU1hcC5oYXMoc3RhY2spID8gdHJhY2VNYXAuZ2V0KHN0YWNrKSArIDEgOiAxO1xyXG4gICAgICAgICAgICB0cmFjZU1hcC5zZXQoc3RhY2ssIGNudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWNSZWZGdW5jLmFwcGx5KGFzc2V0LCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/mOWOn2Fzc2V077yM5L2/5YW25oGi5aSN6buY6K6k55qE5byV55So6K6h5pWw5Yqf6IO9XHJcbiAgICAgKiBAcGFyYW0gYXNzZXQgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXNldEFzc2V0KGFzc2V0OiBjYy5Bc3NldCkge1xyXG4gICAgICAgIGlmIChhc3NldFsnQHRyYWNlTWFwJ10pIHtcclxuICAgICAgICAgICAgZGVsZXRlIGFzc2V0LmFkZFJlZjtcclxuICAgICAgICAgICAgZGVsZXRlIGFzc2V0LmRlY1JlZjtcclxuICAgICAgICAgICAgZGVsZXRlIGFzc2V0WydAdHJhY2VNYXAnXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVudHJhY2VBc3NldChhc3NldDogY2MuQXNzZXQpIHtcclxuICAgICAgICBpZiAodGhpcy50cmFjZUFzc2V0cy5oYXMoYXNzZXQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRBc3NldChhc3NldCk7XHJcbiAgICAgICAgICAgIGFzc2V0LmRlY1JlZigpO1xyXG4gICAgICAgICAgICB0aGlzLnRyYWNlQXNzZXRzLmRlbGV0ZShhc3NldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydENoZWNrKCkgeyB0aGlzLl9jaGVja2luZyA9IHRydWU7IH1cclxuICAgIHB1YmxpYyBzdG9wQ2hlY2soKSB7IHRoaXMuX2NoZWNraW5nID0gZmFsc2U7IH1cclxuICAgIHB1YmxpYyBnZXRUcmFjZUFzc2V0cygpOiBTZXQ8Y2MuQXNzZXQ+IHsgcmV0dXJuIHRoaXMudHJhY2VBc3NldHM7IH1cclxuXHJcbiAgICBwdWJsaWMgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy50cmFjZUFzc2V0cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0QXNzZXQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZGVjUmVmKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50cmFjZUFzc2V0cy5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkdW1wKCkge1xyXG4gICAgICAgIHRoaXMudHJhY2VBc3NldHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHRyYWNlTWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gZWxlbWVudFsnQHRyYWNlTWFwJ107XHJcbiAgICAgICAgICAgIGlmICh0cmFjZU1hcCkge1xyXG4gICAgICAgICAgICAgICAgdHJhY2VNYXAuZm9yRWFjaCgoa2V5LCB2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2tleX0gOiAke3ZhbHVlfSBgKTsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcbiJdfQ==