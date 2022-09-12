
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/network/NetNode.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '57f0fB90kNBUJ98yyu+jxjx', 'NetNode');
// Script/network/NetNode.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NetTipsType;
(function (NetTipsType) {
    NetTipsType[NetTipsType["Connecting"] = 0] = "Connecting";
    NetTipsType[NetTipsType["ReConnecting"] = 1] = "ReConnecting";
    NetTipsType[NetTipsType["Requesting"] = 2] = "Requesting";
})(NetTipsType = exports.NetTipsType || (exports.NetTipsType = {}));
var NetNodeState;
(function (NetNodeState) {
    NetNodeState[NetNodeState["Closed"] = 0] = "Closed";
    NetNodeState[NetNodeState["Connecting"] = 1] = "Connecting";
    NetNodeState[NetNodeState["Checking"] = 2] = "Checking";
    NetNodeState[NetNodeState["Working"] = 3] = "Working";
})(NetNodeState = exports.NetNodeState || (exports.NetNodeState = {}));
var NetNode = /** @class */ (function () {
    function NetNode() {
        this._connectOptions = null;
        this._autoReconnect = 0;
        this._isSocketInit = false; // Socket是否初始化过
        this._isSocketOpen = false; // Socket是否连接成功过
        this._state = NetNodeState.Closed; // 节点当前状态
        this._socket = null; // Socket对象（可能是原生socket、websocket、wx.socket...)
        this._networkTips = null; // 网络提示ui对象（请求提示、断线重连提示等）
        this._protocolHelper = null; // 包解析对象
        this._connectedCallback = null; // 连接完成回调
        this._disconnectCallback = null; // 断线回调
        this._callbackExecuter = null; // 回调执行
        this._keepAliveTimer = null; // 心跳定时器
        this._receiveMsgTimer = null; // 接收数据定时器
        this._reconnectTimer = null; // 重连定时器
        this._heartTime = 10000; // 心跳间隔
        this._receiveTime = 6000000; // 多久没收到数据断开
        this._reconnetTimeOut = 8000000; // 重连间隔
        this._requests = Array(); // 请求列表
        this._listener = {}; // 监听者列表
    }
    /********************** 网络相关处理 *********************/
    NetNode.prototype.init = function (socket, protocol, networkTips, execFunc) {
        if (networkTips === void 0) { networkTips = null; }
        if (execFunc === void 0) { execFunc = null; }
        console.log("NetNode init socket");
        this._socket = socket;
        this._protocolHelper = protocol;
        this._networkTips = networkTips;
        this._callbackExecuter = execFunc ? execFunc : function (callback, buffer) {
            callback.callback.call(callback.target, 0, buffer);
        };
    };
    NetNode.prototype.connect = function (options) {
        if (this._socket && this._state == NetNodeState.Closed) {
            if (!this._isSocketInit) {
                this.initSocket();
            }
            this._state = NetNodeState.Connecting;
            if (!this._socket.connect(options)) {
                this.updateNetTips(NetTipsType.Connecting, false);
                return false;
            }
            if (this._connectOptions == null) {
                this._autoReconnect = options.autoReconnect;
            }
            this._connectOptions = options;
            this.updateNetTips(NetTipsType.Connecting, true);
            return true;
        }
        return false;
    };
    NetNode.prototype.initSocket = function () {
        var _this = this;
        this._socket.onConnected = function (event) { _this.onConnected(event); };
        this._socket.onMessage = function (msg) { _this.onMessage(msg); };
        this._socket.onError = function (event) { _this.onError(event); };
        this._socket.onClosed = function (event) { _this.onClosed(event); };
        this._isSocketInit = true;
    };
    NetNode.prototype.updateNetTips = function (tipsType, isShow) {
        if (this._networkTips) {
            if (tipsType == NetTipsType.Requesting) {
                this._networkTips.requestTips(isShow);
            }
            else if (tipsType == NetTipsType.Connecting) {
                this._networkTips.connectTips(isShow);
            }
            else if (tipsType == NetTipsType.ReConnecting) {
                this._networkTips.reconnectTips(isShow);
            }
        }
    };
    // 网络连接成功
    NetNode.prototype.onConnected = function (event) {
        var _this = this;
        console.log("NetNode onConnected!");
        this._isSocketOpen = true;
        // 如果设置了鉴权回调，在连接完成后进入鉴权阶段，等待鉴权结束
        if (this._connectedCallback !== null) {
            this._state = NetNodeState.Checking;
            this._connectedCallback(function () { _this.onChecked(); });
        }
        else {
            this.onChecked();
        }
        console.log("NetNode onConnected! state =" + this._state);
    };
    // 连接验证成功，进入工作状态
    NetNode.prototype.onChecked = function () {
        console.log("NetNode onChecked!");
        this._state = NetNodeState.Working;
        // 关闭连接或重连中的状态显示
        this.updateNetTips(NetTipsType.Connecting, false);
        this.updateNetTips(NetTipsType.ReConnecting, false);
        // 重发待发送信息
        console.log("NetNode flush " + this._requests.length + " request");
        if (this._requests.length > 0) {
            for (var i = 0; i < this._requests.length;) {
                var req = this._requests[i];
                this._socket.send(req.buffer);
                if (req.rspObject == null || req.rspCmd <= 0) {
                    this._requests.splice(i, 1);
                }
                else {
                    ++i;
                }
            }
            // 如果还有等待返回的请求，启动网络请求层
            this.updateNetTips(NetTipsType.Requesting, this.request.length > 0);
        }
    };
    // 接收到一个完整的消息包
    NetNode.prototype.onMessage = function (msg) {
        // console.log(`NetNode onMessage status = ` + this._state);
        // 进行头部的校验（实际包长与头部长度是否匹配）
        if (!this._protocolHelper.checkPackage(msg)) {
            console.error("NetNode checkHead Error");
            return;
        }
        // 接受到数据，重新定时收数据计时器
        this.resetReceiveMsgTimer();
        // 重置心跳包发送器
        this.resetHearbeatTimer();
        // 触发消息执行
        var rspCmd = this._protocolHelper.getPackageId(msg);
        console.log("NetNode onMessage rspCmd = " + rspCmd);
        // 优先触发request队列
        if (this._requests.length > 0) {
            for (var reqIdx in this._requests) {
                var req = this._requests[reqIdx];
                if (req.rspCmd == rspCmd) {
                    console.log("NetNode execute request rspcmd " + rspCmd);
                    this._callbackExecuter(req.rspObject, msg);
                    this._requests.splice(parseInt(reqIdx), 1);
                    break;
                }
            }
            console.log("NetNode still has " + this._requests.length + " request watting");
            if (this._requests.length == 0) {
                this.updateNetTips(NetTipsType.Requesting, false);
            }
        }
        var listeners = this._listener[rspCmd];
        if (null != listeners) {
            for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
                var rsp = listeners_1[_i];
                console.log("NetNode execute listener cmd " + rspCmd);
                this._callbackExecuter(rsp, msg);
            }
        }
    };
    NetNode.prototype.onError = function (event) {
        console.error(event);
    };
    NetNode.prototype.onClosed = function (event) {
        var _this = this;
        this.clearTimer();
        // 执行断线回调，返回false表示不进行重连
        if (this._disconnectCallback && !this._disconnectCallback()) {
            console.log("disconnect return!");
            return;
        }
        // 自动重连
        if (this.isAutoReconnect()) {
            this.updateNetTips(NetTipsType.ReConnecting, true);
            this._reconnectTimer = setTimeout(function () {
                _this._socket.close();
                _this._state = NetNodeState.Closed;
                _this.connect(_this._connectOptions);
                if (_this._autoReconnect > 0) {
                    _this._autoReconnect -= 1;
                }
            }, this._reconnetTimeOut);
        }
        else {
            this._state = NetNodeState.Closed;
        }
    };
    NetNode.prototype.close = function (code, reason) {
        this.clearTimer();
        this._listener = {};
        this._requests.length = 0;
        if (this._networkTips) {
            this._networkTips.connectTips(false);
            this._networkTips.reconnectTips(false);
            this._networkTips.requestTips(false);
        }
        if (this._socket) {
            this._socket.close(code, reason);
        }
        else {
            this._state = NetNodeState.Closed;
        }
    };
    // 只是关闭Socket套接字（仍然重用缓存与当前状态）
    NetNode.prototype.closeSocket = function (code, reason) {
        if (this._socket) {
            this._socket.close(code, reason);
        }
    };
    // 发起请求，如果当前处于重连中，进入缓存列表等待重连完成后发送
    NetNode.prototype.send = function (buf, force) {
        if (force === void 0) { force = false; }
        if (this._state == NetNodeState.Working || force) {
            console.log("socket send ...");
            return this._socket.send(buf);
        }
        else if (this._state == NetNodeState.Checking ||
            this._state == NetNodeState.Connecting) {
            this._requests.push({
                buffer: buf,
                rspCmd: 0,
                rspObject: null
            });
            console.log("NetNode socket is busy, push to send buffer, current state is " + this._state);
            return true;
        }
        else {
            console.error("NetNode request error! current state is " + this._state);
            return false;
        }
    };
    // 发起请求，并进入缓存列表
    NetNode.prototype.request = function (buf, rspCmd, rspObject, showTips, force) {
        if (showTips === void 0) { showTips = true; }
        if (force === void 0) { force = false; }
        if (this._state == NetNodeState.Working || force) {
            this._socket.send(buf);
        }
        console.log("NetNode request with timeout for " + rspCmd);
        // 进入发送缓存列表
        this._requests.push({
            buffer: buf, rspCmd: rspCmd, rspObject: rspObject
        });
        // 启动网络请求层
        if (showTips) {
            this.updateNetTips(NetTipsType.Requesting, true);
        }
    };
    // 唯一request，确保没有同一响应的请求（避免一个请求重复发送，netTips界面的屏蔽也是一个好的方法）
    NetNode.prototype.requestUnique = function (buf, rspCmd, rspObject, showTips, force) {
        if (showTips === void 0) { showTips = true; }
        if (force === void 0) { force = false; }
        for (var i = 0; i < this._requests.length; ++i) {
            if (this._requests[i].rspCmd == rspCmd) {
                console.log("NetNode requestUnique faile for " + rspCmd);
                return false;
            }
        }
        this.request(buf, rspCmd, rspObject, showTips, force);
        return true;
    };
    /********************** 回调相关处理 *********************/
    NetNode.prototype.setResponeHandler = function (cmd, callback, target) {
        if (callback == null) {
            console.error("NetNode setResponeHandler error " + cmd);
            return false;
        }
        this._listener[cmd] = [{ target: target, callback: callback }];
        return true;
    };
    NetNode.prototype.addResponeHandler = function (cmd, callback, target) {
        if (callback == null) {
            console.error("NetNode addResponeHandler error " + cmd);
            return false;
        }
        var rspObject = { target: target, callback: callback };
        if (null == this._listener[cmd]) {
            this._listener[cmd] = [rspObject];
        }
        else {
            var index = this.getNetListenersIndex(cmd, rspObject);
            if (-1 == index) {
                this._listener[cmd].push(rspObject);
            }
        }
        return true;
    };
    NetNode.prototype.removeResponeHandler = function (cmd, callback, target) {
        if (null != this._listener[cmd] && callback != null) {
            var index = this.getNetListenersIndex(cmd, { target: target, callback: callback });
            if (-1 != index) {
                this._listener[cmd].splice(index, 1);
            }
        }
    };
    NetNode.prototype.cleanListeners = function (cmd) {
        if (cmd === void 0) { cmd = -1; }
        if (cmd == -1) {
            this._listener = {};
        }
        else {
            this._listener[cmd] = null;
        }
    };
    NetNode.prototype.getNetListenersIndex = function (cmd, rspObject) {
        var index = -1;
        for (var i = 0; i < this._listener[cmd].length; i++) {
            var iterator = this._listener[cmd][i];
            if (iterator.callback == rspObject.callback
                && iterator.target == rspObject.target) {
                index = i;
                break;
            }
        }
        return index;
    };
    /********************** 心跳、超时相关处理 *********************/
    NetNode.prototype.resetReceiveMsgTimer = function () {
        var _this = this;
        if (this._receiveMsgTimer !== null) {
            clearTimeout(this._receiveMsgTimer);
        }
        this._receiveMsgTimer = setTimeout(function () {
            console.warn("NetNode recvieMsgTimer close socket!");
            _this._socket.close();
        }, this._receiveTime);
    };
    NetNode.prototype.resetHearbeatTimer = function () {
        var _this = this;
        if (this._keepAliveTimer !== null) {
            clearTimeout(this._keepAliveTimer);
        }
        this._keepAliveTimer = setTimeout(function () {
            console.log("NetNode keepAliveTimer send Hearbeat");
            _this.send(_this._protocolHelper.getHearbeat());
        }, this._heartTime);
    };
    NetNode.prototype.clearTimer = function () {
        if (this._receiveMsgTimer !== null) {
            clearTimeout(this._receiveMsgTimer);
        }
        if (this._keepAliveTimer !== null) {
            clearTimeout(this._keepAliveTimer);
        }
        if (this._reconnectTimer !== null) {
            clearTimeout(this._reconnectTimer);
        }
    };
    NetNode.prototype.isAutoReconnect = function () {
        return this._autoReconnect != 0;
    };
    NetNode.prototype.rejectReconnect = function () {
        this._autoReconnect = 0;
        this.clearTimer();
    };
    return NetNode;
}());
exports.NetNode = NetNode;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvbmV0d29yay9OZXROb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLElBQVksV0FJWDtBQUpELFdBQVksV0FBVztJQUNuQix5REFBVSxDQUFBO0lBQ1YsNkRBQVksQ0FBQTtJQUNaLHlEQUFVLENBQUE7QUFDZCxDQUFDLEVBSlcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFJdEI7QUFFRCxJQUFZLFlBS1g7QUFMRCxXQUFZLFlBQVk7SUFDcEIsbURBQU0sQ0FBQTtJQUNOLDJEQUFVLENBQUE7SUFDVix1REFBUSxDQUFBO0lBQ1IscURBQU8sQ0FBQTtBQUNYLENBQUMsRUFMVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUt2QjtBQVNEO0lBQUE7UUFDYyxvQkFBZSxHQUFzQixJQUFJLENBQUM7UUFDMUMsbUJBQWMsR0FBVyxDQUFDLENBQUM7UUFDM0Isa0JBQWEsR0FBWSxLQUFLLENBQUMsQ0FBK0IsZUFBZTtRQUM3RSxrQkFBYSxHQUFZLEtBQUssQ0FBQyxDQUErQixnQkFBZ0I7UUFDOUUsV0FBTSxHQUFpQixZQUFZLENBQUMsTUFBTSxDQUFDLENBQW1CLFNBQVM7UUFDdkUsWUFBTyxHQUFZLElBQUksQ0FBQyxDQUFzQywrQ0FBK0M7UUFFN0csaUJBQVksR0FBaUIsSUFBSSxDQUFDLENBQTRCLHlCQUF5QjtRQUN2RixvQkFBZSxHQUFvQixJQUFJLENBQUMsQ0FBc0IsUUFBUTtRQUN0RSx1QkFBa0IsR0FBYyxJQUFJLENBQUMsQ0FBeUIsU0FBUztRQUN2RSx3QkFBbUIsR0FBYSxJQUFJLENBQUMsQ0FBeUIsT0FBTztRQUNyRSxzQkFBaUIsR0FBaUIsSUFBSSxDQUFDLENBQXVCLE9BQU87UUFFckUsb0JBQWUsR0FBUSxJQUFJLENBQUMsQ0FBa0MsUUFBUTtRQUN0RSxxQkFBZ0IsR0FBUSxJQUFJLENBQUMsQ0FBaUMsVUFBVTtRQUN4RSxvQkFBZSxHQUFRLElBQUksQ0FB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OiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVNvY2tldCwgSU5ldHdvcmtUaXBzLCBJUHJvdG9jb2xIZWxwZXIsIFJlcXVlc3RPYmplY3QsIENhbGxiYWNrT2JqZWN0LCBOZXREYXRhLCBOZXRDYWxsRnVuYyB9IGZyb20gXCIuL05ldEludGVyZmFjZVwiO1xuXG4vKlxuKiAgIENvY29zQ3JlYXRvcue9kee7nOiKgueCueWfuuexu++8jOS7peWPiue9kee7nOebuOWFs+aOpeWPo+WumuS5iVxuKiAgIDEuIOe9kee7nOi/nuaOpeOAgeaWreW8gOOAgeivt+axguWPkemAgeOAgeaVsOaNruaOpeaUtuetieWfuuehgOWKn+iDvVxuKiAgIDIuIOW/g+i3s+acuuWItlxuKiAgIDMuIOaWree6v+mHjei/niArIOivt+axgumHjeWPkVxuKiAgIDQuIOiwg+eUqOe9kee7nOWxj+iUveWxglxuKlxuKiAgIDIwMTgtNS03IGJ5IOWuneeIt1xuKi9cblxudHlwZSBFeGVjdXRlckZ1bmMgPSAoY2FsbGJhY2s6IENhbGxiYWNrT2JqZWN0LCBidWZmZXI6IE5ldERhdGEpID0+IHZvaWQ7XG50eXBlIENoZWNrRnVuYyA9IChjaGVja2VkRnVuYyA6IFZvaWRGdW5jICkgPT4gdm9pZDtcbnR5cGUgVm9pZEZ1bmMgPSAoKSA9PiB2b2lkO1xudHlwZSBCb29sRnVuYyA9ICgpID0+IGJvb2xlYW47XG5cbmV4cG9ydCBlbnVtIE5ldFRpcHNUeXBlIHtcbiAgICBDb25uZWN0aW5nLFxuICAgIFJlQ29ubmVjdGluZyxcbiAgICBSZXF1ZXN0aW5nLFxufVxuXG5leHBvcnQgZW51bSBOZXROb2RlU3RhdGUge1xuICAgIENsb3NlZCwgICAgICAgICAgICAgICAgICAgICAvLyDlt7LlhbPpl61cbiAgICBDb25uZWN0aW5nLCAgICAgICAgICAgICAgICAgLy8g6L+e5o6l5LitXG4gICAgQ2hlY2tpbmcsICAgICAgICAgICAgICAgICAgIC8vIOmqjOivgeS4rVxuICAgIFdvcmtpbmcsICAgICAgICAgICAgICAgICAgICAvLyDlj6/kvKDovpPmlbDmja5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBOZXRDb25uZWN0T3B0aW9ucyB7XG4gICAgaG9zdD86IHN0cmluZywgICAgICAgICAgICAgIC8vIOWcsOWdgFxuICAgIHBvcnQ/OiBudW1iZXIsICAgICAgICAgICAgICAvLyDnq6/lj6NcbiAgICB1cmw/OiBzdHJpbmcsICAgICAgICAgICAgICAgLy8gdXJs77yM5LiO5Zyw5Z2AK+err+WPo+S6jOmAieS4gFxuICAgIGF1dG9SZWNvbm5lY3Q/OiBudW1iZXIsICAgICAvLyAtMSDmsLjkuYXph43ov57vvIww5LiN6Ieq5Yqo6YeN6L+e77yM5YW25LuW5q2j5pW05pWw5Li66Ieq5Yqo6YeN6K+V5qyh5pWwXG59XG5cbmV4cG9ydCBjbGFzcyBOZXROb2RlIHtcbiAgICBwcm90ZWN0ZWQgX2Nvbm5lY3RPcHRpb25zOiBOZXRDb25uZWN0T3B0aW9ucyA9IG51bGw7XG4gICAgcHJvdGVjdGVkIF9hdXRvUmVjb25uZWN0OiBudW1iZXIgPSAwO1xuICAgIHByb3RlY3RlZCBfaXNTb2NrZXRJbml0OiBib29sZWFuID0gZmFsc2U7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvY2tldOaYr+WQpuWIneWni+WMlui/h1xuICAgIHByb3RlY3RlZCBfaXNTb2NrZXRPcGVuOiBib29sZWFuID0gZmFsc2U7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvY2tldOaYr+WQpui/nuaOpeaIkOWKn+i/h1xuICAgIHByb3RlY3RlZCBfc3RhdGU6IE5ldE5vZGVTdGF0ZSA9IE5ldE5vZGVTdGF0ZS5DbG9zZWQ7ICAgICAgICAgICAgICAgICAgIC8vIOiKgueCueW9k+WJjeeKtuaAgVxuICAgIHByb3RlY3RlZCBfc29ja2V0OiBJU29ja2V0ID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvY2tldOWvueixoe+8iOWPr+iDveaYr+WOn+eUn3NvY2tldOOAgXdlYnNvY2tldOOAgXd4LnNvY2tldC4uLilcblxuICAgIHByb3RlY3RlZCBfbmV0d29ya1RpcHM6IElOZXR3b3JrVGlwcyA9IG51bGw7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOe9kee7nOaPkOekunVp5a+56LGh77yI6K+35rGC5o+Q56S644CB5pat57q/6YeN6L+e5o+Q56S6562J77yJXG4gICAgcHJvdGVjdGVkIF9wcm90b2NvbEhlbHBlcjogSVByb3RvY29sSGVscGVyID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgLy8g5YyF6Kej5p6Q5a+56LGhXG4gICAgcHJvdGVjdGVkIF9jb25uZWN0ZWRDYWxsYmFjazogQ2hlY2tGdW5jID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6L+e5o6l5a6M5oiQ5Zue6LCDXG4gICAgcHJvdGVjdGVkIF9kaXNjb25uZWN0Q2FsbGJhY2s6IEJvb2xGdW5jID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pat57q/5Zue6LCDXG4gICAgcHJvdGVjdGVkIF9jYWxsYmFja0V4ZWN1dGVyOiBFeGVjdXRlckZ1bmMgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgLy8g5Zue6LCD5omn6KGMXG5cbiAgICBwcm90ZWN0ZWQgX2tlZXBBbGl2ZVRpbWVyOiBhbnkgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlv4Pot7Plrprml7blmahcbiAgICBwcm90ZWN0ZWQgX3JlY2VpdmVNc2dUaW1lcjogYW55ID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmjqXmlLbmlbDmja7lrprml7blmahcbiAgICBwcm90ZWN0ZWQgX3JlY29ubmVjdFRpbWVyOiBhbnkgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDph43ov57lrprml7blmahcbiAgICBwcm90ZWN0ZWQgX2hlYXJ0VGltZTogbnVtYmVyID0gMTAwMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlv4Pot7Ppl7TpmpRcbiAgICBwcm90ZWN0ZWQgX3JlY2VpdmVUaW1lOiBudW1iZXIgPSA2MDAwMDAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpJrkuYXmsqHmlLbliLDmlbDmja7mlq3lvIBcbiAgICBwcm90ZWN0ZWQgX3JlY29ubmV0VGltZU91dDogbnVtYmVyID0gODAwMDAwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDph43ov57pl7TpmpRcbiAgICBwcm90ZWN0ZWQgX3JlcXVlc3RzOiBSZXF1ZXN0T2JqZWN0W10gPSBBcnJheTxSZXF1ZXN0T2JqZWN0PigpOyAgICAgICAgICAvLyDor7fmsYLliJfooahcbiAgICBwcm90ZWN0ZWQgX2xpc3RlbmVyOiB7IFtrZXk6IG51bWJlcl06IENhbGxiYWNrT2JqZWN0W10gfSA9IHt9ICAgICAgICAgICAvLyDnm5HlkKzogIXliJfooahcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqIOe9kee7nOebuOWFs+WkhOeQhiAqKioqKioqKioqKioqKioqKioqKiovXG4gICAgcHVibGljIGluaXQoc29ja2V0OiBJU29ja2V0LCBwcm90b2NvbDogSVByb3RvY29sSGVscGVyLCBuZXR3b3JrVGlwczogYW55ID0gbnVsbCwgZXhlY0Z1bmMgOiBFeGVjdXRlckZ1bmMgPSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBOZXROb2RlIGluaXQgc29ja2V0YCk7XG4gICAgICAgIHRoaXMuX3NvY2tldCA9IHNvY2tldDtcbiAgICAgICAgdGhpcy5fcHJvdG9jb2xIZWxwZXIgPSBwcm90b2NvbDtcbiAgICAgICAgdGhpcy5fbmV0d29ya1RpcHMgPSBuZXR3b3JrVGlwcztcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tFeGVjdXRlciA9IGV4ZWNGdW5jID8gZXhlY0Z1bmMgOiAoY2FsbGJhY2s6IENhbGxiYWNrT2JqZWN0LCBidWZmZXI6IE5ldERhdGEpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGxiYWNrLmNhbGwoY2FsbGJhY2sudGFyZ2V0LCAwLCBidWZmZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNvbm5lY3Qob3B0aW9uczogTmV0Q29ubmVjdE9wdGlvbnMpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuX3NvY2tldCAmJiB0aGlzLl9zdGF0ZSA9PSBOZXROb2RlU3RhdGUuQ2xvc2VkKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2lzU29ja2V0SW5pdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFNvY2tldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBOZXROb2RlU3RhdGUuQ29ubmVjdGluZztcbiAgICAgICAgICAgIGlmICghdGhpcy5fc29ja2V0LmNvbm5lY3Qob3B0aW9ucykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU5ldFRpcHMoTmV0VGlwc1R5cGUuQ29ubmVjdGluZywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3RPcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvUmVjb25uZWN0ID0gb3B0aW9ucy5hdXRvUmVjb25uZWN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdE9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVOZXRUaXBzKE5ldFRpcHNUeXBlLkNvbm5lY3RpbmcsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0U29ja2V0KCkge1xuICAgICAgICB0aGlzLl9zb2NrZXQub25Db25uZWN0ZWQgPSAoZXZlbnQpID0+IHsgdGhpcy5vbkNvbm5lY3RlZChldmVudCkgfTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uTWVzc2FnZSA9IChtc2cpID0+IHsgdGhpcy5vbk1lc3NhZ2UobXNnKSB9O1xuICAgICAgICB0aGlzLl9zb2NrZXQub25FcnJvciA9IChldmVudCkgPT4geyB0aGlzLm9uRXJyb3IoZXZlbnQpIH07XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbkNsb3NlZCA9IChldmVudCkgPT4geyB0aGlzLm9uQ2xvc2VkKGV2ZW50KSB9O1xuICAgICAgICB0aGlzLl9pc1NvY2tldEluaXQgPSB0cnVlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB1cGRhdGVOZXRUaXBzKHRpcHNUeXBlOiBOZXRUaXBzVHlwZSwgaXNTaG93OiBib29sZWFuKSB7XG4gICAgICAgIGlmICh0aGlzLl9uZXR3b3JrVGlwcykge1xuICAgICAgICAgICAgaWYgKHRpcHNUeXBlID09IE5ldFRpcHNUeXBlLlJlcXVlc3RpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXR3b3JrVGlwcy5yZXF1ZXN0VGlwcyhpc1Nob3cpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aXBzVHlwZSA9PSBOZXRUaXBzVHlwZS5Db25uZWN0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbmV0d29ya1RpcHMuY29ubmVjdFRpcHMoaXNTaG93KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGlwc1R5cGUgPT0gTmV0VGlwc1R5cGUuUmVDb25uZWN0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbmV0d29ya1RpcHMucmVjb25uZWN0VGlwcyhpc1Nob3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g572R57uc6L+e5o6l5oiQ5YqfXG4gICAgcHJvdGVjdGVkIG9uQ29ubmVjdGVkKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmV0Tm9kZSBvbkNvbm5lY3RlZCFcIilcbiAgICAgICAgdGhpcy5faXNTb2NrZXRPcGVuID0gdHJ1ZTtcbiAgICAgICAgLy8g5aaC5p6c6K6+572u5LqG6Ym05p2D5Zue6LCD77yM5Zyo6L+e5o6l5a6M5oiQ5ZCO6L+b5YWl6Ym05p2D6Zi25q6177yM562J5b6F6Ym05p2D57uT5p2fXG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0ZWRDYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBOZXROb2RlU3RhdGUuQ2hlY2tpbmc7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0ZWRDYWxsYmFjaygoKSA9PiB7IHRoaXMub25DaGVja2VkKCkgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hlY2tlZCgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmV0Tm9kZSBvbkNvbm5lY3RlZCEgc3RhdGUgPVwiICsgdGhpcy5fc3RhdGUpO1xuICAgIH1cblxuICAgIC8vIOi/nuaOpemqjOivgeaIkOWKn++8jOi/m+WFpeW3peS9nOeKtuaAgVxuICAgIHByb3RlY3RlZCBvbkNoZWNrZWQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmV0Tm9kZSBvbkNoZWNrZWQhXCIpXG4gICAgICAgIHRoaXMuX3N0YXRlID0gTmV0Tm9kZVN0YXRlLldvcmtpbmc7XG4gICAgICAgIC8vIOWFs+mXrei/nuaOpeaIlumHjei/nuS4reeahOeKtuaAgeaYvuekulxuICAgICAgICB0aGlzLnVwZGF0ZU5ldFRpcHMoTmV0VGlwc1R5cGUuQ29ubmVjdGluZywgZmFsc2UpO1xuICAgICAgICB0aGlzLnVwZGF0ZU5ldFRpcHMoTmV0VGlwc1R5cGUuUmVDb25uZWN0aW5nLCBmYWxzZSk7XG5cbiAgICAgICAgLy8g6YeN5Y+R5b6F5Y+R6YCB5L+h5oGvXG4gICAgICAgIGNvbnNvbGUubG9nKGBOZXROb2RlIGZsdXNoICR7dGhpcy5fcmVxdWVzdHMubGVuZ3RofSByZXF1ZXN0YClcbiAgICAgICAgaWYgKHRoaXMuX3JlcXVlc3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fcmVxdWVzdHMubGVuZ3RoOykge1xuICAgICAgICAgICAgICAgIGxldCByZXEgPSB0aGlzLl9yZXF1ZXN0c1tpXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zb2NrZXQuc2VuZChyZXEuYnVmZmVyKTtcbiAgICAgICAgICAgICAgICBpZiAocmVxLnJzcE9iamVjdCA9PSBudWxsIHx8IHJlcS5yc3BDbWQgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXF1ZXN0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgKytpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIOWmguaenOi/mOacieetieW+hei/lOWbnueahOivt+axgu+8jOWQr+WKqOe9kee7nOivt+axguWxglxuICAgICAgICAgICAgdGhpcy51cGRhdGVOZXRUaXBzKE5ldFRpcHNUeXBlLlJlcXVlc3RpbmcsIHRoaXMucmVxdWVzdC5sZW5ndGggPiAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOaOpeaUtuWIsOS4gOS4quWujOaVtOeahOa2iOaBr+WMhVxuICAgIHByb3RlY3RlZCBvbk1lc3NhZ2UobXNnKTogdm9pZCB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBOZXROb2RlIG9uTWVzc2FnZSBzdGF0dXMgPSBgICsgdGhpcy5fc3RhdGUpO1xuICAgICAgICAvLyDov5vooYzlpLTpg6jnmoTmoKHpqozvvIjlrp7pmYXljIXplb/kuI7lpLTpg6jplb/luqbmmK/lkKbljLnphY3vvIlcbiAgICAgICAgaWYgKCF0aGlzLl9wcm90b2NvbEhlbHBlci5jaGVja1BhY2thZ2UobXNnKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgTmV0Tm9kZSBjaGVja0hlYWQgRXJyb3JgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyDmjqXlj5fliLDmlbDmja7vvIzph43mlrDlrprml7bmlLbmlbDmja7orqHml7blmahcbiAgICAgICAgdGhpcy5yZXNldFJlY2VpdmVNc2dUaW1lcigpO1xuICAgICAgICAvLyDph43nva7lv4Pot7PljIXlj5HpgIHlmahcbiAgICAgICAgdGhpcy5yZXNldEhlYXJiZWF0VGltZXIoKTtcbiAgICAgICAgLy8g6Kem5Y+R5raI5oGv5omn6KGMXG4gICAgICAgIGxldCByc3BDbWQgPSB0aGlzLl9wcm90b2NvbEhlbHBlci5nZXRQYWNrYWdlSWQobXNnKTtcbiAgICAgICAgY29uc29sZS5sb2coYE5ldE5vZGUgb25NZXNzYWdlIHJzcENtZCA9IGAgKyByc3BDbWQpO1xuICAgICAgICAvLyDkvJjlhYjop6blj5FyZXF1ZXN06Zif5YiXXG4gICAgICAgIGlmICh0aGlzLl9yZXF1ZXN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCByZXFJZHggaW4gdGhpcy5fcmVxdWVzdHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVxID0gdGhpcy5fcmVxdWVzdHNbcmVxSWR4XTtcbiAgICAgICAgICAgICAgICBpZiAocmVxLnJzcENtZCA9PSByc3BDbWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE5ldE5vZGUgZXhlY3V0ZSByZXF1ZXN0IHJzcGNtZCAke3JzcENtZH1gKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tFeGVjdXRlcihyZXEucnNwT2JqZWN0LCBtc2cpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXF1ZXN0cy5zcGxpY2UocGFyc2VJbnQocmVxSWR4KSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBOZXROb2RlIHN0aWxsIGhhcyAke3RoaXMuX3JlcXVlc3RzLmxlbmd0aH0gcmVxdWVzdCB3YXR0aW5nYCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVxdWVzdHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU5ldFRpcHMoTmV0VGlwc1R5cGUuUmVxdWVzdGluZywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyW3JzcENtZF07XG4gICAgICAgIGlmIChudWxsICE9IGxpc3RlbmVycykge1xuICAgICAgICAgICAgZm9yIChjb25zdCByc3Agb2YgbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE5ldE5vZGUgZXhlY3V0ZSBsaXN0ZW5lciBjbWQgJHtyc3BDbWR9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tFeGVjdXRlcihyc3AsIG1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25FcnJvcihldmVudCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGV2ZW50KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25DbG9zZWQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5jbGVhclRpbWVyKCk7XG5cbiAgICAgICAgLy8g5omn6KGM5pat57q/5Zue6LCD77yM6L+U5ZueZmFsc2XooajnpLrkuI3ov5vooYzph43ov55cbiAgICAgICAgaWYgKHRoaXMuX2Rpc2Nvbm5lY3RDYWxsYmFjayAmJiAhdGhpcy5fZGlzY29ubmVjdENhbGxiYWNrKCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBkaXNjb25uZWN0IHJldHVybiFgKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g6Ieq5Yqo6YeN6L+eXG4gICAgICAgIGlmICh0aGlzLmlzQXV0b1JlY29ubmVjdCgpKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU5ldFRpcHMoTmV0VGlwc1R5cGUuUmVDb25uZWN0aW5nLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuX3JlY29ubmVjdFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBOZXROb2RlU3RhdGUuQ2xvc2VkO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdCh0aGlzLl9jb25uZWN0T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2F1dG9SZWNvbm5lY3QgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F1dG9SZWNvbm5lY3QgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzLl9yZWNvbm5ldFRpbWVPdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBOZXROb2RlU3RhdGUuQ2xvc2VkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNsb3NlKGNvZGU/OiBudW1iZXIsIHJlYXNvbj86IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSB7fTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdHMubGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKHRoaXMuX25ldHdvcmtUaXBzKSB7XG4gICAgICAgICAgICB0aGlzLl9uZXR3b3JrVGlwcy5jb25uZWN0VGlwcyhmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLl9uZXR3b3JrVGlwcy5yZWNvbm5lY3RUaXBzKGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuX25ldHdvcmtUaXBzLnJlcXVlc3RUaXBzKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fc29ja2V0KSB7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQuY2xvc2UoY29kZSwgcmVhc29uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gTmV0Tm9kZVN0YXRlLkNsb3NlZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWPquaYr+WFs+mXrVNvY2tldOWll+aOpeWtl++8iOS7jeeEtumHjeeUqOe8k+WtmOS4juW9k+WJjeeKtuaAge+8iVxuICAgIHB1YmxpYyBjbG9zZVNvY2tldChjb2RlPzogbnVtYmVyLCByZWFzb24/OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NvY2tldCkge1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0LmNsb3NlKGNvZGUsIHJlYXNvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDlj5Hotbfor7fmsYLvvIzlpoLmnpzlvZPliY3lpITkuo7ph43ov57kuK3vvIzov5vlhaXnvJPlrZjliJfooajnrYnlvoXph43ov57lrozmiJDlkI7lj5HpgIFcbiAgICBwdWJsaWMgc2VuZChidWY6IE5ldERhdGEsIGZvcmNlOiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlID09IE5ldE5vZGVTdGF0ZS5Xb3JraW5nIHx8IGZvcmNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgc29ja2V0IHNlbmQgLi4uYCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc29ja2V0LnNlbmQoYnVmKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PSBOZXROb2RlU3RhdGUuQ2hlY2tpbmcgfHxcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID09IE5ldE5vZGVTdGF0ZS5Db25uZWN0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXF1ZXN0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBidWZmZXI6IGJ1ZixcbiAgICAgICAgICAgICAgICByc3BDbWQ6IDAsXG4gICAgICAgICAgICAgICAgcnNwT2JqZWN0OiBudWxsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV0Tm9kZSBzb2NrZXQgaXMgYnVzeSwgcHVzaCB0byBzZW5kIGJ1ZmZlciwgY3VycmVudCBzdGF0ZSBpcyBcIiArIHRoaXMuX3N0YXRlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk5ldE5vZGUgcmVxdWVzdCBlcnJvciEgY3VycmVudCBzdGF0ZSBpcyBcIiArIHRoaXMuX3N0YXRlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWPkei1t+ivt+axgu+8jOW5tui/m+WFpee8k+WtmOWIl+ihqFxuICAgIHB1YmxpYyByZXF1ZXN0KGJ1ZjogTmV0RGF0YSwgcnNwQ21kOiBudW1iZXIsIHJzcE9iamVjdDogQ2FsbGJhY2tPYmplY3QsIHNob3dUaXBzOiBib29sZWFuID0gdHJ1ZSwgZm9yY2U6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBpZiAodGhpcy5fc3RhdGUgPT0gTmV0Tm9kZVN0YXRlLldvcmtpbmcgfHwgZm9yY2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5zZW5kKGJ1Zik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYE5ldE5vZGUgcmVxdWVzdCB3aXRoIHRpbWVvdXQgZm9yICR7cnNwQ21kfWApO1xuICAgICAgICAvLyDov5vlhaXlj5HpgIHnvJPlrZjliJfooahcbiAgICAgICAgdGhpcy5fcmVxdWVzdHMucHVzaCh7XG4gICAgICAgICAgICBidWZmZXI6IGJ1ZiwgcnNwQ21kLCByc3BPYmplY3RcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIOWQr+WKqOe9kee7nOivt+axguWxglxuICAgICAgICBpZiAoc2hvd1RpcHMpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTmV0VGlwcyhOZXRUaXBzVHlwZS5SZXF1ZXN0aW5nLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWUr+S4gHJlcXVlc3TvvIznoa7kv53msqHmnInlkIzkuIDlk43lupTnmoTor7fmsYLvvIjpgb/lhY3kuIDkuKror7fmsYLph43lpI3lj5HpgIHvvIxuZXRUaXBz55WM6Z2i55qE5bGP6JS95Lmf5piv5LiA5Liq5aW955qE5pa55rOV77yJXG4gICAgcHVibGljIHJlcXVlc3RVbmlxdWUoYnVmOiBOZXREYXRhLCByc3BDbWQ6IG51bWJlciwgcnNwT2JqZWN0OiBDYWxsYmFja09iamVjdCwgc2hvd1RpcHM6IGJvb2xlYW4gPSB0cnVlLCBmb3JjZTogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fcmVxdWVzdHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZXF1ZXN0c1tpXS5yc3BDbWQgPT0gcnNwQ21kKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE5ldE5vZGUgcmVxdWVzdFVuaXF1ZSBmYWlsZSBmb3IgJHtyc3BDbWR9YCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVxdWVzdChidWYsIHJzcENtZCwgcnNwT2JqZWN0LCBzaG93VGlwcywgZm9yY2UpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKiDlm57osIPnm7jlhbPlpITnkIYgKioqKioqKioqKioqKioqKioqKioqL1xuICAgIHB1YmxpYyBzZXRSZXNwb25lSGFuZGxlcihjbWQ6IG51bWJlciwgY2FsbGJhY2s6IE5ldENhbGxGdW5jLCB0YXJnZXQ/OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYE5ldE5vZGUgc2V0UmVzcG9uZUhhbmRsZXIgZXJyb3IgJHtjbWR9YCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbGlzdGVuZXJbY21kXSA9IFt7IHRhcmdldCwgY2FsbGJhY2sgfV07XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRSZXNwb25lSGFuZGxlcihjbWQ6IG51bWJlciwgY2FsbGJhY2s6IE5ldENhbGxGdW5jLCB0YXJnZXQ/OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYE5ldE5vZGUgYWRkUmVzcG9uZUhhbmRsZXIgZXJyb3IgJHtjbWR9YCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJzcE9iamVjdCA9IHsgdGFyZ2V0LCBjYWxsYmFjayB9O1xuICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9saXN0ZW5lcltjbWRdKSB7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcltjbWRdID0gW3JzcE9iamVjdF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmdldE5ldExpc3RlbmVyc0luZGV4KGNtZCwgcnNwT2JqZWN0KTtcbiAgICAgICAgICAgIGlmICgtMSA9PSBpbmRleCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyW2NtZF0ucHVzaChyc3BPYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmVSZXNwb25lSGFuZGxlcihjbWQ6IG51bWJlciwgY2FsbGJhY2s6IE5ldENhbGxGdW5jLCB0YXJnZXQ/OiBhbnkpIHtcbiAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fbGlzdGVuZXJbY21kXSAmJiBjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmdldE5ldExpc3RlbmVyc0luZGV4KGNtZCwgeyB0YXJnZXQsIGNhbGxiYWNrIH0pO1xuICAgICAgICAgICAgaWYgKC0xICE9IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJbY21kXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFuTGlzdGVuZXJzKGNtZDogbnVtYmVyID0gLTEpIHtcbiAgICAgICAgaWYgKGNtZCA9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSB7fVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJbY21kXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0TmV0TGlzdGVuZXJzSW5kZXgoY21kOiBudW1iZXIsIHJzcE9iamVjdDogQ2FsbGJhY2tPYmplY3QpOiBudW1iZXIge1xuICAgICAgICBsZXQgaW5kZXggPSAtMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9saXN0ZW5lcltjbWRdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgaXRlcmF0b3IgPSB0aGlzLl9saXN0ZW5lcltjbWRdW2ldO1xuICAgICAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGxiYWNrID09IHJzcE9iamVjdC5jYWxsYmFja1xuICAgICAgICAgICAgICAgICYmIGl0ZXJhdG9yLnRhcmdldCA9PSByc3BPYmplY3QudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKiDlv4Pot7PjgIHotoXml7bnm7jlhbPlpITnkIYgKioqKioqKioqKioqKioqKioqKioqL1xuICAgIHByb3RlY3RlZCByZXNldFJlY2VpdmVNc2dUaW1lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuX3JlY2VpdmVNc2dUaW1lciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JlY2VpdmVNc2dUaW1lcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yZWNlaXZlTXNnVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5ldE5vZGUgcmVjdmllTXNnVGltZXIgY2xvc2Ugc29ja2V0IVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5jbG9zZSgpO1xuICAgICAgICB9LCB0aGlzLl9yZWNlaXZlVGltZSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlc2V0SGVhcmJlYXRUaW1lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2tlZXBBbGl2ZVRpbWVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fa2VlcEFsaXZlVGltZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fa2VlcEFsaXZlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV0Tm9kZSBrZWVwQWxpdmVUaW1lciBzZW5kIEhlYXJiZWF0XCIpXG4gICAgICAgICAgICB0aGlzLnNlbmQodGhpcy5fcHJvdG9jb2xIZWxwZXIuZ2V0SGVhcmJlYXQoKSk7XG4gICAgICAgIH0sIHRoaXMuX2hlYXJ0VGltZSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNsZWFyVGltZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLl9yZWNlaXZlTXNnVGltZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZWNlaXZlTXNnVGltZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9rZWVwQWxpdmVUaW1lciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2tlZXBBbGl2ZVRpbWVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcmVjb25uZWN0VGltZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZWNvbm5lY3RUaW1lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaXNBdXRvUmVjb25uZWN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXV0b1JlY29ubmVjdCAhPSAwO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWplY3RSZWNvbm5lY3QoKSB7XG4gICAgICAgIHRoaXMuX2F1dG9SZWNvbm5lY3QgPSAwO1xuICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICB9XG59Il19