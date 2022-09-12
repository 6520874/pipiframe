"use strict";
cc._RF.push(module, '53550gvXOhBFrnzqMfqR5v9', 'UIManager');
// Script/ui/UIManager.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UIView_1 = require("./UIView");
var ResLoader_1 = require("../res/ResLoader");
var UIManager = /** @class */ (function () {
    function UIManager() {
        /** 资源加载计数器，用于生成唯一的资源占用key */
        this.useCount = 0;
        /** 背景UI（有若干层UI是作为背景UI，而不受切换等影响）*/
        this.BackGroundUI = 0;
        /** 是否正在关闭UI */
        this.isClosing = false;
        /** 是否正在打开UI */
        this.isOpening = false;
        /** UI界面缓存（key为UIId，value为UIView节点）*/
        this.UICache = {};
        /** UI界面栈（{UIID + UIView + UIArgs}数组）*/
        this.UIStack = [];
        /** UI待打开列表 */
        this.UIOpenQueue = [];
        /** UI待关闭列表 */
        this.UICloseQueue = [];
        /** UI配置 */
        this.UIConf = {};
        /** UI打开前回调 */
        this.uiOpenBeforeDelegate = null;
        /** UI打开回调 */
        this.uiOpenDelegate = null;
        /** UI关闭回调 */
        this.uiCloseDelegate = null;
    }
    /**
     * 初始化所有UI的配置对象
     * @param conf 配置对象
     */
    UIManager.prototype.initUIConf = function (conf) {
        this.UIConf = conf;
    };
    /**
     * 设置或覆盖某uiId的配置
     * @param uiId 要设置的界面id
     * @param conf 要设置的配置
     */
    UIManager.prototype.setUIConf = function (uiId, conf) {
        this.UIConf[uiId] = conf;
    };
    /****************** 私有方法，UIManager内部的功能和基础规则 *******************/
    /**
     * 添加防触摸层
     * @param zOrder 屏蔽层的层级
     */
    UIManager.prototype.preventTouch = function (zOrder) {
        var node = new cc.Node();
        node.name = 'preventTouch';
        node.setContentSize(cc.winSize);
        node.on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation();
        }, node);
        var child = cc.director.getScene().getChildByName('Canvas');
        child.addChild(node, zOrder);
        return node;
    };
    /** 自动执行下一个待关闭或待打开的界面 */
    UIManager.prototype.autoExecNextUI = function () {
        // 逻辑上是先关后开
        if (this.UICloseQueue.length > 0) {
            var uiQueueInfo = this.UICloseQueue[0];
            this.UICloseQueue.splice(0, 1);
            this.close(uiQueueInfo);
        }
        else if (this.UIOpenQueue.length > 0) {
            var uiQueueInfo = this.UIOpenQueue[0];
            this.UIOpenQueue.splice(0, 1);
            this.open(uiQueueInfo.uiId, uiQueueInfo.uiArgs);
        }
    };
    /**
     * 自动检测动画组件以及特定动画，如存在则播放动画，无论动画是否播放，都执行回调
     * @param aniName 动画名
     * @param aniOverCallback 动画播放完成回调
     */
    UIManager.prototype.autoExecAnimation = function (uiView, aniName, aniOverCallback) {
        // 暂时先省略动画播放的逻辑
        aniOverCallback();
    };
    /**
     * 自动检测资源预加载组件，如果存在则加载完成后调用completeCallback，否则直接调用
     * @param completeCallback 资源加载完成回调
     */
    UIManager.prototype.autoLoadRes = function (uiView, completeCallback) {
        // 暂时先省略
        completeCallback();
    };
    /** 生成唯一的资源占用key */
    UIManager.prototype.makeUseKey = function () {
        return "UIMgr_" + ++this.useCount;
    };
    /** 根据界面显示类型刷新显示 */
    UIManager.prototype.updateUI = function () {
        var hideIndex = 0;
        var showIndex = this.UIStack.length - 1;
        for (; showIndex >= 0; --showIndex) {
            var mode = this.UIStack[showIndex].uiView.showType;
            // 无论何种模式，最顶部的UI都是应该显示的
            this.UIStack[showIndex].uiView.node.active = true;
            if (UIView_1.UIShowTypes.UIFullScreen == mode) {
                break;
            }
            else if (UIView_1.UIShowTypes.UISingle == mode) {
                for (var i = 0; i < this.BackGroundUI; ++i) {
                    if (this.UIStack[i]) {
                        this.UIStack[i].uiView.node.active = true;
                    }
                }
                hideIndex = this.BackGroundUI;
                break;
            }
        }
        // 隐藏不应该显示的部分UI
        for (var hide = hideIndex; hide < showIndex; ++hide) {
            this.UIStack[hide].uiView.node.active = false;
        }
    };
    /**
     * 异步加载一个UI的prefab，成功加载了一个prefab之后
     * @param uiId 界面id
     * @param processCallback 加载进度回调
     * @param completeCallback 加载完成回调
     * @param uiArgs 初始化参数
     */
    UIManager.prototype.getOrCreateUI = function (uiId, processCallback, completeCallback, uiArgs) {
        var _this = this;
        // 如果找到缓存对象，则直接返回
        var uiView = this.UICache[uiId];
        if (uiView) {
            completeCallback(uiView);
            return;
        }
        // 找到UI配置
        var uiPath = this.UIConf[uiId].prefab;
        if (null == uiPath) {
            cc.log("getOrCreateUI " + uiId + " faile, prefab conf not found!");
            completeCallback(null);
            return;
        }
        var useKey = this.makeUseKey();
        ResLoader_1.resLoader.load(uiPath, processCallback, function (err, prefab) {
            // 检查加载资源错误
            if (err) {
                cc.log("getOrCreateUI loadRes " + uiId + " faile, path: " + uiPath + " error: " + err);
                completeCallback(null);
                return;
            }
            // 检查实例化错误
            var uiNode = cc.instantiate(prefab);
            if (null == uiNode) {
                cc.log("getOrCreateUI instantiate " + uiId + " faile, path: " + uiPath);
                completeCallback(null);
                ResLoader_1.resLoader.release(prefab);
                return;
            }
            // 检查组件获取错误
            uiView = uiNode.getComponent(UIView_1.UIView);
            if (null == uiView) {
                cc.log("getOrCreateUI getComponent " + uiId + " faile, path: " + uiPath);
                uiNode.destroy();
                completeCallback(null);
                ResLoader_1.resLoader.release(prefab);
                return;
            }
            // 异步加载UI预加载的资源
            _this.autoLoadRes(uiView, function () {
                uiView.init(uiArgs);
                completeCallback(uiView);
                uiView.cacheAsset(prefab);
            });
        });
    };
    /**
     * UI被打开时回调，对UI进行初始化设置，刷新其他界面的显示，并根据
     * @param uiId 哪个界面被打开了
     * @param uiView 界面对象
     * @param uiInfo 界面栈对应的信息结构
     * @param uiArgs 界面初始化参数
     */
    UIManager.prototype.onUIOpen = function (uiId, uiView, uiInfo, uiArgs) {
        var _this = this;
        if (null == uiView) {
            return;
        }
        // 激活界面
        uiInfo.uiView = uiView;
        uiView.node.active = true;
        uiView.node.zIndex = uiInfo.zOrder || this.UIStack.length;
        // 快速关闭界面的设置，绑定界面中的background，实现快速关闭
        if (uiView.quickClose) {
            var backGround = uiView.node.getChildByName('background');
            if (!backGround) {
                backGround = new cc.Node();
                backGround.name = 'background';
                backGround.setContentSize(cc.winSize);
                uiView.node.addChild(backGround, -1);
            }
            backGround.targetOff(cc.Node.EventType.TOUCH_START);
            backGround.on(cc.Node.EventType.TOUCH_START, function (event) {
                event.stopPropagation();
                _this.close(uiView);
            }, backGround);
        }
        // 添加到场景中
        var child = cc.director.getScene().getChildByName('Canvas');
        child.addChild(uiView.node);
        // 刷新其他UI
        this.updateUI();
        // 从那个界面打开的
        var fromUIID = 0;
        if (this.UIStack.length > 1) {
            fromUIID = this.UIStack[this.UIStack.length - 2].uiId;
        }
        // 打开界面之前回调
        if (this.uiOpenBeforeDelegate) {
            this.uiOpenBeforeDelegate(uiId, fromUIID);
        }
        // 执行onOpen回调
        uiView.onOpen(fromUIID, uiArgs);
        this.autoExecAnimation(uiView, "uiOpen", function () {
            uiView.onOpenAniOver();
            if (_this.uiOpenDelegate) {
                _this.uiOpenDelegate(uiId, fromUIID);
            }
        });
    };
    /** 打开界面并添加到界面栈中 */
    UIManager.prototype.open = function (uiId, uiArgs, progressCallback) {
        var _this = this;
        if (uiArgs === void 0) { uiArgs = null; }
        if (progressCallback === void 0) { progressCallback = null; }
        var uiInfo = {
            uiId: uiId,
            uiArgs: uiArgs,
            uiView: null
        };
        if (this.isOpening || this.isClosing) {
            // 插入待打开队列
            this.UIOpenQueue.push(uiInfo);
            return;
        }
        var uiIndex = this.getUIIndex(uiId);
        if (-1 != uiIndex) {
            // 重复打开了同一个界面，直接回到该界面
            this.closeToUI(uiId, uiArgs);
            return;
        }
        // 设置UI的zOrder
        uiInfo.zOrder = this.UIStack.length + 1;
        this.UIStack.push(uiInfo);
        // 先屏蔽点击
        if (this.UIConf[uiId].preventTouch) {
            uiInfo.preventNode = this.preventTouch(uiInfo.zOrder);
        }
        this.isOpening = true;
        // 预加载资源，并在资源加载完成后自动打开界面
        this.getOrCreateUI(uiId, progressCallback, function (uiView) {
            // 如果界面已经被关闭或创建失败
            if (uiInfo.isClose || null == uiView) {
                cc.log("getOrCreateUI " + uiId + " faile!\n                        close state : " + uiInfo.isClose + " , uiView : " + uiView);
                _this.isOpening = false;
                if (uiInfo.preventNode) {
                    uiInfo.preventNode.destroy();
                    uiInfo.preventNode = null;
                }
                return;
            }
            // 打开UI，执行配置
            _this.onUIOpen(uiId, uiView, uiInfo, uiArgs);
            _this.isOpening = false;
            _this.autoExecNextUI();
        }, uiArgs);
    };
    /** 替换栈顶界面 */
    UIManager.prototype.replace = function (uiId, uiArgs) {
        if (uiArgs === void 0) { uiArgs = null; }
        this.close(this.UIStack[this.UIStack.length - 1].uiView);
        this.open(uiId, uiArgs);
    };
    /**
     * 关闭当前界面
     * @param closeUI 要关闭的界面
     */
    UIManager.prototype.close = function (closeUI) {
        var _this = this;
        var uiCount = this.UIStack.length;
        if (uiCount < 1 || this.isClosing || this.isOpening) {
            if (closeUI) {
                // 插入待关闭队列
                this.UICloseQueue.push(closeUI);
            }
            return;
        }
        var uiInfo;
        if (closeUI) {
            for (var index = this.UIStack.length - 1; index >= 0; index--) {
                var ui = this.UIStack[index];
                if (ui.uiView === closeUI) {
                    uiInfo = ui;
                    this.UIStack.splice(index, 1);
                    break;
                }
            }
            // 找不到这个UI
            if (uiInfo === undefined) {
                return;
            }
        }
        else {
            uiInfo = this.UIStack.pop();
        }
        // 关闭当前界面
        var uiId = uiInfo.uiId;
        var uiView = uiInfo.uiView;
        uiInfo.isClose = true;
        // 回收遮罩层
        if (uiInfo.preventNode) {
            uiInfo.preventNode.destroy();
            uiInfo.preventNode = null;
        }
        if (null == uiView) {
            return;
        }
        var preUIInfo = this.UIStack[uiCount - 2];
        // 处理显示模式
        this.updateUI();
        var close = function () {
            _this.isClosing = false;
            // 显示之前的界面
            if (preUIInfo && preUIInfo.uiView && _this.isTopUI(preUIInfo.uiId)) {
                // 如果之前的界面弹到了最上方（中间有肯能打开了其他界面）
                preUIInfo.uiView.node.active = true;
                // 回调onTop
                preUIInfo.uiView.onTop(uiId, uiView.onClose());
            }
            else {
                uiView.onClose();
            }
            if (_this.uiCloseDelegate) {
                _this.uiCloseDelegate(uiId);
            }
            if (uiView.cache) {
                _this.UICache[uiId] = uiView;
                uiView.node.removeFromParent(false);
                cc.log("uiView removeFromParent " + uiInfo.uiId);
            }
            else {
                uiView.releaseAssets();
                uiView.node.destroy();
                cc.log("uiView destroy " + uiInfo.uiId);
            }
            _this.autoExecNextUI();
        };
        // 执行关闭动画
        this.autoExecAnimation(uiView, "uiClose", close);
    };
    /** 关闭所有界面 */
    UIManager.prototype.closeAll = function () {
        // 不播放动画，也不清理缓存
        for (var _i = 0, _a = this.UIStack; _i < _a.length; _i++) {
            var uiInfo = _a[_i];
            uiInfo.isClose = true;
            if (uiInfo.preventNode) {
                uiInfo.preventNode.destroy();
                uiInfo.preventNode = null;
            }
            if (uiInfo.uiView) {
                uiInfo.uiView.onClose();
                uiInfo.uiView.releaseAssets();
                uiInfo.uiView.node.destroy();
            }
        }
        this.UIOpenQueue = [];
        this.UICloseQueue = [];
        this.UIStack = [];
        this.isOpening = false;
        this.isClosing = false;
    };
    /**
     * 关闭界面，一直关闭到顶部为uiId的界面，为避免循环打开UI导致UI栈溢出
     * @param uiId 要关闭到的uiId（关闭其顶部的ui）
     * @param uiArgs 打开的参数
     * @param bOpenSelf
     */
    UIManager.prototype.closeToUI = function (uiId, uiArgs, bOpenSelf) {
        if (bOpenSelf === void 0) { bOpenSelf = true; }
        var idx = this.getUIIndex(uiId);
        if (-1 == idx) {
            return;
        }
        idx = bOpenSelf ? idx : idx + 1;
        for (var i = this.UIStack.length - 1; i >= idx; --i) {
            var uiInfo = this.UIStack.pop();
            var uiId_1 = uiInfo.uiId;
            var uiView = uiInfo.uiView;
            uiInfo.isClose = true;
            // 回收屏蔽层
            if (uiInfo.preventNode) {
                uiInfo.preventNode.destroy();
                uiInfo.preventNode = null;
            }
            if (this.uiCloseDelegate) {
                this.uiCloseDelegate(uiId_1);
            }
            if (uiView) {
                uiView.onClose();
                if (uiView.cache) {
                    this.UICache[uiId_1] = uiView;
                    uiView.node.removeFromParent(false);
                }
                else {
                    uiView.releaseAssets();
                    uiView.node.destroy();
                }
            }
        }
        this.updateUI();
        this.UIOpenQueue = [];
        this.UICloseQueue = [];
        bOpenSelf && this.open(uiId, uiArgs);
    };
    /** 清理界面缓存 */
    UIManager.prototype.clearCache = function () {
        for (var key in this.UICache) {
            var ui = this.UICache[key];
            if (cc.isValid(ui.node)) {
                if (cc.isValid(ui)) {
                    ui.releaseAssets();
                }
                ui.node.destroy();
            }
        }
        this.UICache = {};
    };
    /******************** UI的便捷接口 *******************/
    UIManager.prototype.isTopUI = function (uiId) {
        if (this.UIStack.length == 0) {
            return false;
        }
        return this.UIStack[this.UIStack.length - 1].uiId == uiId;
    };
    UIManager.prototype.getUI = function (uiId) {
        for (var index = 0; index < this.UIStack.length; index++) {
            var element = this.UIStack[index];
            if (uiId == element.uiId) {
                return element.uiView;
            }
        }
        return null;
    };
    UIManager.prototype.getTopUI = function () {
        if (this.UIStack.length > 0) {
            return this.UIStack[this.UIStack.length - 1].uiView;
        }
        return null;
    };
    UIManager.prototype.getUIIndex = function (uiId) {
        for (var index = 0; index < this.UIStack.length; index++) {
            var element = this.UIStack[index];
            if (uiId == element.uiId) {
                return index;
            }
        }
        return -1;
    };
    return UIManager;
}());
exports.UIManager = UIManager;
exports.uiManager = new UIManager();

cc._RF.pop();