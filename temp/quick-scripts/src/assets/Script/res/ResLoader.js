"use strict";
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