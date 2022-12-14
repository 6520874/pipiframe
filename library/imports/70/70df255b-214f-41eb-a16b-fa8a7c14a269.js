"use strict";
cc._RF.push(module, '70df2VbIU9B66Fr+op8FKJp', 'WebSock');
// Script/network/WebSock.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
*   WebSocket封装
*   1. 连接/断开相关接口
*   2. 网络异常回调
*   3. 数据发送与接收
*
*   2018-5-14 by 宝爷
*/
var WebSock = /** @class */ (function () {
    function WebSock() {
        this._ws = null; // websocket对象
        this.onConnected = null;
        this.onMessage = null;
        this.onError = null;
        this.onClosed = null;
    }
    WebSock.prototype.connect = function (options) {
        var _this = this;
        if (this._ws) {
            if (this._ws.readyState === WebSocket.CONNECTING) {
                console.log("websocket connecting, wait for a moment...");
                return false;
            }
        }
        var url = null;
        if (options.url) {
            url = options.url;
        }
        else {
            var ip = options.ip;
            var port = options.port;
            var protocol = options.protocol;
            url = protocol + "://" + ip + ":" + port;
        }
        this._ws = new WebSocket(url);
        this._ws.binaryType = options.binaryType ? options.binaryType : "arraybuffer";
        this._ws.onmessage = function (event) {
            _this.onMessage(event.data);
        };
        this._ws.onopen = this.onConnected;
        this._ws.onerror = this.onError;
        this._ws.onclose = this.onClosed;
        return true;
    };
    WebSock.prototype.send = function (buffer) {
        if (this._ws.readyState == WebSocket.OPEN) {
            this._ws.send(buffer);
            return true;
        }
        return false;
    };
    WebSock.prototype.close = function (code, reason) {
        this._ws.close(code, reason);
    };
    return WebSock;
}());
exports.WebSock = WebSock;

cc._RF.pop();