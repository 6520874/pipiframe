"use strict";
cc._RF.push(module, 'd8cd5el6GBGTYTW+N8b8EuJ', 'NetManager');
// Script/network/NetManager.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
*   网络节点管理类
*
*   2019-10-8 by 宝爷
*/
var NetManager = /** @class */ (function () {
    function NetManager() {
        this._channels = {};
    }
    NetManager.getInstance = function () {
        if (this._instance == null) {
            this._instance = new NetManager();
        }
        return this._instance;
    };
    // 添加Node，返回ChannelID
    NetManager.prototype.setNetNode = function (newNode, channelId) {
        if (channelId === void 0) { channelId = 0; }
        this._channels[channelId] = newNode;
    };
    // 移除Node
    NetManager.prototype.removeNetNode = function (channelId) {
        delete this._channels[channelId];
    };
    // 调用Node连接
    NetManager.prototype.connect = function (options, channelId) {
        if (channelId === void 0) { channelId = 0; }
        if (this._channels[channelId]) {
            return this._channels[channelId].connect(options);
        }
        return false;
    };
    // 调用Node发送
    NetManager.prototype.send = function (buf, force, channelId) {
        if (force === void 0) { force = false; }
        if (channelId === void 0) { channelId = 0; }
        var node = this._channels[channelId];
        if (node) {
            return node.send(buf, force);
        }
        return false;
    };
    // 发起请求，并在在结果返回时调用指定好的回调函数
    NetManager.prototype.request = function (buf, rspCmd, rspObject, showTips, force, channelId) {
        if (showTips === void 0) { showTips = true; }
        if (force === void 0) { force = false; }
        if (channelId === void 0) { channelId = 0; }
        var node = this._channels[channelId];
        if (node) {
            node.request(buf, rspCmd, rspObject, showTips, force);
        }
    };
    // 同request，但在request之前会先判断队列中是否已有rspCmd，如有重复的则直接返回
    NetManager.prototype.requestUnique = function (buf, rspCmd, rspObject, showTips, force, channelId) {
        if (showTips === void 0) { showTips = true; }
        if (force === void 0) { force = false; }
        if (channelId === void 0) { channelId = 0; }
        var node = this._channels[channelId];
        if (node) {
            return node.requestUnique(buf, rspCmd, rspObject, showTips, force);
        }
        return false;
    };
    // 调用Node关闭
    NetManager.prototype.close = function (code, reason, channelId) {
        if (channelId === void 0) { channelId = 0; }
        if (this._channels[channelId]) {
            return this._channels[channelId].closeSocket(code, reason);
        }
    };
    NetManager._instance = null;
    return NetManager;
}());
exports.NetManager = NetManager;

cc._RF.pop();