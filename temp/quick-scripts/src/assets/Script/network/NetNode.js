"use strict";
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