"use strict";
cc._RF.push(module, 'd9f8b+CV69FyKwnUdCjOtad', 'NetInterface');
// Script/network/NetInterface.ts

"use strict";
/*
*   网络相关接口定义
*
*   2019-10-8 by 宝爷
*/
Object.defineProperty(exports, "__esModule", { value: true });
// 默认字符串协议对象
var DefStringProtocol = /** @class */ (function () {
    function DefStringProtocol() {
    }
    DefStringProtocol.prototype.getHeadlen = function () {
        return 0;
    };
    DefStringProtocol.prototype.getHearbeat = function () {
        return "";
    };
    DefStringProtocol.prototype.getPackageLen = function (msg) {
        return msg.toString().length;
    };
    DefStringProtocol.prototype.checkPackage = function (msg) {
        return true;
    };
    DefStringProtocol.prototype.getPackageId = function (msg) {
        return 0;
    };
    return DefStringProtocol;
}());
exports.DefStringProtocol = DefStringProtocol;

cc._RF.pop();