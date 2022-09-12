
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/res/ResLoader.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '4b081G1b9pJvbDtVt9AUhXd', 'ResLoader');
// Script/res/ResLoader.ts

"use strict";
/**
 * ResLoader2，封装资源的加载和卸载接口，隐藏新老资源底层差异
 * 1. 加载资源接口
 * 2. 卸载资源接口
 *
 * 2021-1-24 by 宝爷
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ResManager_1 = require("./ResManager");
// 兼容性处理
var isChildClassOf = cc.js["isChildClassOf"];
if (!isChildClassOf) {
    isChildClassOf = cc["isChildClassOf"];
}
var ResLoader = /** @class */ (function () {
    function ResLoader() {
    }
    ResLoader.getLoader = function () {
        return cc.loader;
    };
    ResLoader.makeLoadArgs = function () {
        do {
            if (arguments.length < 2) {
                break;
            }
            var ret = {};
            if (typeof arguments[1] == "string" || arguments[1] instanceof Array) {
                if (typeof arguments[0] == "string") {
                    ret.bundle = arguments[0];
                    ret.url = arguments[1];
                    if (arguments.length > 2 && isChildClassOf(arguments[2], cc.RawAsset)) {
                        ret.type = arguments[2];
                    }
                }
                else {
                    break;
                }
            }
            else if (typeof arguments[0] == "string" || arguments[0] instanceof Array) {
                ret.url = arguments[0];
                if (isChildClassOf(arguments[1], cc.RawAsset)) {
                    ret.type = arguments[1];
                }
            }
            else {
                break;
            }
            if (typeof arguments[arguments.length - 1] == "function") {
                ret.onCompleted = arguments[arguments.length - 1];
                if (typeof arguments[arguments.length - 2] == "function"
                    && !isChildClassOf(arguments[arguments.length - 2], cc.RawAsset)) {
                    ret.onProgess = arguments[arguments.length - 2];
                }
            }
            return ret;
        } while (false);
        console.error("makeLoadArgs error " + arguments);
        return null;
    };
    ResLoader.makeReleaseArgs = function () {
        do {
            if (arguments.length < 1) {
                break;
            }
            var ret = {};
            if (isChildClassOf(arguments[arguments.length - 1], cc.RawAsset)) {
                ret.type = arguments[arguments.length - 1];
            }
            if (arguments.length > 1 && typeof arguments[0] == "string" &&
                (typeof arguments[1] == "string" || arguments[1] instanceof Array)) {
                ret.bundle = arguments[0];
                ret.url = arguments[1];
            }
            else {
                ret.url = arguments[0];
            }
            return ret;
        } while (false);
        console.error("makeLoadArgs error " + arguments);
        return null;
    };
    ResLoader.makeFinishCallback = function (resArgs) {
        console.time("load|" + resArgs.url);
        var finishCallback = function (error, resource) {
            if (!error) {
                if (resource instanceof Array) {
                    resource.forEach(function (element) {
                        ResManager_1.default.Instance.cacheAsset(element);
                    });
                }
                else {
                    ResManager_1.default.Instance.cacheAsset(resource);
                }
            }
            if (resArgs.onCompleted) {
                resArgs.onCompleted(error, resource);
            }
            console.timeEnd("load|" + resArgs.url);
        };
        return finishCallback;
    };
    ResLoader.getUuid = function (url, type) {
        var ccloader = ResLoader.getLoader();
        var uuid = ccloader._getResUuid(url, type, false);
        return uuid;
    };
    ResLoader.load = function () {
        var resArgs = ResLoader.makeLoadArgs.apply(ResLoader, arguments);
        var finishCallback = ResLoader.makeFinishCallback(resArgs);
        var ccloader = ResLoader.getLoader();
        if (typeof resArgs.url == "string") {
            if (typeof (ccloader['_getResUuid']) == "function") {
                var uuid = ccloader._getResUuid(resArgs.url, resArgs.type, false);
                if (uuid) {
                    ccloader.loadRes(resArgs.url, resArgs.type, resArgs.onProgess, finishCallback);
                }
                else {
                    ccloader.load(resArgs.url, resArgs.onProgess, finishCallback);
                }
            }
        }
        else {
            ccloader.loadResArray(resArgs.url, resArgs.type, resArgs.onProgess, finishCallback);
        }
    };
    ResLoader.loadDir = function () {
        var resArgs = ResLoader.makeLoadArgs.apply(ResLoader, arguments);
        var finishCallback = ResLoader.makeFinishCallback(resArgs);
        var ccloader = ResLoader.getLoader();
        ccloader.loadResDir(resArgs.url, resArgs.type, resArgs.onProgess, finishCallback);
    };
    ResLoader.release = function () {
        var resArgs = ResLoader.makeReleaseArgs.apply(ResLoader, arguments);
        if (resArgs.url instanceof Array) {
            resArgs.url.forEach(function (element) {
                if (resArgs.type) {
                    ResManager_1.default.Instance.releaseAsset(ResLoader.getUuid(element, resArgs.type));
                }
                else {
                    ResManager_1.default.Instance.releaseAsset(element);
                }
            });
        }
        else {
            if (resArgs.type && typeof resArgs.url == "string") {
                ResManager_1.default.Instance.releaseAsset(ResLoader.getUuid(resArgs.url, resArgs.type));
            }
            else {
                ResManager_1.default.Instance.releaseAsset(resArgs.url);
            }
        }
    };
    return ResLoader;
}());
exports.default = ResLoader;
exports.resLoader = ResLoader;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvcmVzL1Jlc0xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HOztBQUVILDJDQUFzQztBQXVCdEMsUUFBUTtBQUNSLElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUM1QyxJQUFJLENBQUMsY0FBYyxFQUFFO0lBQ2pCLGNBQWMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztDQUN6QztBQUVEO0lBQUE7SUFzTEEsQ0FBQztJQXBMaUIsbUJBQVMsR0FBdkI7UUFDSSxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVhLHNCQUFZLEdBQTFCO1FBQ0ksR0FBRztZQUNDLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3RCLE1BQU07YUFDVDtZQUNELElBQUksR0FBRyxHQUFhLEVBQUUsQ0FBQztZQUN2QixJQUFJLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFO2dCQUNsRSxJQUFJLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRTtvQkFDakMsR0FBRyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFCLEdBQUcsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QixJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUNuRSxHQUFHLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDM0I7aUJBQ0o7cUJBQU07b0JBQ0gsTUFBTTtpQkFDVDthQUNK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QUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDOUU7cUJBQU07b0JBQ0gsb0JBQVUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUM3QztZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ047YUFBTTtZQUNILElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLE9BQU8sQ0FBQyxHQUFHLElBQUksUUFBUSxFQUFFO2dCQUNoRCxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ2xGO2lCQUFNO2dCQUNILG9CQUFVLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakQ7U0FDSjtJQUNMLENBQUM7SUFDTCxnQkFBQztBQUFELENBdExBLEFBc0xDLElBQUE7O0FBRVUsUUFBQSxTQUFTLEdBQUcsU0FBUyxDQUFDIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFJlc0xvYWRlcjLvvIzlsIHoo4XotYTmupDnmoTliqDovb3lkozljbjovb3mjqXlj6PvvIzpmpDol4/mlrDogIHotYTmupDlupXlsYLlt67lvIJcclxuICogMS4g5Yqg6L296LWE5rqQ5o6l5Y+jXHJcbiAqIDIuIOWNuOi9vei1hOa6kOaOpeWPo1xyXG4gKiBcclxuICogMjAyMS0xLTI0IGJ5IOWuneeIt1xyXG4gKi9cclxuXHJcbmltcG9ydCBSZXNNYW5hZ2VyIGZyb20gXCIuL1Jlc01hbmFnZXJcIjtcclxuXHJcbi8vIOi1hOa6kOWKoOi9veeahOWkhOeQhuWbnuiwg1xyXG5leHBvcnQgdHlwZSBQcm9jZXNzQ2FsbGJhY2sgPSAoY29tcGxldGVkQ291bnQ6IG51bWJlciwgdG90YWxDb3VudDogbnVtYmVyLCBpdGVtOiBhbnkpID0+IHZvaWQ7XHJcbi8vIOi1hOa6kOWKoOi9veeahOWujOaIkOWbnuiwg1xyXG5leHBvcnQgdHlwZSBDb21wbGV0ZWRDYWxsYmFjayA9IChlcnJvcjogRXJyb3IsIHJlc291cmNlOiBhbnkgfCBhbnlbXSwgdXJscz86IHN0cmluZ1tdKSA9PiB2b2lkO1xyXG5cclxuLy8gbG9hZOaWueazleeahOWPguaVsOe7k+aehFxyXG5leHBvcnQgaW50ZXJmYWNlIExvYWRBcmdzIHtcclxuICAgIGJ1bmRsZT86IHN0cmluZztcclxuICAgIHVybD86IHN0cmluZyB8IHN0cmluZ1tdO1xyXG4gICAgdHlwZT86IHR5cGVvZiBjYy5Bc3NldDtcclxuICAgIG9uQ29tcGxldGVkPzogQ29tcGxldGVkQ2FsbGJhY2s7XHJcbiAgICBvblByb2dlc3M/OiBQcm9jZXNzQ2FsbGJhY2s7XHJcbn1cclxuXHJcbi8vIHJlbGVhc2Xmlrnms5XnmoTlj4LmlbDnu5PmnoRcclxuZXhwb3J0IGludGVyZmFjZSBSZWxlYXNlQXJncyB7XHJcbiAgICBidW5kbGU/OiBzdHJpbmc7XHJcbiAgICB1cmw/OiBzdHJpbmcgfCBzdHJpbmdbXSB8IGNjLkFzc2V0IHwgY2MuQXNzZXRbXSxcclxuICAgIHR5cGU/OiB0eXBlb2YgY2MuQXNzZXQsXHJcbn1cclxuXHJcbi8vIOWFvOWuueaAp+WkhOeQhlxyXG5sZXQgaXNDaGlsZENsYXNzT2YgPSBjYy5qc1tcImlzQ2hpbGRDbGFzc09mXCJdXHJcbmlmICghaXNDaGlsZENsYXNzT2YpIHtcclxuICAgIGlzQ2hpbGRDbGFzc09mID0gY2NbXCJpc0NoaWxkQ2xhc3NPZlwiXTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzTG9hZGVyIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldExvYWRlcigpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiBjYy5sb2FkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBtYWtlTG9hZEFyZ3MoKTogTG9hZEFyZ3Mge1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcmV0OiBMb2FkQXJncyA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1sxXSA9PSBcInN0cmluZ1wiIHx8IGFyZ3VtZW50c1sxXSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0LmJ1bmRsZSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgICAgICByZXQudXJsID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBpc0NoaWxkQ2xhc3NPZihhcmd1bWVudHNbMl0sIGNjLlJhd0Fzc2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQudHlwZSA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT0gXCJzdHJpbmdcIiB8fCBhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgcmV0LnVybCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIGlmIChpc0NoaWxkQ2xhc3NPZihhcmd1bWVudHNbMV0sIGNjLlJhd0Fzc2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldC50eXBlID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldC5vbkNvbXBsZXRlZCA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMl0gPT0gXCJmdW5jdGlvblwiIFxyXG4gICAgICAgICAgICAgICAgICAgICYmICFpc0NoaWxkQ2xhc3NPZihhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDJdLCBjYy5SYXdBc3NldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQub25Qcm9nZXNzID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAyXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9IHdoaWxlIChmYWxzZSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYG1ha2VMb2FkQXJncyBlcnJvciAke2FyZ3VtZW50c31gKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIG1ha2VSZWxlYXNlQXJncygpOiBSZWxlYXNlQXJncyB7XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcmV0OiBSZWxlYXNlQXJncyA9IHt9O1xyXG4gICAgICAgICAgICBpZiAoaXNDaGlsZENsYXNzT2YoYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSwgY2MuUmF3QXNzZXQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXQudHlwZSA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09IFwic3RyaW5nXCIgJiZcclxuICAgICAgICAgICAgICAgICh0eXBlb2YgYXJndW1lbnRzWzFdID09IFwic3RyaW5nXCIgfHwgYXJndW1lbnRzWzFdIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcbiAgICAgICAgICAgICAgICByZXQuYnVuZGxlID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgcmV0LnVybCA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldC51cmwgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9IHdoaWxlIChmYWxzZSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYG1ha2VMb2FkQXJncyBlcnJvciAke2FyZ3VtZW50c31gKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBtYWtlRmluaXNoQ2FsbGJhY2socmVzQXJnczogTG9hZEFyZ3MpOiBDb21wbGV0ZWRDYWxsYmFjayB7XHJcbiAgICAgICAgY29uc29sZS50aW1lKFwibG9hZHxcIiArIHJlc0FyZ3MudXJsKTtcclxuICAgICAgICBsZXQgZmluaXNoQ2FsbGJhY2sgPSAoZXJyb3I6IEVycm9yLCByZXNvdXJjZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2UuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVzTWFuYWdlci5JbnN0YW5jZS5jYWNoZUFzc2V0KGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBSZXNNYW5hZ2VyLkluc3RhbmNlLmNhY2hlQXNzZXQocmVzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXNBcmdzLm9uQ29tcGxldGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXNBcmdzLm9uQ29tcGxldGVkKGVycm9yLCByZXNvdXJjZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKFwibG9hZHxcIiArIHJlc0FyZ3MudXJsKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBmaW5pc2hDYWxsYmFjaztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRVdWlkKHVybDogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQpIHtcclxuICAgICAgICBsZXQgY2Nsb2FkZXIgPSBSZXNMb2FkZXIuZ2V0TG9hZGVyKCk7XHJcbiAgICAgICAgbGV0IHV1aWQgPSBjY2xvYWRlci5fZ2V0UmVzVXVpZCh1cmwsIHR5cGUsIGZhbHNlKTtcclxuICAgICAgICByZXR1cm4gdXVpZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW8gOWni+WKoOi9vei1hOa6kFxyXG4gICAgICogQHBhcmFtIGJ1bmRsZSAgICAgICAgYXNzZXRidW5kbGXnmoTot6/lvoRcclxuICAgICAqIEBwYXJhbSB1cmwgICAgICAgICAgIOi1hOa6kHVybOaIlnVybOaVsOe7hFxyXG4gICAgICogQHBhcmFtIHR5cGUgICAgICAgICAg6LWE5rqQ57G75Z6L77yM6buY6K6k5Li6bnVsbFxyXG4gICAgICogQHBhcmFtIG9uUHJvZ2VzcyAgICAg5Yqg6L296L+b5bqm5Zue6LCDXHJcbiAgICAgKiBAcGFyYW0gb25Db21wbGV0ZWQgICDliqDovb3lrozmiJDlm57osINcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKHVybDogc3RyaW5nLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKHVybDogc3RyaW5nLCBvblByb2dlc3M6IFByb2Nlc3NDYWxsYmFjaywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZCh1cmw6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKHVybDogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKHVybDogc3RyaW5nW10sIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQodXJsOiBzdHJpbmdbXSwgb25Qcm9nZXNzOiBQcm9jZXNzQ2FsbGJhY2ssIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQodXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKHVybDogc3RyaW5nW10sIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Qcm9nZXNzOiBQcm9jZXNzQ2FsbGJhY2ssIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQoYnVuZGxlOiBzdHJpbmcsIHVybDogc3RyaW5nLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZywgb25Qcm9nZXNzOiBQcm9jZXNzQ2FsbGJhY2ssIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQoYnVuZGxlOiBzdHJpbmcsIHVybDogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQoYnVuZGxlOiBzdHJpbmcsIHVybDogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZ1tdLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZ1tdLCBvblByb2dlc3M6IFByb2Nlc3NDYWxsYmFjaywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZChidW5kbGU6IHN0cmluZywgdXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZ1tdLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKCkge1xyXG4gICAgICAgIGxldCByZXNBcmdzOiBMb2FkQXJncyA9IFJlc0xvYWRlci5tYWtlTG9hZEFyZ3MuYXBwbHkoUmVzTG9hZGVyLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIGxldCBmaW5pc2hDYWxsYmFjayA9IFJlc0xvYWRlci5tYWtlRmluaXNoQ2FsbGJhY2socmVzQXJncyk7XHJcbiAgICAgICAgbGV0IGNjbG9hZGVyID0gUmVzTG9hZGVyLmdldExvYWRlcigpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgcmVzQXJncy51cmwgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIChjY2xvYWRlclsnX2dldFJlc1V1aWQnXSkgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdXVpZCA9IGNjbG9hZGVyLl9nZXRSZXNVdWlkKHJlc0FyZ3MudXJsLCByZXNBcmdzLnR5cGUsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGlmICh1dWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2Nsb2FkZXIubG9hZFJlcyhyZXNBcmdzLnVybCwgcmVzQXJncy50eXBlLCByZXNBcmdzLm9uUHJvZ2VzcywgZmluaXNoQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjY2xvYWRlci5sb2FkKHJlc0FyZ3MudXJsLCByZXNBcmdzLm9uUHJvZ2VzcywgZmluaXNoQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2Nsb2FkZXIubG9hZFJlc0FycmF5KHJlc0FyZ3MudXJsLCByZXNBcmdzLnR5cGUsIHJlc0FyZ3Mub25Qcm9nZXNzLCBmaW5pc2hDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZERpcih1cmw6IHN0cmluZywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZERpcih1cmw6IHN0cmluZywgb25Qcm9nZXNzOiBQcm9jZXNzQ2FsbGJhY2ssIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWREaXIodXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZERpcih1cmw6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvblByb2dlc3M6IFByb2Nlc3NDYWxsYmFjaywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZERpcihidW5kbGU6IHN0cmluZywgdXJsOiBzdHJpbmcsIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWREaXIoYnVuZGxlOiBzdHJpbmcsIHVybDogc3RyaW5nLCBvblByb2dlc3M6IFByb2Nlc3NDYWxsYmFjaywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZERpcihidW5kbGU6IHN0cmluZywgdXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZERpcihidW5kbGU6IHN0cmluZywgdXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Qcm9nZXNzOiBQcm9jZXNzQ2FsbGJhY2ssIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWREaXIoKSB7XHJcbiAgICAgICAgbGV0IHJlc0FyZ3M6IExvYWRBcmdzID0gUmVzTG9hZGVyLm1ha2VMb2FkQXJncy5hcHBseShSZXNMb2FkZXIsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgbGV0IGZpbmlzaENhbGxiYWNrID0gUmVzTG9hZGVyLm1ha2VGaW5pc2hDYWxsYmFjayhyZXNBcmdzKTtcclxuICAgICAgICBsZXQgY2Nsb2FkZXIgPSBSZXNMb2FkZXIuZ2V0TG9hZGVyKCk7XHJcbiAgICAgICAgY2Nsb2FkZXIubG9hZFJlc0RpcihyZXNBcmdzLnVybCwgcmVzQXJncy50eXBlLCByZXNBcmdzLm9uUHJvZ2VzcywgZmluaXNoQ2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVsZWFzZSh1cmw6IHN0cmluZylcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVsZWFzZSh1cmw6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0KVxyXG4gICAgcHVibGljIHN0YXRpYyByZWxlYXNlKHVybDogc3RyaW5nW10pXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlbGVhc2UodXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0KVxyXG4gICAgcHVibGljIHN0YXRpYyByZWxlYXNlKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZylcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVsZWFzZShidW5kbGU6IHN0cmluZywgdXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldClcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVsZWFzZShidW5kbGU6IHN0cmluZywgdXJsOiBzdHJpbmdbXSlcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVsZWFzZShidW5kbGU6IHN0cmluZywgdXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0KVxyXG4gICAgcHVibGljIHN0YXRpYyByZWxlYXNlKGFzc2V0OiBjYy5Bc3NldClcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVsZWFzZShhc3NldDogY2MuQXNzZXRbXSlcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVsZWFzZSgpIHtcclxuICAgICAgICBsZXQgcmVzQXJnczogUmVsZWFzZUFyZ3MgPSBSZXNMb2FkZXIubWFrZVJlbGVhc2VBcmdzLmFwcGx5KFJlc0xvYWRlciwgYXJndW1lbnRzKTtcclxuICAgICAgICBpZiAocmVzQXJncy51cmwgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICByZXNBcmdzLnVybC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc0FyZ3MudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIFJlc01hbmFnZXIuSW5zdGFuY2UucmVsZWFzZUFzc2V0KFJlc0xvYWRlci5nZXRVdWlkKGVsZW1lbnQsIHJlc0FyZ3MudHlwZSkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBSZXNNYW5hZ2VyLkluc3RhbmNlLnJlbGVhc2VBc3NldChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJlc0FyZ3MudHlwZSAmJiB0eXBlb2YgcmVzQXJncy51cmwgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgUmVzTWFuYWdlci5JbnN0YW5jZS5yZWxlYXNlQXNzZXQoUmVzTG9hZGVyLmdldFV1aWQocmVzQXJncy51cmwsIHJlc0FyZ3MudHlwZSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgUmVzTWFuYWdlci5JbnN0YW5jZS5yZWxlYXNlQXNzZXQocmVzQXJncy51cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgbGV0IHJlc0xvYWRlciA9IFJlc0xvYWRlcjsiXX0=