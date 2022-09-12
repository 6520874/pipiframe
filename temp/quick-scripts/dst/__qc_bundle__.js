
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/Script/common/EventManager');
require('./assets/Script/common/TaskQueue');
require('./assets/Script/example/EmptyScene');
require('./assets/Script/example/NetExample');
require('./assets/Script/example/ResExample');
require('./assets/Script/example/ResKeeperExample');
require('./assets/Script/example/UIExample');
require('./assets/Script/example/uiviews/UIBag');
require('./assets/Script/example/uiviews/UIHall');
require('./assets/Script/example/uiviews/UILogin');
require('./assets/Script/example/uiviews/UINotice');
require('./assets/Script/network/NetInterface');
require('./assets/Script/network/NetManager');
require('./assets/Script/network/NetNode');
require('./assets/Script/network/WebSock');
require('./assets/Script/res/NodePool');
require('./assets/Script/res/ResKeeper');
require('./assets/Script/res/ResLeakChecker');
require('./assets/Script/res/ResLoader');
require('./assets/Script/res/ResManager');
require('./assets/Script/res/ResPool');
require('./assets/Script/res/ResUtil');
require('./assets/Script/ui/UIManager');
require('./assets/Script/ui/UIView');

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/ui/UIManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvdWkvVUlNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQStDO0FBQy9DLDhDQUE4RDtBQWdDOUQ7SUFBQTtRQUNJLDZCQUE2QjtRQUNyQixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLGtDQUFrQztRQUMxQixpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUN6QixlQUFlO1FBQ1AsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUMxQixlQUFlO1FBQ1AsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUUxQixxQ0FBcUM7UUFDN0IsWUFBTyxHQUErQixFQUFFLENBQUM7UUFDakQsdUNBQXVDO1FBQy9CLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDL0IsY0FBYztRQUNOLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBQ25DLGNBQWM7UUFDTixpQkFBWSxHQUFhLEVBQUUsQ0FBQztRQUNwQyxXQUFXO1FBQ0gsV0FBTSxHQUE4QixFQUFFLENBQUM7UUFFL0MsY0FBYztRQUNQLHlCQUFvQixHQUE0QyxJQUFJLENBQUM7UUFDNUUsYUFBYTtRQUNOLG1CQUFjLEdBQTRDLElBQUksQ0FBQztRQUN0RSxhQUFhO1FBQ04sb0JBQWUsR0FBMkIsSUFBSSxDQUFDO0lBeWQxRCxDQUFDO0lBdmRHOzs7T0FHRztJQUNJLDhCQUFVLEdBQWpCLFVBQWtCLElBQStCO1FBQzdDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksNkJBQVMsR0FBaEIsVUFBaUIsSUFBWSxFQUFFLElBQVk7UUFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVELGlFQUFpRTtJQUVqRTs7O09BR0c7SUFDSyxnQ0FBWSxHQUFwQixVQUFxQixNQUFjO1FBQy9CLElBQUksSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFDO1FBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLFVBQVUsS0FBMkI7WUFDeEUsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzVCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNULElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVELEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCx3QkFBd0I7SUFDaEIsa0NBQWMsR0FBdEI7UUFDSSxXQUFXO1FBQ1gsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDOUIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUMzQjthQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3BDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbkQ7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLHFDQUFpQixHQUF6QixVQUEwQixNQUFjLEVBQUUsT0FBZSxFQUFFLGVBQTJCO1FBQ2xGLGVBQWU7UUFDZixlQUFlLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssK0JBQVcsR0FBbkIsVUFBb0IsTUFBYyxFQUFFLGdCQUE0QjtRQUM1RCxRQUFRO1FBQ1IsZ0JBQWdCLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsbUJBQW1CO0lBQ1gsOEJBQVUsR0FBbEI7UUFDSSxPQUFPLFdBQVMsRUFBRSxJQUFJLENBQUMsUUFBVSxDQUFDO0lBQ3RDLENBQUM7SUFFRCxtQkFBbUI7SUFDWCw0QkFBUSxHQUFoQjtRQUNJLElBQUksU0FBUyxHQUFXLENBQUMsQ0FBQztRQUMxQixJQUFJLFNBQVMsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDaEQsT0FBTyxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFO1lBQ2hDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNuRCx1QkFBdUI7WUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbEQsSUFBSSxvQkFBVyxDQUFDLFlBQVksSUFBSSxJQUFJLEVBQUU7Z0JBQ2xDLE1BQU07YUFDVDtpQkFBTSxJQUFJLG9CQUFXLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtnQkFDckMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLEVBQUU7b0JBQ3hDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7cUJBQzdDO2lCQUNKO2dCQUNELFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUM5QixNQUFNO2FBQ1Q7U0FDSjtRQUNELGVBQWU7UUFDZixLQUFLLElBQUksSUFBSSxHQUFXLFNBQVMsRUFBRSxJQUFJLEdBQUcsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFO1lBQ3pELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1NBQ2pEO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNLLGlDQUFhLEdBQXJCLFVBQXNCLElBQVksRUFBRSxlQUFnQyxFQUFFLGdCQUEwQyxFQUFFLE1BQVc7UUFBN0gsaUJBZ0RDO1FBL0NHLGlCQUFpQjtRQUNqQixJQUFJLE1BQU0sR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksTUFBTSxFQUFFO1lBQ1IsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekIsT0FBTztTQUNWO1FBRUQsU0FBUztRQUNULElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3RDLElBQUksSUFBSSxJQUFJLE1BQU0sRUFBRTtZQUNoQixFQUFFLENBQUMsR0FBRyxDQUFDLG1CQUFpQixJQUFJLG1DQUFnQyxDQUFDLENBQUM7WUFDOUQsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkIsT0FBTztTQUNWO1FBRUQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQy9CLHFCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsVUFBQyxHQUFVLEVBQUUsTUFBaUI7WUFDbEUsV0FBVztZQUNYLElBQUksR0FBRyxFQUFFO2dCQUNMLEVBQUUsQ0FBQyxHQUFHLENBQUMsMkJBQXlCLElBQUksc0JBQWlCLE1BQU0sZ0JBQVcsR0FBSyxDQUFDLENBQUM7Z0JBQzdFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QixPQUFPO2FBQ1Y7WUFDRCxVQUFVO1lBQ1YsSUFBSSxNQUFNLEdBQVksRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QyxJQUFJLElBQUksSUFBSSxNQUFNLEVBQUU7Z0JBQ2hCLEVBQUUsQ0FBQyxHQUFHLENBQUMsK0JBQTZCLElBQUksc0JBQWlCLE1BQVEsQ0FBQyxDQUFDO2dCQUNuRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkIscUJBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFCLE9BQU87YUFDVjtZQUNELFdBQVc7WUFDWCxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFNLENBQUMsQ0FBQztZQUNyQyxJQUFJLElBQUksSUFBSSxNQUFNLEVBQUU7Z0JBQ2hCLEVBQUUsQ0FBQyxHQUFHLENBQUMsZ0NBQThCLElBQUksc0JBQWlCLE1BQVEsQ0FBQyxDQUFDO2dCQUNwRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2pCLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QixxQkFBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUIsT0FBTzthQUNWO1lBQ0QsZUFBZTtZQUNmLEtBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO2dCQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNwQixnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDekIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNLLDRCQUFRLEdBQWhCLFVBQWlCLElBQVksRUFBRSxNQUFjLEVBQUUsTUFBYyxFQUFFLE1BQVc7UUFBMUUsaUJBbURDO1FBbERHLElBQUksSUFBSSxJQUFJLE1BQU0sRUFBRTtZQUNoQixPQUFPO1NBQ1Y7UUFDRCxPQUFPO1FBQ1AsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUE7UUFFekQsb0NBQW9DO1FBQ3BDLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNiLFVBQVUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDMUIsVUFBVSxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7Z0JBQy9CLFVBQVUsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN4QztZQUNELFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDcEQsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsVUFBQyxLQUEyQjtnQkFDckUsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN4QixLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztTQUNsQjtRQUVELFNBQVM7UUFDVCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1RCxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixTQUFTO1FBQ1QsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWhCLFdBQVc7UUFDWCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDekIsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO1NBQ3hEO1FBRUQsV0FBVztRQUNYLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzNCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDN0M7UUFFRCxhQUFhO1FBQ2IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7WUFDckMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3ZCLElBQUksS0FBSSxDQUFDLGNBQWMsRUFBRTtnQkFDckIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDdkM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxtQkFBbUI7SUFDWix3QkFBSSxHQUFYLFVBQVksSUFBWSxFQUFFLE1BQWtCLEVBQUUsZ0JBQXdDO1FBQXRGLGlCQWlEQztRQWpEeUIsdUJBQUEsRUFBQSxhQUFrQjtRQUFFLGlDQUFBLEVBQUEsdUJBQXdDO1FBQ2xGLElBQUksTUFBTSxHQUFXO1lBQ2pCLElBQUksRUFBRSxJQUFJO1lBQ1YsTUFBTSxFQUFFLE1BQU07WUFDZCxNQUFNLEVBQUUsSUFBSTtTQUNmLENBQUM7UUFFRixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQyxVQUFVO1lBQ1YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsT0FBTztTQUNWO1FBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsQ0FBQyxJQUFJLE9BQU8sRUFBRTtZQUNmLHFCQUFxQjtZQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM3QixPQUFPO1NBQ1Y7UUFFRCxjQUFjO1FBQ2QsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFMUIsUUFBUTtRQUNSLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUU7WUFDaEMsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLHdCQUF3QjtRQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxVQUFDLE1BQWM7WUFDdEQsaUJBQWlCO1lBQ2pCLElBQUksTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFO2dCQUNsQyxFQUFFLENBQUMsR0FBRyxDQUFDLG1CQUFpQixJQUFJLHVEQUNKLE1BQU0sQ0FBQyxPQUFPLG9CQUFlLE1BQVEsQ0FBQyxDQUFDO2dCQUMvRCxLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDdkIsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFO29CQUNwQixNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUM3QixNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztpQkFDN0I7Z0JBQ0QsT0FBTzthQUNWO1lBRUQsWUFBWTtZQUNaLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDNUMsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsS0FBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFCLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFRCxhQUFhO0lBQ04sMkJBQU8sR0FBZCxVQUFlLElBQVksRUFBRSxNQUFrQjtRQUFsQix1QkFBQSxFQUFBLGFBQWtCO1FBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0kseUJBQUssR0FBWixVQUFhLE9BQWdCO1FBQTdCLGlCQTBFQztRQXpFRyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUNsQyxJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2pELElBQUksT0FBTyxFQUFFO2dCQUNULFVBQVU7Z0JBQ1YsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDbkM7WUFDRCxPQUFPO1NBQ1Y7UUFFRCxJQUFJLE1BQWMsQ0FBQztRQUNuQixJQUFJLE9BQU8sRUFBRTtZQUNULEtBQUssSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQzNELElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzdCLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxPQUFPLEVBQUU7b0JBQ3ZCLE1BQU0sR0FBRyxFQUFFLENBQUM7b0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNO2lCQUNUO2FBQ0o7WUFDRCxVQUFVO1lBQ1YsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO2dCQUN0QixPQUFPO2FBQ1Y7U0FDSjthQUFNO1lBQ0gsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDL0I7UUFFRCxTQUFTO1FBQ1QsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBRXRCLFFBQVE7UUFDUixJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUU7WUFDcEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM3QixNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztTQUM3QjtRQUVELElBQUksSUFBSSxJQUFJLE1BQU0sRUFBRTtZQUNoQixPQUFPO1NBQ1Y7UUFFRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxQyxTQUFTO1FBQ1QsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hCLElBQUksS0FBSyxHQUFHO1lBQ1IsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsVUFBVTtZQUNWLElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUksS0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQy9ELDhCQUE4QjtnQkFDOUIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtnQkFDbkMsVUFBVTtnQkFDVixTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7YUFDbEQ7aUJBQU07Z0JBQ0gsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ3BCO1lBRUQsSUFBSSxLQUFJLENBQUMsZUFBZSxFQUFFO2dCQUN0QixLQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzlCO1lBQ0QsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUNkLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO2dCQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwQyxFQUFFLENBQUMsR0FBRyxDQUFDLDZCQUEyQixNQUFNLENBQUMsSUFBTSxDQUFDLENBQUM7YUFDcEQ7aUJBQU07Z0JBQ0gsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUN0QixFQUFFLENBQUMsR0FBRyxDQUFDLG9CQUFrQixNQUFNLENBQUMsSUFBTSxDQUFDLENBQUM7YUFDM0M7WUFDRCxLQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUIsQ0FBQyxDQUFBO1FBQ0QsU0FBUztRQUNULElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxhQUFhO0lBQ04sNEJBQVEsR0FBZjtRQUNJLGVBQWU7UUFDZixLQUFxQixVQUFZLEVBQVosS0FBQSxJQUFJLENBQUMsT0FBTyxFQUFaLGNBQVksRUFBWixJQUFZLEVBQUU7WUFBOUIsSUFBTSxNQUFNLFNBQUE7WUFDYixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUN0QixJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzdCLE1BQU0sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2FBQzdCO1lBQ0QsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ2hDO1NBQ0o7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSw2QkFBUyxHQUFoQixVQUFpQixJQUFZLEVBQUUsTUFBVyxFQUFFLFNBQWdCO1FBQWhCLDBCQUFBLEVBQUEsZ0JBQWdCO1FBQ3hELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUU7WUFDWCxPQUFPO1NBQ1Y7UUFFRCxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUNqRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2hDLElBQUksTUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDdkIsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUMzQixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtZQUVyQixRQUFRO1lBQ1IsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFO2dCQUNwQixNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUM3QixNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzthQUM3QjtZQUVELElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFJLENBQUMsQ0FBQzthQUM5QjtZQUVELElBQUksTUFBTSxFQUFFO2dCQUNSLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtnQkFDaEIsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO29CQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUN2QztxQkFBTTtvQkFDSCxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQ3pCO2FBQ0o7U0FDSjtRQUVELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixTQUFTLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELGFBQWE7SUFDTiw4QkFBVSxHQUFqQjtRQUNJLEtBQUssSUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUM1QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3JCLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDaEIsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUN0QjtnQkFDRCxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ3JCO1NBQ0o7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsa0RBQWtEO0lBQzNDLDJCQUFPLEdBQWQsVUFBZSxJQUFJO1FBQ2YsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDMUIsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztJQUM5RCxDQUFDO0lBRU0seUJBQUssR0FBWixVQUFhLElBQVk7UUFDckIsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3RELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEMsSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtnQkFDdEIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDO2FBQ3pCO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sNEJBQVEsR0FBZjtRQUNJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7U0FDdkQ7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sOEJBQVUsR0FBakIsVUFBa0IsSUFBWTtRQUMxQixLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDdEQsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO2dCQUN0QixPQUFPLEtBQUssQ0FBQzthQUNoQjtTQUNKO1FBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNkLENBQUM7SUFDTCxnQkFBQztBQUFELENBbmZBLEFBbWZDLElBQUE7QUFuZlksOEJBQVM7QUFxZlgsUUFBQSxTQUFTLEdBQWMsSUFBSSxTQUFTLEVBQUUsQ0FBQyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVJVmlldywgVUlTaG93VHlwZXMgfSBmcm9tIFwiLi9VSVZpZXdcIjtcclxuaW1wb3J0IHsgcmVzTG9hZGVyLCBQcm9jZXNzQ2FsbGJhY2sgfSBmcm9tIFwiLi4vcmVzL1Jlc0xvYWRlclwiO1xyXG5cclxuLyoqXHJcbiAqIFVJTWFuYWdlcueVjOmdoueuoeeQhuexu1xyXG4gKiBcclxuICogMS7miZPlvIDnlYzpnaLvvIzmoLnmja7phY3nva7oh6rliqjliqDovb3nlYzpnaLjgIHosIPnlKjliJ3lp4vljJbjgIHmkq3mlL7miZPlvIDliqjnlLvjgIHpmpDol4/lhbbku5bnlYzpnaLjgIHlsY/olL3kuIvmlrnnlYzpnaLngrnlh7tcclxuICogMi7lhbPpl63nlYzpnaLvvIzmoLnmja7phY3nva7oh6rliqjlhbPpl63nlYzpnaLjgIHmkq3mlL7lhbPpl63liqjnlLvjgIHmgaLlpI3lhbbku5bnlYzpnaJcclxuICogMy7liIfmjaLnlYzpnaLvvIzkuI7miZPlvIDnlYzpnaLnsbvkvLzvvIzkvYbmmK/mmK/lsIblvZPliY3moIjpobbnmoTnlYzpnaLliIfmjaLmiJDmlrDnmoTnlYzpnaLvvIjlhYjlhbPpl63lho3miZPlvIDvvIlcclxuICogNC7mj5DkvpvnlYzpnaLnvJPlrZjlip/og71cclxuICogXHJcbiAqIDIwMTgtOC0yOCBieSDlrp3niLdcclxuICovXHJcblxyXG4vKiogVUnmoIjnu5PmnoTkvZMgKi9cclxuZXhwb3J0IGludGVyZmFjZSBVSUluZm8ge1xyXG4gICAgdWlJZDogbnVtYmVyO1xyXG4gICAgdWlWaWV3OiBVSVZpZXc7XHJcbiAgICB1aUFyZ3M6IGFueTtcclxuICAgIHByZXZlbnROb2RlPzogY2MuTm9kZTtcclxuICAgIHpPcmRlcj86IG51bWJlcjtcclxuICAgIG9wZW5UeXBlPzogJ3F1aWV0JyB8ICdvdGhlcic7XHJcbiAgICBpc0Nsb3NlPzogYm9vbGVhbjtcclxuICAgIHJlc1RvQ2xlYXI/OiBzdHJpbmdbXTtcclxuICAgIHJlc0NhY2hlPzogc3RyaW5nW107XHJcbn1cclxuXHJcbi8qKiBVSemFjee9rue7k+aehOS9kyAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFVJQ29uZiB7XHJcbiAgICBwcmVmYWI6IHN0cmluZztcclxuICAgIHByZXZlbnRUb3VjaD86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVSU1hbmFnZXIge1xyXG4gICAgLyoqIOi1hOa6kOWKoOi9veiuoeaVsOWZqO+8jOeUqOS6jueUn+aIkOWUr+S4gOeahOi1hOa6kOWNoOeUqGtleSAqL1xyXG4gICAgcHJpdmF0ZSB1c2VDb3VudCA9IDA7XHJcbiAgICAvKiog6IOM5pmvVUnvvIjmnInoi6XlubLlsYJVSeaYr+S9nOS4uuiDjOaZr1VJ77yM6ICM5LiN5Y+X5YiH5o2i562J5b2x5ZON77yJKi9cclxuICAgIHByaXZhdGUgQmFja0dyb3VuZFVJID0gMDtcclxuICAgIC8qKiDmmK/lkKbmraPlnKjlhbPpl61VSSAqL1xyXG4gICAgcHJpdmF0ZSBpc0Nsb3NpbmcgPSBmYWxzZTtcclxuICAgIC8qKiDmmK/lkKbmraPlnKjmiZPlvIBVSSAqL1xyXG4gICAgcHJpdmF0ZSBpc09wZW5pbmcgPSBmYWxzZTtcclxuXHJcbiAgICAvKiogVUnnlYzpnaLnvJPlrZjvvIhrZXnkuLpVSUlk77yMdmFsdWXkuLpVSVZpZXfoioLngrnvvIkqL1xyXG4gICAgcHJpdmF0ZSBVSUNhY2hlOiB7IFtVSUlkOiBudW1iZXJdOiBVSVZpZXcgfSA9IHt9O1xyXG4gICAgLyoqIFVJ55WM6Z2i5qCI77yIe1VJSUQgKyBVSVZpZXcgKyBVSUFyZ3N95pWw57uE77yJKi9cclxuICAgIHByaXZhdGUgVUlTdGFjazogVUlJbmZvW10gPSBbXTtcclxuICAgIC8qKiBVSeW+heaJk+W8gOWIl+ihqCAqL1xyXG4gICAgcHJpdmF0ZSBVSU9wZW5RdWV1ZTogVUlJbmZvW10gPSBbXTtcclxuICAgIC8qKiBVSeW+heWFs+mXreWIl+ihqCAqL1xyXG4gICAgcHJpdmF0ZSBVSUNsb3NlUXVldWU6IFVJVmlld1tdID0gW107XHJcbiAgICAvKiogVUnphY3nva4gKi9cclxuICAgIHByaXZhdGUgVUlDb25mOiB7IFtrZXk6IG51bWJlcl06IFVJQ29uZiB9ID0ge307XHJcblxyXG4gICAgLyoqIFVJ5omT5byA5YmN5Zue6LCDICovXHJcbiAgICBwdWJsaWMgdWlPcGVuQmVmb3JlRGVsZWdhdGU6ICh1aUlkOiBudW1iZXIsIHByZVVJSWQ6IG51bWJlcikgPT4gdm9pZCA9IG51bGw7XHJcbiAgICAvKiogVUnmiZPlvIDlm57osIMgKi9cclxuICAgIHB1YmxpYyB1aU9wZW5EZWxlZ2F0ZTogKHVpSWQ6IG51bWJlciwgcHJlVUlJZDogbnVtYmVyKSA9PiB2b2lkID0gbnVsbDtcclxuICAgIC8qKiBVSeWFs+mXreWbnuiwgyAqL1xyXG4gICAgcHVibGljIHVpQ2xvc2VEZWxlZ2F0ZTogKHVpSWQ6IG51bWJlcikgPT4gdm9pZCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbmiYDmnIlVSeeahOmFjee9ruWvueixoVxyXG4gICAgICogQHBhcmFtIGNvbmYg6YWN572u5a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbml0VUlDb25mKGNvbmY6IHsgW2tleTogbnVtYmVyXTogVUlDb25mIH0pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLlVJQ29uZiA9IGNvbmY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7miJbopobnm5bmn5B1aUlk55qE6YWN572uXHJcbiAgICAgKiBAcGFyYW0gdWlJZCDopoHorr7nva7nmoTnlYzpnaJpZFxyXG4gICAgICogQHBhcmFtIGNvbmYg6KaB6K6+572u55qE6YWN572uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRVSUNvbmYodWlJZDogbnVtYmVyLCBjb25mOiBVSUNvbmYpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLlVJQ29uZlt1aUlkXSA9IGNvbmY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqKiDnp4HmnInmlrnms5XvvIxVSU1hbmFnZXLlhoXpg6jnmoTlip/og73lkozln7rnoYDop4TliJkgKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOmYsuinpuaRuOWxglxyXG4gICAgICogQHBhcmFtIHpPcmRlciDlsY/olL3lsYLnmoTlsYLnuqdcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBwcmV2ZW50VG91Y2goek9yZGVyOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgbm9kZSA9IG5ldyBjYy5Ob2RlKClcclxuICAgICAgICBub2RlLm5hbWUgPSAncHJldmVudFRvdWNoJztcclxuICAgICAgICBub2RlLnNldENvbnRlbnRTaXplKGNjLndpblNpemUpO1xyXG4gICAgICAgIG5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIGZ1bmN0aW9uIChldmVudDogY2MuRXZlbnQuRXZlbnRDdXN0b20pIHtcclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfSwgbm9kZSk7XHJcbiAgICAgICAgbGV0IGNoaWxkID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZSgnQ2FudmFzJyk7XHJcbiAgICAgICAgY2hpbGQuYWRkQ2hpbGQobm9kZSwgek9yZGVyKTtcclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog6Ieq5Yqo5omn6KGM5LiL5LiA5Liq5b6F5YWz6Zet5oiW5b6F5omT5byA55qE55WM6Z2iICovXHJcbiAgICBwcml2YXRlIGF1dG9FeGVjTmV4dFVJKCkge1xyXG4gICAgICAgIC8vIOmAu+i+keS4iuaYr+WFiOWFs+WQjuW8gFxyXG4gICAgICAgIGlmICh0aGlzLlVJQ2xvc2VRdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCB1aVF1ZXVlSW5mbyA9IHRoaXMuVUlDbG9zZVF1ZXVlWzBdO1xyXG4gICAgICAgICAgICB0aGlzLlVJQ2xvc2VRdWV1ZS5zcGxpY2UoMCwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UodWlRdWV1ZUluZm8pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5VSU9wZW5RdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCB1aVF1ZXVlSW5mbyA9IHRoaXMuVUlPcGVuUXVldWVbMF07XHJcbiAgICAgICAgICAgIHRoaXMuVUlPcGVuUXVldWUuc3BsaWNlKDAsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLm9wZW4odWlRdWV1ZUluZm8udWlJZCwgdWlRdWV1ZUluZm8udWlBcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoh6rliqjmo4DmtYvliqjnlLvnu4Tku7bku6Xlj4rnibnlrprliqjnlLvvvIzlpoLlrZjlnKjliJnmkq3mlL7liqjnlLvvvIzml6DorrrliqjnlLvmmK/lkKbmkq3mlL7vvIzpg73miafooYzlm57osINcclxuICAgICAqIEBwYXJhbSBhbmlOYW1lIOWKqOeUu+WQjVxyXG4gICAgICogQHBhcmFtIGFuaU92ZXJDYWxsYmFjayDliqjnlLvmkq3mlL7lrozmiJDlm57osINcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhdXRvRXhlY0FuaW1hdGlvbih1aVZpZXc6IFVJVmlldywgYW5pTmFtZTogc3RyaW5nLCBhbmlPdmVyQ2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcclxuICAgICAgICAvLyDmmoLml7blhYjnnIHnlaXliqjnlLvmkq3mlL7nmoTpgLvovpFcclxuICAgICAgICBhbmlPdmVyQ2FsbGJhY2soKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiHquWKqOajgOa1i+i1hOa6kOmihOWKoOi9vee7hOS7tu+8jOWmguaenOWtmOWcqOWImeWKoOi9veWujOaIkOWQjuiwg+eUqGNvbXBsZXRlQ2FsbGJhY2vvvIzlkKbliJnnm7TmjqXosIPnlKhcclxuICAgICAqIEBwYXJhbSBjb21wbGV0ZUNhbGxiYWNrIOi1hOa6kOWKoOi9veWujOaIkOWbnuiwg1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGF1dG9Mb2FkUmVzKHVpVmlldzogVUlWaWV3LCBjb21wbGV0ZUNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgLy8g5pqC5pe25YWI55yB55WlXHJcbiAgICAgICAgY29tcGxldGVDYWxsYmFjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDnlJ/miJDllK/kuIDnmoTotYTmupDljaDnlKhrZXkgKi9cclxuICAgIHByaXZhdGUgbWFrZVVzZUtleSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgVUlNZ3JfJHsrK3RoaXMudXNlQ291bnR9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKiog5qC55o2u55WM6Z2i5pi+56S657G75Z6L5Yi35paw5pi+56S6ICovXHJcbiAgICBwcml2YXRlIHVwZGF0ZVVJKCkge1xyXG4gICAgICAgIGxldCBoaWRlSW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IHNob3dJbmRleDogbnVtYmVyID0gdGhpcy5VSVN0YWNrLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgZm9yICg7IHNob3dJbmRleCA+PSAwOyAtLXNob3dJbmRleCkge1xyXG4gICAgICAgICAgICBsZXQgbW9kZSA9IHRoaXMuVUlTdGFja1tzaG93SW5kZXhdLnVpVmlldy5zaG93VHlwZTtcclxuICAgICAgICAgICAgLy8g5peg6K665L2V56eN5qih5byP77yM5pyA6aG26YOo55qEVUnpg73mmK/lupTor6XmmL7npLrnmoRcclxuICAgICAgICAgICAgdGhpcy5VSVN0YWNrW3Nob3dJbmRleF0udWlWaWV3Lm5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKFVJU2hvd1R5cGVzLlVJRnVsbFNjcmVlbiA9PSBtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChVSVNob3dUeXBlcy5VSVNpbmdsZSA9PSBtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuQmFja0dyb3VuZFVJOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5VSVN0YWNrW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVUlTdGFja1tpXS51aVZpZXcubm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhpZGVJbmRleCA9IHRoaXMuQmFja0dyb3VuZFVJO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g6ZqQ6JeP5LiN5bqU6K+l5pi+56S655qE6YOo5YiGVUlcclxuICAgICAgICBmb3IgKGxldCBoaWRlOiBudW1iZXIgPSBoaWRlSW5kZXg7IGhpZGUgPCBzaG93SW5kZXg7ICsraGlkZSkge1xyXG4gICAgICAgICAgICB0aGlzLlVJU3RhY2tbaGlkZV0udWlWaWV3Lm5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5byC5q2l5Yqg6L295LiA5LiqVUnnmoRwcmVmYWLvvIzmiJDlip/liqDovb3kuobkuIDkuKpwcmVmYWLkuYvlkI5cclxuICAgICAqIEBwYXJhbSB1aUlkIOeVjOmdomlkXHJcbiAgICAgKiBAcGFyYW0gcHJvY2Vzc0NhbGxiYWNrIOWKoOi9vei/m+W6puWbnuiwg1xyXG4gICAgICogQHBhcmFtIGNvbXBsZXRlQ2FsbGJhY2sg5Yqg6L295a6M5oiQ5Zue6LCDXHJcbiAgICAgKiBAcGFyYW0gdWlBcmdzIOWIneWni+WMluWPguaVsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldE9yQ3JlYXRlVUkodWlJZDogbnVtYmVyLCBwcm9jZXNzQ2FsbGJhY2s6IFByb2Nlc3NDYWxsYmFjaywgY29tcGxldGVDYWxsYmFjazogKHVpVmlldzogVUlWaWV3KSA9PiB2b2lkLCB1aUFyZ3M6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIC8vIOWmguaenOaJvuWIsOe8k+WtmOWvueixoe+8jOWImeebtOaOpei/lOWbnlxyXG4gICAgICAgIGxldCB1aVZpZXc6IFVJVmlldyA9IHRoaXMuVUlDYWNoZVt1aUlkXTtcclxuICAgICAgICBpZiAodWlWaWV3KSB7XHJcbiAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sodWlWaWV3KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5om+5YiwVUnphY3nva5cclxuICAgICAgICBsZXQgdWlQYXRoID0gdGhpcy5VSUNvbmZbdWlJZF0ucHJlZmFiO1xyXG4gICAgICAgIGlmIChudWxsID09IHVpUGF0aCkge1xyXG4gICAgICAgICAgICBjYy5sb2coYGdldE9yQ3JlYXRlVUkgJHt1aUlkfSBmYWlsZSwgcHJlZmFiIGNvbmYgbm90IGZvdW5kIWApO1xyXG4gICAgICAgICAgICBjb21wbGV0ZUNhbGxiYWNrKG51bGwpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdXNlS2V5ID0gdGhpcy5tYWtlVXNlS2V5KCk7XHJcbiAgICAgICAgcmVzTG9hZGVyLmxvYWQodWlQYXRoLCBwcm9jZXNzQ2FsbGJhY2ssIChlcnI6IEVycm9yLCBwcmVmYWI6IGNjLlByZWZhYikgPT4ge1xyXG4gICAgICAgICAgICAvLyDmo4Dmn6XliqDovb3otYTmupDplJnor69cclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY2MubG9nKGBnZXRPckNyZWF0ZVVJIGxvYWRSZXMgJHt1aUlkfSBmYWlsZSwgcGF0aDogJHt1aVBhdGh9IGVycm9yOiAke2Vycn1gKTtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sobnVsbCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g5qOA5p+l5a6e5L6L5YyW6ZSZ6K+vXHJcbiAgICAgICAgICAgIGxldCB1aU5vZGU6IGNjLk5vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSB1aU5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNjLmxvZyhgZ2V0T3JDcmVhdGVVSSBpbnN0YW50aWF0ZSAke3VpSWR9IGZhaWxlLCBwYXRoOiAke3VpUGF0aH1gKTtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sobnVsbCk7XHJcbiAgICAgICAgICAgICAgICByZXNMb2FkZXIucmVsZWFzZShwcmVmYWIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIOajgOafpee7hOS7tuiOt+WPlumUmeivr1xyXG4gICAgICAgICAgICB1aVZpZXcgPSB1aU5vZGUuZ2V0Q29tcG9uZW50KFVJVmlldyk7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHVpVmlldykge1xyXG4gICAgICAgICAgICAgICAgY2MubG9nKGBnZXRPckNyZWF0ZVVJIGdldENvbXBvbmVudCAke3VpSWR9IGZhaWxlLCBwYXRoOiAke3VpUGF0aH1gKTtcclxuICAgICAgICAgICAgICAgIHVpTm9kZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZUNhbGxiYWNrKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgcmVzTG9hZGVyLnJlbGVhc2UocHJlZmFiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDlvILmraXliqDovb1VSemihOWKoOi9veeahOi1hOa6kFxyXG4gICAgICAgICAgICB0aGlzLmF1dG9Mb2FkUmVzKHVpVmlldywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdWlWaWV3LmluaXQodWlBcmdzKTtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sodWlWaWV3KTtcclxuICAgICAgICAgICAgICAgIHVpVmlldy5jYWNoZUFzc2V0KHByZWZhYik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVSeiiq+aJk+W8gOaXtuWbnuiwg++8jOWvuVVJ6L+b6KGM5Yid5aeL5YyW6K6+572u77yM5Yi35paw5YW25LuW55WM6Z2i55qE5pi+56S677yM5bm25qC55o2uXHJcbiAgICAgKiBAcGFyYW0gdWlJZCDlk6rkuKrnlYzpnaLooqvmiZPlvIDkuoZcclxuICAgICAqIEBwYXJhbSB1aVZpZXcg55WM6Z2i5a+56LGhXHJcbiAgICAgKiBAcGFyYW0gdWlJbmZvIOeVjOmdouagiOWvueW6lOeahOS/oeaBr+e7k+aehFxyXG4gICAgICogQHBhcmFtIHVpQXJncyDnlYzpnaLliJ3lp4vljJblj4LmlbBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBvblVJT3Blbih1aUlkOiBudW1iZXIsIHVpVmlldzogVUlWaWV3LCB1aUluZm86IFVJSW5mbywgdWlBcmdzOiBhbnkpIHtcclxuICAgICAgICBpZiAobnVsbCA9PSB1aVZpZXcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDmv4DmtLvnlYzpnaJcclxuICAgICAgICB1aUluZm8udWlWaWV3ID0gdWlWaWV3O1xyXG4gICAgICAgIHVpVmlldy5ub2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdWlWaWV3Lm5vZGUuekluZGV4ID0gdWlJbmZvLnpPcmRlciB8fCB0aGlzLlVJU3RhY2subGVuZ3RoXHJcblxyXG4gICAgICAgIC8vIOW/q+mAn+WFs+mXreeVjOmdoueahOiuvue9ru+8jOe7keWumueVjOmdouS4reeahGJhY2tncm91bmTvvIzlrp7njrDlv6vpgJ/lhbPpl61cclxuICAgICAgICBpZiAodWlWaWV3LnF1aWNrQ2xvc2UpIHtcclxuICAgICAgICAgICAgbGV0IGJhY2tHcm91bmQgPSB1aVZpZXcubm9kZS5nZXRDaGlsZEJ5TmFtZSgnYmFja2dyb3VuZCcpO1xyXG4gICAgICAgICAgICBpZiAoIWJhY2tHcm91bmQpIHtcclxuICAgICAgICAgICAgICAgIGJhY2tHcm91bmQgPSBuZXcgY2MuTm9kZSgpXHJcbiAgICAgICAgICAgICAgICBiYWNrR3JvdW5kLm5hbWUgPSAnYmFja2dyb3VuZCc7XHJcbiAgICAgICAgICAgICAgICBiYWNrR3JvdW5kLnNldENvbnRlbnRTaXplKGNjLndpblNpemUpO1xyXG4gICAgICAgICAgICAgICAgdWlWaWV3Lm5vZGUuYWRkQ2hpbGQoYmFja0dyb3VuZCwgLTEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJhY2tHcm91bmQudGFyZ2V0T2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJUKTtcclxuICAgICAgICAgICAgYmFja0dyb3VuZC5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgKGV2ZW50OiBjYy5FdmVudC5FdmVudEN1c3RvbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKHVpVmlldyk7XHJcbiAgICAgICAgICAgIH0sIGJhY2tHcm91bmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5re75Yqg5Yiw5Zy65pmv5LitXHJcbiAgICAgICAgbGV0IGNoaWxkID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZSgnQ2FudmFzJyk7XHJcbiAgICAgICAgY2hpbGQuYWRkQ2hpbGQodWlWaWV3Lm5vZGUpO1xyXG5cclxuICAgICAgICAvLyDliLfmlrDlhbbku5ZVSVxyXG4gICAgICAgIHRoaXMudXBkYXRlVUkoKTtcclxuXHJcbiAgICAgICAgLy8g5LuO6YKj5Liq55WM6Z2i5omT5byA55qEXHJcbiAgICAgICAgbGV0IGZyb21VSUlEID0gMDtcclxuICAgICAgICBpZiAodGhpcy5VSVN0YWNrLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgZnJvbVVJSUQgPSB0aGlzLlVJU3RhY2tbdGhpcy5VSVN0YWNrLmxlbmd0aCAtIDJdLnVpSWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOaJk+W8gOeVjOmdouS5i+WJjeWbnuiwg1xyXG4gICAgICAgIGlmICh0aGlzLnVpT3BlbkJlZm9yZURlbGVnYXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudWlPcGVuQmVmb3JlRGVsZWdhdGUodWlJZCwgZnJvbVVJSUQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5omn6KGMb25PcGVu5Zue6LCDXHJcbiAgICAgICAgdWlWaWV3Lm9uT3Blbihmcm9tVUlJRCwgdWlBcmdzKTtcclxuICAgICAgICB0aGlzLmF1dG9FeGVjQW5pbWF0aW9uKHVpVmlldywgXCJ1aU9wZW5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB1aVZpZXcub25PcGVuQW5pT3ZlcigpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy51aU9wZW5EZWxlZ2F0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51aU9wZW5EZWxlZ2F0ZSh1aUlkLCBmcm9tVUlJRCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog5omT5byA55WM6Z2i5bm25re75Yqg5Yiw55WM6Z2i5qCI5LitICovXHJcbiAgICBwdWJsaWMgb3Blbih1aUlkOiBudW1iZXIsIHVpQXJnczogYW55ID0gbnVsbCwgcHJvZ3Jlc3NDYWxsYmFjazogUHJvY2Vzc0NhbGxiYWNrID0gbnVsbCk6IHZvaWQge1xyXG4gICAgICAgIGxldCB1aUluZm86IFVJSW5mbyA9IHtcclxuICAgICAgICAgICAgdWlJZDogdWlJZCxcclxuICAgICAgICAgICAgdWlBcmdzOiB1aUFyZ3MsXHJcbiAgICAgICAgICAgIHVpVmlldzogbnVsbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzT3BlbmluZyB8fCB0aGlzLmlzQ2xvc2luZykge1xyXG4gICAgICAgICAgICAvLyDmj5LlhaXlvoXmiZPlvIDpmJ/liJdcclxuICAgICAgICAgICAgdGhpcy5VSU9wZW5RdWV1ZS5wdXNoKHVpSW5mbyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB1aUluZGV4ID0gdGhpcy5nZXRVSUluZGV4KHVpSWQpO1xyXG4gICAgICAgIGlmICgtMSAhPSB1aUluZGV4KSB7XHJcbiAgICAgICAgICAgIC8vIOmHjeWkjeaJk+W8gOS6huWQjOS4gOS4queVjOmdou+8jOebtOaOpeWbnuWIsOivpeeVjOmdolxyXG4gICAgICAgICAgICB0aGlzLmNsb3NlVG9VSSh1aUlkLCB1aUFyZ3MpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDorr7nva5VSeeahHpPcmRlclxyXG4gICAgICAgIHVpSW5mby56T3JkZXIgPSB0aGlzLlVJU3RhY2subGVuZ3RoICsgMTtcclxuICAgICAgICB0aGlzLlVJU3RhY2sucHVzaCh1aUluZm8pO1xyXG5cclxuICAgICAgICAvLyDlhYjlsY/olL3ngrnlh7tcclxuICAgICAgICBpZiAodGhpcy5VSUNvbmZbdWlJZF0ucHJldmVudFRvdWNoKSB7XHJcbiAgICAgICAgICAgIHVpSW5mby5wcmV2ZW50Tm9kZSA9IHRoaXMucHJldmVudFRvdWNoKHVpSW5mby56T3JkZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pc09wZW5pbmcgPSB0cnVlO1xyXG4gICAgICAgIC8vIOmihOWKoOi9vei1hOa6kO+8jOW5tuWcqOi1hOa6kOWKoOi9veWujOaIkOWQjuiHquWKqOaJk+W8gOeVjOmdolxyXG4gICAgICAgIHRoaXMuZ2V0T3JDcmVhdGVVSSh1aUlkLCBwcm9ncmVzc0NhbGxiYWNrLCAodWlWaWV3OiBVSVZpZXcpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgLy8g5aaC5p6c55WM6Z2i5bey57uP6KKr5YWz6Zet5oiW5Yib5bu65aSx6LSlXHJcbiAgICAgICAgICAgIGlmICh1aUluZm8uaXNDbG9zZSB8fCBudWxsID09IHVpVmlldykge1xyXG4gICAgICAgICAgICAgICAgY2MubG9nKGBnZXRPckNyZWF0ZVVJICR7dWlJZH0gZmFpbGUhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlIHN0YXRlIDogJHt1aUluZm8uaXNDbG9zZX0gLCB1aVZpZXcgOiAke3VpVmlld31gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNPcGVuaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAodWlJbmZvLnByZXZlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdWlJbmZvLnByZXZlbnROb2RlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICB1aUluZm8ucHJldmVudE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDmiZPlvIBVSe+8jOaJp+ihjOmFjee9rlxyXG4gICAgICAgICAgICB0aGlzLm9uVUlPcGVuKHVpSWQsIHVpVmlldywgdWlJbmZvLCB1aUFyZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLmlzT3BlbmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmF1dG9FeGVjTmV4dFVJKCk7XHJcbiAgICAgICAgfSwgdWlBcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog5pu/5o2i5qCI6aG255WM6Z2iICovXHJcbiAgICBwdWJsaWMgcmVwbGFjZSh1aUlkOiBudW1iZXIsIHVpQXJnczogYW55ID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMuY2xvc2UodGhpcy5VSVN0YWNrW3RoaXMuVUlTdGFjay5sZW5ndGggLSAxXS51aVZpZXcpO1xyXG4gICAgICAgIHRoaXMub3Blbih1aUlkLCB1aUFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWz6Zet5b2T5YmN55WM6Z2iXHJcbiAgICAgKiBAcGFyYW0gY2xvc2VVSSDopoHlhbPpl63nmoTnlYzpnaJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsb3NlKGNsb3NlVUk/OiBVSVZpZXcpIHtcclxuICAgICAgICBsZXQgdWlDb3VudCA9IHRoaXMuVUlTdGFjay5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHVpQ291bnQgPCAxIHx8IHRoaXMuaXNDbG9zaW5nIHx8IHRoaXMuaXNPcGVuaW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChjbG9zZVVJKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDmj5LlhaXlvoXlhbPpl63pmJ/liJdcclxuICAgICAgICAgICAgICAgIHRoaXMuVUlDbG9zZVF1ZXVlLnB1c2goY2xvc2VVSSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHVpSW5mbzogVUlJbmZvO1xyXG4gICAgICAgIGlmIChjbG9zZVVJKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gdGhpcy5VSVN0YWNrLmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcclxuICAgICAgICAgICAgICAgIGxldCB1aSA9IHRoaXMuVUlTdGFja1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICBpZiAodWkudWlWaWV3ID09PSBjbG9zZVVJKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdWlJbmZvID0gdWk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5VSVN0YWNrLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g5om+5LiN5Yiw6L+Z5LiqVUlcclxuICAgICAgICAgICAgaWYgKHVpSW5mbyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1aUluZm8gPSB0aGlzLlVJU3RhY2sucG9wKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDlhbPpl63lvZPliY3nlYzpnaJcclxuICAgICAgICBsZXQgdWlJZCA9IHVpSW5mby51aUlkO1xyXG4gICAgICAgIGxldCB1aVZpZXcgPSB1aUluZm8udWlWaWV3O1xyXG4gICAgICAgIHVpSW5mby5pc0Nsb3NlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8g5Zue5pS26YGu572p5bGCXHJcbiAgICAgICAgaWYgKHVpSW5mby5wcmV2ZW50Tm9kZSkge1xyXG4gICAgICAgICAgICB1aUluZm8ucHJldmVudE5vZGUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB1aUluZm8ucHJldmVudE5vZGUgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG51bGwgPT0gdWlWaWV3KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBwcmVVSUluZm8gPSB0aGlzLlVJU3RhY2tbdWlDb3VudCAtIDJdO1xyXG4gICAgICAgIC8vIOWkhOeQhuaYvuekuuaooeW8j1xyXG4gICAgICAgIHRoaXMudXBkYXRlVUkoKTtcclxuICAgICAgICBsZXQgY2xvc2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNDbG9zaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vIOaYvuekuuS5i+WJjeeahOeVjOmdolxyXG4gICAgICAgICAgICBpZiAocHJlVUlJbmZvICYmIHByZVVJSW5mby51aVZpZXcgJiYgdGhpcy5pc1RvcFVJKHByZVVJSW5mby51aUlkKSkge1xyXG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5LmL5YmN55qE55WM6Z2i5by55Yiw5LqG5pyA5LiK5pa577yI5Lit6Ze05pyJ6IKv6IO95omT5byA5LqG5YW25LuW55WM6Z2i77yJXHJcbiAgICAgICAgICAgICAgICBwcmVVSUluZm8udWlWaWV3Lm5vZGUuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgLy8g5Zue6LCDb25Ub3BcclxuICAgICAgICAgICAgICAgIHByZVVJSW5mby51aVZpZXcub25Ub3AodWlJZCwgdWlWaWV3Lm9uQ2xvc2UoKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1aVZpZXcub25DbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy51aUNsb3NlRGVsZWdhdGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudWlDbG9zZURlbGVnYXRlKHVpSWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh1aVZpZXcuY2FjaGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuVUlDYWNoZVt1aUlkXSA9IHVpVmlldztcclxuICAgICAgICAgICAgICAgIHVpVmlldy5ub2RlLnJlbW92ZUZyb21QYXJlbnQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgY2MubG9nKGB1aVZpZXcgcmVtb3ZlRnJvbVBhcmVudCAke3VpSW5mby51aUlkfWApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdWlWaWV3LnJlbGVhc2VBc3NldHMoKTtcclxuICAgICAgICAgICAgICAgIHVpVmlldy5ub2RlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIGNjLmxvZyhgdWlWaWV3IGRlc3Ryb3kgJHt1aUluZm8udWlJZH1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmF1dG9FeGVjTmV4dFVJKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOaJp+ihjOWFs+mXreWKqOeUu1xyXG4gICAgICAgIHRoaXMuYXV0b0V4ZWNBbmltYXRpb24odWlWaWV3LCBcInVpQ2xvc2VcIiwgY2xvc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDlhbPpl63miYDmnInnlYzpnaIgKi9cclxuICAgIHB1YmxpYyBjbG9zZUFsbCgpIHtcclxuICAgICAgICAvLyDkuI3mkq3mlL7liqjnlLvvvIzkuZ/kuI3muIXnkIbnvJPlrZhcclxuICAgICAgICBmb3IgKGNvbnN0IHVpSW5mbyBvZiB0aGlzLlVJU3RhY2spIHtcclxuICAgICAgICAgICAgdWlJbmZvLmlzQ2xvc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAodWlJbmZvLnByZXZlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1aUluZm8ucHJldmVudE5vZGUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgdWlJbmZvLnByZXZlbnROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodWlJbmZvLnVpVmlldykge1xyXG4gICAgICAgICAgICAgICAgdWlJbmZvLnVpVmlldy5vbkNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB1aUluZm8udWlWaWV3LnJlbGVhc2VBc3NldHMoKTtcclxuICAgICAgICAgICAgICAgIHVpSW5mby51aVZpZXcubm9kZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5VSU9wZW5RdWV1ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMuVUlDbG9zZVF1ZXVlID0gW107XHJcbiAgICAgICAgdGhpcy5VSVN0YWNrID0gW107XHJcbiAgICAgICAgdGhpcy5pc09wZW5pbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmlzQ2xvc2luZyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWz6Zet55WM6Z2i77yM5LiA55u05YWz6Zet5Yiw6aG26YOo5Li6dWlJZOeahOeVjOmdou+8jOS4uumBv+WFjeW+queOr+aJk+W8gFVJ5a+86Ie0VUnmoIjmuqLlh7pcclxuICAgICAqIEBwYXJhbSB1aUlkIOimgeWFs+mXreWIsOeahHVpSWTvvIjlhbPpl63lhbbpobbpg6jnmoR1ae+8iVxyXG4gICAgICogQHBhcmFtIHVpQXJncyDmiZPlvIDnmoTlj4LmlbBcclxuICAgICAqIEBwYXJhbSBiT3BlblNlbGYgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbG9zZVRvVUkodWlJZDogbnVtYmVyLCB1aUFyZ3M6IGFueSwgYk9wZW5TZWxmID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgICAgIGxldCBpZHggPSB0aGlzLmdldFVJSW5kZXgodWlJZCk7XHJcbiAgICAgICAgaWYgKC0xID09IGlkeCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZHggPSBiT3BlblNlbGYgPyBpZHggOiBpZHggKyAxO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLlVJU3RhY2subGVuZ3RoIC0gMTsgaSA+PSBpZHg7IC0taSkge1xyXG4gICAgICAgICAgICBsZXQgdWlJbmZvID0gdGhpcy5VSVN0YWNrLnBvcCgpO1xyXG4gICAgICAgICAgICBsZXQgdWlJZCA9IHVpSW5mby51aUlkO1xyXG4gICAgICAgICAgICBsZXQgdWlWaWV3ID0gdWlJbmZvLnVpVmlldztcclxuICAgICAgICAgICAgdWlJbmZvLmlzQ2xvc2UgPSB0cnVlXHJcblxyXG4gICAgICAgICAgICAvLyDlm57mlLblsY/olL3lsYJcclxuICAgICAgICAgICAgaWYgKHVpSW5mby5wcmV2ZW50Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdWlJbmZvLnByZXZlbnROb2RlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHVpSW5mby5wcmV2ZW50Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVpQ2xvc2VEZWxlZ2F0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51aUNsb3NlRGVsZWdhdGUodWlJZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh1aVZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHVpVmlldy5vbkNsb3NlKClcclxuICAgICAgICAgICAgICAgIGlmICh1aVZpZXcuY2FjaGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlVJQ2FjaGVbdWlJZF0gPSB1aVZpZXc7XHJcbiAgICAgICAgICAgICAgICAgICAgdWlWaWV3Lm5vZGUucmVtb3ZlRnJvbVBhcmVudChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHVpVmlldy5yZWxlYXNlQXNzZXRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdWlWaWV3Lm5vZGUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVVJKCk7XHJcbiAgICAgICAgdGhpcy5VSU9wZW5RdWV1ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMuVUlDbG9zZVF1ZXVlID0gW107XHJcbiAgICAgICAgYk9wZW5TZWxmICYmIHRoaXMub3Blbih1aUlkLCB1aUFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDmuIXnkIbnlYzpnaLnvJPlrZggKi9cclxuICAgIHB1YmxpYyBjbGVhckNhY2hlKCk6IHZvaWQge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuVUlDYWNoZSkge1xyXG4gICAgICAgICAgICBsZXQgdWkgPSB0aGlzLlVJQ2FjaGVba2V5XTtcclxuICAgICAgICAgICAgaWYgKGNjLmlzVmFsaWQodWkubm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYy5pc1ZhbGlkKHVpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVpLnJlbGVhc2VBc3NldHMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHVpLm5vZGUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuVUlDYWNoZSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqKioqKiBVSeeahOS+v+aNt+aOpeWPoyAqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgcHVibGljIGlzVG9wVUkodWlJZCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLlVJU3RhY2subGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5VSVN0YWNrW3RoaXMuVUlTdGFjay5sZW5ndGggLSAxXS51aUlkID09IHVpSWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFVJKHVpSWQ6IG51bWJlcik6IFVJVmlldyB7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuVUlTdGFjay5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuVUlTdGFja1tpbmRleF07XHJcbiAgICAgICAgICAgIGlmICh1aUlkID09IGVsZW1lbnQudWlJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudWlWaWV3O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRUb3BVSSgpOiBVSVZpZXcge1xyXG4gICAgICAgIGlmICh0aGlzLlVJU3RhY2subGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5VSVN0YWNrW3RoaXMuVUlTdGFjay5sZW5ndGggLSAxXS51aVZpZXc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRVSUluZGV4KHVpSWQ6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuVUlTdGFjay5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuVUlTdGFja1tpbmRleF07XHJcbiAgICAgICAgICAgIGlmICh1aUlkID09IGVsZW1lbnQudWlJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGxldCB1aU1hbmFnZXI6IFVJTWFuYWdlciA9IG5ldyBVSU1hbmFnZXIoKTsiXX0=
//------QC-SOURCE-SPLIT------

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvbmV0d29yay9OZXROb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLElBQVksV0FJWDtBQUpELFdBQVksV0FBVztJQUNuQix5REFBVSxDQUFBO0lBQ1YsNkRBQVksQ0FBQTtJQUNaLHlEQUFVLENBQUE7QUFDZCxDQUFDLEVBSlcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFJdEI7QUFFRCxJQUFZLFlBS1g7QUFMRCxXQUFZLFlBQVk7SUFDcEIsbURBQU0sQ0FBQTtJQUNOLDJEQUFVLENBQUE7SUFDVix1REFBUSxDQUFBO0lBQ1IscURBQU8sQ0FBQTtBQUNYLENBQUMsRUFMVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUt2QjtBQVNEO0lBQUE7UUFDYyxvQkFBZSxHQUFzQixJQUFJLENBQUM7UUFDMUMsbUJBQWMsR0FBVyxDQUFDLENBQUM7UUFDM0Isa0JBQWEsR0FBWSxLQUFLLENBQUMsQ0FBK0IsZUFBZTtRQUM3RSxrQkFBYSxHQUFZLEtBQUssQ0FBQyxDQUErQixnQkFBZ0I7UUFDOUUsV0FBTSxHQUFpQixZQUFZLENBQUMsTUFBTSxDQUFDLENBQW1CLFNBQVM7UUFDdkUsWUFBTyxHQUFZLElBQUksQ0FBQyxDQUFzQywrQ0FBK0M7UUFFN0csaUJBQVksR0FBaUIsSUFBSSxDQUFDLENBQTRCLHlCQUF5QjtRQUN2RixvQkFBZSxHQUFvQixJQUFJLENBQUMsQ0FBc0IsUUFBUTtRQUN0RSx1QkFBa0IsR0FBYyxJQUFJLENBQUMsQ0FBeUIsU0FBUztRQUN2RSx3QkFBbUIsR0FBYSxJQUFJLENBQUMsQ0FBeUIsT0FBTztRQUNyRSxzQkFBaUIsR0FBaUIsSUFBSSxDQUFDLENBQXVCLE9BQU87UUFFckUsb0JBQWUsR0FBUSxJQUFJLENBQUMsQ0FBa0MsUUFBUTtRQUN0RSxxQkFBZ0IsR0FBUSxJQUFJLENBQUMsQ0FBaUMsVUFBVTtRQUN4RSxvQkFBZSxHQUFRLElBQUksQ0FBQyxDQUFrQyxRQUFRO1FBQ3RFLGVBQVUsR0FBVyxLQUFLLENBQUMsQ0FBbUMsT0FBTztRQUNyRSxpQkFBWSxHQUFXLE9BQU8sQ0FBQyxDQUErQixZQUFZO1FBQzFFLHFCQUFnQixHQUFXLE9BQU8sQ0FBQyxDQUEyQixPQUFPO1FBQ3JFLGNBQVMsR0FBb0IsS0FBSyxFQUFpQixDQUFDLENBQVUsT0FBTztRQUNyRSxjQUFTLEdBQXdDLEVBQUUsQ0FBQSxDQUFXLFFBQVE7SUE4VXBGLENBQUM7SUE1VUcscURBQXFEO0lBQzlDLHNCQUFJLEdBQVgsVUFBWSxNQUFlLEVBQUUsUUFBeUIsRUFBRSxXQUF1QixFQUFFLFFBQThCO1FBQXZELDRCQUFBLEVBQUEsa0JBQXVCO1FBQUUseUJBQUEsRUFBQSxlQUE4QjtRQUMzRyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDaEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFDLFFBQXdCLEVBQUUsTUFBZTtZQUNyRixRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUE7SUFDTCxDQUFDO0lBRU0seUJBQU8sR0FBZCxVQUFlLE9BQTBCO1FBQ3JDLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDcEQsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUNyQjtZQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQztZQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbEQsT0FBTyxLQUFLLENBQUM7YUFDaEI7WUFFRCxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxFQUFFO2dCQUM5QixJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7YUFDL0M7WUFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQztZQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakQsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFUyw0QkFBVSxHQUFwQjtRQUFBLGlCQU1DO1FBTEcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsVUFBQyxLQUFLLElBQU8sS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxVQUFDLEdBQUcsSUFBTyxLQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLFVBQUMsS0FBSyxJQUFPLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsVUFBQyxLQUFLLElBQU8sS0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztJQUM5QixDQUFDO0lBRVMsK0JBQWEsR0FBdkIsVUFBd0IsUUFBcUIsRUFBRSxNQUFlO1FBQzFELElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNuQixJQUFJLFFBQVEsSUFBSSxXQUFXLENBQUMsVUFBVSxFQUFFO2dCQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN6QztpQkFBTSxJQUFJLFFBQVEsSUFBSSxXQUFXLENBQUMsVUFBVSxFQUFFO2dCQUMzQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN6QztpQkFBTSxJQUFJLFFBQVEsSUFBSSxXQUFXLENBQUMsWUFBWSxFQUFFO2dCQUM3QyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUMzQztTQUNKO0lBQ0wsQ0FBQztJQUVELFNBQVM7SUFDQyw2QkFBVyxHQUFyQixVQUFzQixLQUFLO1FBQTNCLGlCQVdDO1FBVkcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO1FBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLGdDQUFnQztRQUNoQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsS0FBSyxJQUFJLEVBQUU7WUFDbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFRLEtBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZEO2FBQU07WUFDSCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDcEI7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ04sMkJBQVMsR0FBbkI7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUE7UUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDO1FBQ25DLGdCQUFnQjtRQUNoQixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXBELFVBQVU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sYUFBVSxDQUFDLENBQUE7UUFDN0QsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHO2dCQUN4QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzlCLElBQUksR0FBRyxDQUFDLFNBQVMsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7b0JBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDL0I7cUJBQU07b0JBQ0gsRUFBRSxDQUFDLENBQUM7aUJBQ1A7YUFDSjtZQUNELHNCQUFzQjtZQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDdkU7SUFDTCxDQUFDO0lBRUQsY0FBYztJQUNKLDJCQUFTLEdBQW5CLFVBQW9CLEdBQUc7UUFDbkIsNERBQTREO1FBQzVELHlCQUF5QjtRQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDekMsT0FBTyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3pDLE9BQU87U0FDVjtRQUNELG1CQUFtQjtRQUNuQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM1QixXQUFXO1FBQ1gsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsU0FBUztRQUNULElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDcEQsZ0JBQWdCO1FBQ2hCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLEtBQUssSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDL0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakMsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLE1BQU0sRUFBRTtvQkFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBa0MsTUFBUSxDQUFDLENBQUM7b0JBQ3hELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMzQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzNDLE1BQU07aUJBQ1Q7YUFDSjtZQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXFCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxxQkFBa0IsQ0FBQyxDQUFDO1lBQzFFLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUM1QixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDckQ7U0FDSjtRQUVELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsSUFBSSxJQUFJLElBQUksU0FBUyxFQUFFO1lBQ25CLEtBQWtCLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUyxFQUFFO2dCQUF4QixJQUFNLEdBQUcsa0JBQUE7Z0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBZ0MsTUFBUSxDQUFDLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDcEM7U0FDSjtJQUNMLENBQUM7SUFFUyx5QkFBTyxHQUFqQixVQUFrQixLQUFLO1FBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVTLDBCQUFRLEdBQWxCLFVBQW1CLEtBQUs7UUFBeEIsaUJBdUJDO1FBdEJHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUVsQix3QkFBd0I7UUFDeEIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsRUFBRTtZQUN6RCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUE7WUFDakMsT0FBTztTQUNWO1FBRUQsT0FBTztRQUNQLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQztnQkFDOUIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDckIsS0FBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO2dCQUNsQyxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxLQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsRUFBRTtvQkFDekIsS0FBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUM7aUJBQzVCO1lBQ0wsQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQzdCO2FBQU07WUFDSCxJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7U0FDckM7SUFDTCxDQUFDO0lBRU0sdUJBQUssR0FBWixVQUFhLElBQWEsRUFBRSxNQUFlO1FBQ3ZDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDMUIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3BDO2FBQU07WUFDSCxJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7U0FDckM7SUFDTCxDQUFDO0lBRUQsNkJBQTZCO0lBQ3RCLDZCQUFXLEdBQWxCLFVBQW1CLElBQWEsRUFBRSxNQUFlO1FBQzdDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNwQztJQUNMLENBQUM7SUFFRCxpQ0FBaUM7SUFDMUIsc0JBQUksR0FBWCxVQUFZLEdBQVksRUFBRSxLQUFzQjtRQUF0QixzQkFBQSxFQUFBLGFBQXNCO1FBQzVDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxZQUFZLENBQUMsT0FBTyxJQUFJLEtBQUssRUFBRTtZQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDL0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNqQzthQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxZQUFZLENBQUMsUUFBUTtZQUMzQyxJQUFJLENBQUMsTUFBTSxJQUFJLFlBQVksQ0FBQyxVQUFVLEVBQUU7WUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLE1BQU0sRUFBRSxHQUFHO2dCQUNYLE1BQU0sRUFBRSxDQUFDO2dCQUNULFNBQVMsRUFBRSxJQUFJO2FBQ2xCLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0VBQWdFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVGLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7YUFBTTtZQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hFLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO0lBQ0wsQ0FBQztJQUVELGVBQWU7SUFDUix5QkFBTyxHQUFkLFVBQWUsR0FBWSxFQUFFLE1BQWMsRUFBRSxTQUF5QixFQUFFLFFBQXdCLEVBQUUsS0FBc0I7UUFBaEQseUJBQUEsRUFBQSxlQUF3QjtRQUFFLHNCQUFBLEVBQUEsYUFBc0I7UUFDcEgsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLFlBQVksQ0FBQyxPQUFPLElBQUksS0FBSyxFQUFFO1lBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBb0MsTUFBUSxDQUFDLENBQUM7UUFDMUQsV0FBVztRQUNYLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQ2hCLE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxRQUFBLEVBQUUsU0FBUyxXQUFBO1NBQ2pDLENBQUMsQ0FBQztRQUNILFVBQVU7UUFDVixJQUFJLFFBQVEsRUFBRTtZQUNWLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNwRDtJQUNMLENBQUM7SUFFRCx5REFBeUQ7SUFDbEQsK0JBQWEsR0FBcEIsVUFBcUIsR0FBWSxFQUFFLE1BQWMsRUFBRSxTQUF5QixFQUFFLFFBQXdCLEVBQUUsS0FBc0I7UUFBaEQseUJBQUEsRUFBQSxlQUF3QjtRQUFFLHNCQUFBLEVBQUEsYUFBc0I7UUFDMUgsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQzVDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxFQUFFO2dCQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFtQyxNQUFRLENBQUMsQ0FBQztnQkFDekQsT0FBTyxLQUFLLENBQUM7YUFDaEI7U0FDSjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxxREFBcUQ7SUFDOUMsbUNBQWlCLEdBQXhCLFVBQXlCLEdBQVcsRUFBRSxRQUFxQixFQUFFLE1BQVk7UUFDckUsSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO1lBQ2xCLE9BQU8sQ0FBQyxLQUFLLENBQUMscUNBQW1DLEdBQUssQ0FBQyxDQUFDO1lBQ3hELE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxRQUFBLEVBQUUsUUFBUSxVQUFBLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxtQ0FBaUIsR0FBeEIsVUFBeUIsR0FBVyxFQUFFLFFBQXFCLEVBQUUsTUFBWTtRQUNyRSxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7WUFDbEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQ0FBbUMsR0FBSyxDQUFDLENBQUM7WUFDeEQsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxJQUFJLFNBQVMsR0FBRyxFQUFFLE1BQU0sUUFBQSxFQUFFLFFBQVEsVUFBQSxFQUFFLENBQUM7UUFDckMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDckM7YUFBTTtZQUNILElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDdkM7U0FDSjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxzQ0FBb0IsR0FBM0IsVUFBNEIsR0FBVyxFQUFFLFFBQXFCLEVBQUUsTUFBWTtRQUN4RSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7WUFDakQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sUUFBQSxFQUFFLFFBQVEsVUFBQSxFQUFFLENBQUMsQ0FBQztZQUNqRSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRTtnQkFDYixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDeEM7U0FDSjtJQUNMLENBQUM7SUFFTSxnQ0FBYyxHQUFyQixVQUFzQixHQUFnQjtRQUFoQixvQkFBQSxFQUFBLE9BQWUsQ0FBQztRQUNsQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNYLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFBO1NBQ3RCO2FBQU07WUFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUM5QjtJQUNMLENBQUM7SUFFUyxzQ0FBb0IsR0FBOUIsVUFBK0IsR0FBVyxFQUFFLFNBQXlCO1FBQ2pFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsSUFBSSxRQUFRLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxRQUFRO21CQUNwQyxRQUFRLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3hDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ1YsTUFBTTthQUNUO1NBQ0o7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsd0RBQXdEO0lBQzlDLHNDQUFvQixHQUE5QjtRQUFBLGlCQVNDO1FBUkcsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssSUFBSSxFQUFFO1lBQ2hDLFlBQVksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUN2QztRQUVELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUM7WUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQ3JELEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekIsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRVMsb0NBQWtCLEdBQTVCO1FBQUEsaUJBU0M7UUFSRyxJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssSUFBSSxFQUFFO1lBQy9CLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDdEM7UUFFRCxJQUFJLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQztZQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUE7WUFDbkQsS0FBSSxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRVMsNEJBQVUsR0FBcEI7UUFDSSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLEVBQUU7WUFDaEMsWUFBWSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLElBQUksRUFBRTtZQUMvQixZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3RDO1FBQ0QsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLElBQUksRUFBRTtZQUMvQixZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3RDO0lBQ0wsQ0FBQztJQUVNLGlDQUFlLEdBQXRCO1FBQ0ksT0FBTyxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU0saUNBQWUsR0FBdEI7UUFDSSxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNMLGNBQUM7QUFBRCxDQW5XQSxBQW1XQyxJQUFBO0FBbldZLDBCQUFPIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVNvY2tldCwgSU5ldHdvcmtUaXBzLCBJUHJvdG9jb2xIZWxwZXIsIFJlcXVlc3RPYmplY3QsIENhbGxiYWNrT2JqZWN0LCBOZXREYXRhLCBOZXRDYWxsRnVuYyB9IGZyb20gXCIuL05ldEludGVyZmFjZVwiO1xuXG4vKlxuKiAgIENvY29zQ3JlYXRvcue9kee7nOiKgueCueWfuuexu++8jOS7peWPiue9kee7nOebuOWFs+aOpeWPo+WumuS5iVxuKiAgIDEuIOe9kee7nOi/nuaOpeOAgeaWreW8gOOAgeivt+axguWPkemAgeOAgeaVsOaNruaOpeaUtuetieWfuuehgOWKn+iDvVxuKiAgIDIuIOW/g+i3s+acuuWItlxuKiAgIDMuIOaWree6v+mHjei/niArIOivt+axgumHjeWPkVxuKiAgIDQuIOiwg+eUqOe9kee7nOWxj+iUveWxglxuKlxuKiAgIDIwMTgtNS03IGJ5IOWuneeIt1xuKi9cblxudHlwZSBFeGVjdXRlckZ1bmMgPSAoY2FsbGJhY2s6IENhbGxiYWNrT2JqZWN0LCBidWZmZXI6IE5ldERhdGEpID0+IHZvaWQ7XG50eXBlIENoZWNrRnVuYyA9IChjaGVja2VkRnVuYyA6IFZvaWRGdW5jICkgPT4gdm9pZDtcbnR5cGUgVm9pZEZ1bmMgPSAoKSA9PiB2b2lkO1xudHlwZSBCb29sRnVuYyA9ICgpID0+IGJvb2xlYW47XG5cbmV4cG9ydCBlbnVtIE5ldFRpcHNUeXBlIHtcbiAgICBDb25uZWN0aW5nLFxuICAgIFJlQ29ubmVjdGluZyxcbiAgICBSZXF1ZXN0aW5nLFxufVxuXG5leHBvcnQgZW51bSBOZXROb2RlU3RhdGUge1xuICAgIENsb3NlZCwgICAgICAgICAgICAgICAgICAgICAvLyDlt7LlhbPpl61cbiAgICBDb25uZWN0aW5nLCAgICAgICAgICAgICAgICAgLy8g6L+e5o6l5LitXG4gICAgQ2hlY2tpbmcsICAgICAgICAgICAgICAgICAgIC8vIOmqjOivgeS4rVxuICAgIFdvcmtpbmcsICAgICAgICAgICAgICAgICAgICAvLyDlj6/kvKDovpPmlbDmja5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBOZXRDb25uZWN0T3B0aW9ucyB7XG4gICAgaG9zdD86IHN0cmluZywgICAgICAgICAgICAgIC8vIOWcsOWdgFxuICAgIHBvcnQ/OiBudW1iZXIsICAgICAgICAgICAgICAvLyDnq6/lj6NcbiAgICB1cmw/OiBzdHJpbmcsICAgICAgICAgICAgICAgLy8gdXJs77yM5LiO5Zyw5Z2AK+err+WPo+S6jOmAieS4gFxuICAgIGF1dG9SZWNvbm5lY3Q/OiBudW1iZXIsICAgICAvLyAtMSDmsLjkuYXph43ov57vvIww5LiN6Ieq5Yqo6YeN6L+e77yM5YW25LuW5q2j5pW05pWw5Li66Ieq5Yqo6YeN6K+V5qyh5pWwXG59XG5cbmV4cG9ydCBjbGFzcyBOZXROb2RlIHtcbiAgICBwcm90ZWN0ZWQgX2Nvbm5lY3RPcHRpb25zOiBOZXRDb25uZWN0T3B0aW9ucyA9IG51bGw7XG4gICAgcHJvdGVjdGVkIF9hdXRvUmVjb25uZWN0OiBudW1iZXIgPSAwO1xuICAgIHByb3RlY3RlZCBfaXNTb2NrZXRJbml0OiBib29sZWFuID0gZmFsc2U7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvY2tldOaYr+WQpuWIneWni+WMlui/h1xuICAgIHByb3RlY3RlZCBfaXNTb2NrZXRPcGVuOiBib29sZWFuID0gZmFsc2U7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvY2tldOaYr+WQpui/nuaOpeaIkOWKn+i/h1xuICAgIHByb3RlY3RlZCBfc3RhdGU6IE5ldE5vZGVTdGF0ZSA9IE5ldE5vZGVTdGF0ZS5DbG9zZWQ7ICAgICAgICAgICAgICAgICAgIC8vIOiKgueCueW9k+WJjeeKtuaAgVxuICAgIHByb3RlY3RlZCBfc29ja2V0OiBJU29ja2V0ID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvY2tldOWvueixoe+8iOWPr+iDveaYr+WOn+eUn3NvY2tldOOAgXdlYnNvY2tldOOAgXd4LnNvY2tldC4uLilcblxuICAgIHByb3RlY3RlZCBfbmV0d29ya1RpcHM6IElOZXR3b3JrVGlwcyA9IG51bGw7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOe9kee7nOaPkOekunVp5a+56LGh77yI6K+35rGC5o+Q56S644CB5pat57q/6YeN6L+e5o+Q56S6562J77yJXG4gICAgcHJvdGVjdGVkIF9wcm90b2NvbEhlbHBlcjogSVByb3RvY29sSGVscGVyID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgLy8g5YyF6Kej5p6Q5a+56LGhXG4gICAgcHJvdGVjdGVkIF9jb25uZWN0ZWRDYWxsYmFjazogQ2hlY2tGdW5jID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6L+e5o6l5a6M5oiQ5Zue6LCDXG4gICAgcHJvdGVjdGVkIF9kaXNjb25uZWN0Q2FsbGJhY2s6IEJvb2xGdW5jID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pat57q/5Zue6LCDXG4gICAgcHJvdGVjdGVkIF9jYWxsYmFja0V4ZWN1dGVyOiBFeGVjdXRlckZ1bmMgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgLy8g5Zue6LCD5omn6KGMXG5cbiAgICBwcm90ZWN0ZWQgX2tlZXBBbGl2ZVRpbWVyOiBhbnkgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlv4Pot7Plrprml7blmahcbiAgICBwcm90ZWN0ZWQgX3JlY2VpdmVNc2dUaW1lcjogYW55ID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmjqXmlLbmlbDmja7lrprml7blmahcbiAgICBwcm90ZWN0ZWQgX3JlY29ubmVjdFRpbWVyOiBhbnkgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDph43ov57lrprml7blmahcbiAgICBwcm90ZWN0ZWQgX2hlYXJ0VGltZTogbnVtYmVyID0gMTAwMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlv4Pot7Ppl7TpmpRcbiAgICBwcm90ZWN0ZWQgX3JlY2VpdmVUaW1lOiBudW1iZXIgPSA2MDAwMDAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpJrkuYXmsqHmlLbliLDmlbDmja7mlq3lvIBcbiAgICBwcm90ZWN0ZWQgX3JlY29ubmV0VGltZU91dDogbnVtYmVyID0gODAwMDAwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDph43ov57pl7TpmpRcbiAgICBwcm90ZWN0ZWQgX3JlcXVlc3RzOiBSZXF1ZXN0T2JqZWN0W10gPSBBcnJheTxSZXF1ZXN0T2JqZWN0PigpOyAgICAgICAgICAvLyDor7fmsYLliJfooahcbiAgICBwcm90ZWN0ZWQgX2xpc3RlbmVyOiB7IFtrZXk6IG51bWJlcl06IENhbGxiYWNrT2JqZWN0W10gfSA9IHt9ICAgICAgICAgICAvLyDnm5HlkKzogIXliJfooahcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqIOe9kee7nOebuOWFs+WkhOeQhiAqKioqKioqKioqKioqKioqKioqKiovXG4gICAgcHVibGljIGluaXQoc29ja2V0OiBJU29ja2V0LCBwcm90b2NvbDogSVByb3RvY29sSGVscGVyLCBuZXR3b3JrVGlwczogYW55ID0gbnVsbCwgZXhlY0Z1bmMgOiBFeGVjdXRlckZ1bmMgPSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBOZXROb2RlIGluaXQgc29ja2V0YCk7XG4gICAgICAgIHRoaXMuX3NvY2tldCA9IHNvY2tldDtcbiAgICAgICAgdGhpcy5fcHJvdG9jb2xIZWxwZXIgPSBwcm90b2NvbDtcbiAgICAgICAgdGhpcy5fbmV0d29ya1RpcHMgPSBuZXR3b3JrVGlwcztcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tFeGVjdXRlciA9IGV4ZWNGdW5jID8gZXhlY0Z1bmMgOiAoY2FsbGJhY2s6IENhbGxiYWNrT2JqZWN0LCBidWZmZXI6IE5ldERhdGEpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGxiYWNrLmNhbGwoY2FsbGJhY2sudGFyZ2V0LCAwLCBidWZmZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNvbm5lY3Qob3B0aW9uczogTmV0Q29ubmVjdE9wdGlvbnMpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuX3NvY2tldCAmJiB0aGlzLl9zdGF0ZSA9PSBOZXROb2RlU3RhdGUuQ2xvc2VkKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2lzU29ja2V0SW5pdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFNvY2tldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBOZXROb2RlU3RhdGUuQ29ubmVjdGluZztcbiAgICAgICAgICAgIGlmICghdGhpcy5fc29ja2V0LmNvbm5lY3Qob3B0aW9ucykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU5ldFRpcHMoTmV0VGlwc1R5cGUuQ29ubmVjdGluZywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3RPcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvUmVjb25uZWN0ID0gb3B0aW9ucy5hdXRvUmVjb25uZWN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdE9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVOZXRUaXBzKE5ldFRpcHNUeXBlLkNvbm5lY3RpbmcsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0U29ja2V0KCkge1xuICAgICAgICB0aGlzLl9zb2NrZXQub25Db25uZWN0ZWQgPSAoZXZlbnQpID0+IHsgdGhpcy5vbkNvbm5lY3RlZChldmVudCkgfTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uTWVzc2FnZSA9IChtc2cpID0+IHsgdGhpcy5vbk1lc3NhZ2UobXNnKSB9O1xuICAgICAgICB0aGlzLl9zb2NrZXQub25FcnJvciA9IChldmVudCkgPT4geyB0aGlzLm9uRXJyb3IoZXZlbnQpIH07XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbkNsb3NlZCA9IChldmVudCkgPT4geyB0aGlzLm9uQ2xvc2VkKGV2ZW50KSB9O1xuICAgICAgICB0aGlzLl9pc1NvY2tldEluaXQgPSB0cnVlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB1cGRhdGVOZXRUaXBzKHRpcHNUeXBlOiBOZXRUaXBzVHlwZSwgaXNTaG93OiBib29sZWFuKSB7XG4gICAgICAgIGlmICh0aGlzLl9uZXR3b3JrVGlwcykge1xuICAgICAgICAgICAgaWYgKHRpcHNUeXBlID09IE5ldFRpcHNUeXBlLlJlcXVlc3RpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXR3b3JrVGlwcy5yZXF1ZXN0VGlwcyhpc1Nob3cpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aXBzVHlwZSA9PSBOZXRUaXBzVHlwZS5Db25uZWN0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbmV0d29ya1RpcHMuY29ubmVjdFRpcHMoaXNTaG93KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGlwc1R5cGUgPT0gTmV0VGlwc1R5cGUuUmVDb25uZWN0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbmV0d29ya1RpcHMucmVjb25uZWN0VGlwcyhpc1Nob3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g572R57uc6L+e5o6l5oiQ5YqfXG4gICAgcHJvdGVjdGVkIG9uQ29ubmVjdGVkKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmV0Tm9kZSBvbkNvbm5lY3RlZCFcIilcbiAgICAgICAgdGhpcy5faXNTb2NrZXRPcGVuID0gdHJ1ZTtcbiAgICAgICAgLy8g5aaC5p6c6K6+572u5LqG6Ym05p2D5Zue6LCD77yM5Zyo6L+e5o6l5a6M5oiQ5ZCO6L+b5YWl6Ym05p2D6Zi25q6177yM562J5b6F6Ym05p2D57uT5p2fXG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0ZWRDYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBOZXROb2RlU3RhdGUuQ2hlY2tpbmc7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0ZWRDYWxsYmFjaygoKSA9PiB7IHRoaXMub25DaGVja2VkKCkgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hlY2tlZCgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmV0Tm9kZSBvbkNvbm5lY3RlZCEgc3RhdGUgPVwiICsgdGhpcy5fc3RhdGUpO1xuICAgIH1cblxuICAgIC8vIOi/nuaOpemqjOivgeaIkOWKn++8jOi/m+WFpeW3peS9nOeKtuaAgVxuICAgIHByb3RlY3RlZCBvbkNoZWNrZWQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmV0Tm9kZSBvbkNoZWNrZWQhXCIpXG4gICAgICAgIHRoaXMuX3N0YXRlID0gTmV0Tm9kZVN0YXRlLldvcmtpbmc7XG4gICAgICAgIC8vIOWFs+mXrei/nuaOpeaIlumHjei/nuS4reeahOeKtuaAgeaYvuekulxuICAgICAgICB0aGlzLnVwZGF0ZU5ldFRpcHMoTmV0VGlwc1R5cGUuQ29ubmVjdGluZywgZmFsc2UpO1xuICAgICAgICB0aGlzLnVwZGF0ZU5ldFRpcHMoTmV0VGlwc1R5cGUuUmVDb25uZWN0aW5nLCBmYWxzZSk7XG5cbiAgICAgICAgLy8g6YeN5Y+R5b6F5Y+R6YCB5L+h5oGvXG4gICAgICAgIGNvbnNvbGUubG9nKGBOZXROb2RlIGZsdXNoICR7dGhpcy5fcmVxdWVzdHMubGVuZ3RofSByZXF1ZXN0YClcbiAgICAgICAgaWYgKHRoaXMuX3JlcXVlc3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fcmVxdWVzdHMubGVuZ3RoOykge1xuICAgICAgICAgICAgICAgIGxldCByZXEgPSB0aGlzLl9yZXF1ZXN0c1tpXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zb2NrZXQuc2VuZChyZXEuYnVmZmVyKTtcbiAgICAgICAgICAgICAgICBpZiAocmVxLnJzcE9iamVjdCA9PSBudWxsIHx8IHJlcS5yc3BDbWQgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXF1ZXN0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgKytpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIOWmguaenOi/mOacieetieW+hei/lOWbnueahOivt+axgu+8jOWQr+WKqOe9kee7nOivt+axguWxglxuICAgICAgICAgICAgdGhpcy51cGRhdGVOZXRUaXBzKE5ldFRpcHNUeXBlLlJlcXVlc3RpbmcsIHRoaXMucmVxdWVzdC5sZW5ndGggPiAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOaOpeaUtuWIsOS4gOS4quWujOaVtOeahOa2iOaBr+WMhVxuICAgIHByb3RlY3RlZCBvbk1lc3NhZ2UobXNnKTogdm9pZCB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBOZXROb2RlIG9uTWVzc2FnZSBzdGF0dXMgPSBgICsgdGhpcy5fc3RhdGUpO1xuICAgICAgICAvLyDov5vooYzlpLTpg6jnmoTmoKHpqozvvIjlrp7pmYXljIXplb/kuI7lpLTpg6jplb/luqbmmK/lkKbljLnphY3vvIlcbiAgICAgICAgaWYgKCF0aGlzLl9wcm90b2NvbEhlbHBlci5jaGVja1BhY2thZ2UobXNnKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgTmV0Tm9kZSBjaGVja0hlYWQgRXJyb3JgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyDmjqXlj5fliLDmlbDmja7vvIzph43mlrDlrprml7bmlLbmlbDmja7orqHml7blmahcbiAgICAgICAgdGhpcy5yZXNldFJlY2VpdmVNc2dUaW1lcigpO1xuICAgICAgICAvLyDph43nva7lv4Pot7PljIXlj5HpgIHlmahcbiAgICAgICAgdGhpcy5yZXNldEhlYXJiZWF0VGltZXIoKTtcbiAgICAgICAgLy8g6Kem5Y+R5raI5oGv5omn6KGMXG4gICAgICAgIGxldCByc3BDbWQgPSB0aGlzLl9wcm90b2NvbEhlbHBlci5nZXRQYWNrYWdlSWQobXNnKTtcbiAgICAgICAgY29uc29sZS5sb2coYE5ldE5vZGUgb25NZXNzYWdlIHJzcENtZCA9IGAgKyByc3BDbWQpO1xuICAgICAgICAvLyDkvJjlhYjop6blj5FyZXF1ZXN06Zif5YiXXG4gICAgICAgIGlmICh0aGlzLl9yZXF1ZXN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCByZXFJZHggaW4gdGhpcy5fcmVxdWVzdHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVxID0gdGhpcy5fcmVxdWVzdHNbcmVxSWR4XTtcbiAgICAgICAgICAgICAgICBpZiAocmVxLnJzcENtZCA9PSByc3BDbWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE5ldE5vZGUgZXhlY3V0ZSByZXF1ZXN0IHJzcGNtZCAke3JzcENtZH1gKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tFeGVjdXRlcihyZXEucnNwT2JqZWN0LCBtc2cpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXF1ZXN0cy5zcGxpY2UocGFyc2VJbnQocmVxSWR4KSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBOZXROb2RlIHN0aWxsIGhhcyAke3RoaXMuX3JlcXVlc3RzLmxlbmd0aH0gcmVxdWVzdCB3YXR0aW5nYCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVxdWVzdHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU5ldFRpcHMoTmV0VGlwc1R5cGUuUmVxdWVzdGluZywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyW3JzcENtZF07XG4gICAgICAgIGlmIChudWxsICE9IGxpc3RlbmVycykge1xuICAgICAgICAgICAgZm9yIChjb25zdCByc3Agb2YgbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE5ldE5vZGUgZXhlY3V0ZSBsaXN0ZW5lciBjbWQgJHtyc3BDbWR9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tFeGVjdXRlcihyc3AsIG1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25FcnJvcihldmVudCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGV2ZW50KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25DbG9zZWQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5jbGVhclRpbWVyKCk7XG5cbiAgICAgICAgLy8g5omn6KGM5pat57q/5Zue6LCD77yM6L+U5ZueZmFsc2XooajnpLrkuI3ov5vooYzph43ov55cbiAgICAgICAgaWYgKHRoaXMuX2Rpc2Nvbm5lY3RDYWxsYmFjayAmJiAhdGhpcy5fZGlzY29ubmVjdENhbGxiYWNrKCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBkaXNjb25uZWN0IHJldHVybiFgKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g6Ieq5Yqo6YeN6L+eXG4gICAgICAgIGlmICh0aGlzLmlzQXV0b1JlY29ubmVjdCgpKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU5ldFRpcHMoTmV0VGlwc1R5cGUuUmVDb25uZWN0aW5nLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuX3JlY29ubmVjdFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBOZXROb2RlU3RhdGUuQ2xvc2VkO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdCh0aGlzLl9jb25uZWN0T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2F1dG9SZWNvbm5lY3QgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F1dG9SZWNvbm5lY3QgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzLl9yZWNvbm5ldFRpbWVPdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBOZXROb2RlU3RhdGUuQ2xvc2VkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNsb3NlKGNvZGU/OiBudW1iZXIsIHJlYXNvbj86IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSB7fTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdHMubGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKHRoaXMuX25ldHdvcmtUaXBzKSB7XG4gICAgICAgICAgICB0aGlzLl9uZXR3b3JrVGlwcy5jb25uZWN0VGlwcyhmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLl9uZXR3b3JrVGlwcy5yZWNvbm5lY3RUaXBzKGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuX25ldHdvcmtUaXBzLnJlcXVlc3RUaXBzKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fc29ja2V0KSB7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQuY2xvc2UoY29kZSwgcmVhc29uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gTmV0Tm9kZVN0YXRlLkNsb3NlZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWPquaYr+WFs+mXrVNvY2tldOWll+aOpeWtl++8iOS7jeeEtumHjeeUqOe8k+WtmOS4juW9k+WJjeeKtuaAge+8iVxuICAgIHB1YmxpYyBjbG9zZVNvY2tldChjb2RlPzogbnVtYmVyLCByZWFzb24/OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NvY2tldCkge1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0LmNsb3NlKGNvZGUsIHJlYXNvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDlj5Hotbfor7fmsYLvvIzlpoLmnpzlvZPliY3lpITkuo7ph43ov57kuK3vvIzov5vlhaXnvJPlrZjliJfooajnrYnlvoXph43ov57lrozmiJDlkI7lj5HpgIFcbiAgICBwdWJsaWMgc2VuZChidWY6IE5ldERhdGEsIGZvcmNlOiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlID09IE5ldE5vZGVTdGF0ZS5Xb3JraW5nIHx8IGZvcmNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgc29ja2V0IHNlbmQgLi4uYCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc29ja2V0LnNlbmQoYnVmKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PSBOZXROb2RlU3RhdGUuQ2hlY2tpbmcgfHxcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID09IE5ldE5vZGVTdGF0ZS5Db25uZWN0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXF1ZXN0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBidWZmZXI6IGJ1ZixcbiAgICAgICAgICAgICAgICByc3BDbWQ6IDAsXG4gICAgICAgICAgICAgICAgcnNwT2JqZWN0OiBudWxsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV0Tm9kZSBzb2NrZXQgaXMgYnVzeSwgcHVzaCB0byBzZW5kIGJ1ZmZlciwgY3VycmVudCBzdGF0ZSBpcyBcIiArIHRoaXMuX3N0YXRlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk5ldE5vZGUgcmVxdWVzdCBlcnJvciEgY3VycmVudCBzdGF0ZSBpcyBcIiArIHRoaXMuX3N0YXRlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWPkei1t+ivt+axgu+8jOW5tui/m+WFpee8k+WtmOWIl+ihqFxuICAgIHB1YmxpYyByZXF1ZXN0KGJ1ZjogTmV0RGF0YSwgcnNwQ21kOiBudW1iZXIsIHJzcE9iamVjdDogQ2FsbGJhY2tPYmplY3QsIHNob3dUaXBzOiBib29sZWFuID0gdHJ1ZSwgZm9yY2U6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBpZiAodGhpcy5fc3RhdGUgPT0gTmV0Tm9kZVN0YXRlLldvcmtpbmcgfHwgZm9yY2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5zZW5kKGJ1Zik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYE5ldE5vZGUgcmVxdWVzdCB3aXRoIHRpbWVvdXQgZm9yICR7cnNwQ21kfWApO1xuICAgICAgICAvLyDov5vlhaXlj5HpgIHnvJPlrZjliJfooahcbiAgICAgICAgdGhpcy5fcmVxdWVzdHMucHVzaCh7XG4gICAgICAgICAgICBidWZmZXI6IGJ1ZiwgcnNwQ21kLCByc3BPYmplY3RcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIOWQr+WKqOe9kee7nOivt+axguWxglxuICAgICAgICBpZiAoc2hvd1RpcHMpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTmV0VGlwcyhOZXRUaXBzVHlwZS5SZXF1ZXN0aW5nLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWUr+S4gHJlcXVlc3TvvIznoa7kv53msqHmnInlkIzkuIDlk43lupTnmoTor7fmsYLvvIjpgb/lhY3kuIDkuKror7fmsYLph43lpI3lj5HpgIHvvIxuZXRUaXBz55WM6Z2i55qE5bGP6JS95Lmf5piv5LiA5Liq5aW955qE5pa55rOV77yJXG4gICAgcHVibGljIHJlcXVlc3RVbmlxdWUoYnVmOiBOZXREYXRhLCByc3BDbWQ6IG51bWJlciwgcnNwT2JqZWN0OiBDYWxsYmFja09iamVjdCwgc2hvd1RpcHM6IGJvb2xlYW4gPSB0cnVlLCBmb3JjZTogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fcmVxdWVzdHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZXF1ZXN0c1tpXS5yc3BDbWQgPT0gcnNwQ21kKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE5ldE5vZGUgcmVxdWVzdFVuaXF1ZSBmYWlsZSBmb3IgJHtyc3BDbWR9YCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVxdWVzdChidWYsIHJzcENtZCwgcnNwT2JqZWN0LCBzaG93VGlwcywgZm9yY2UpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKiDlm57osIPnm7jlhbPlpITnkIYgKioqKioqKioqKioqKioqKioqKioqL1xuICAgIHB1YmxpYyBzZXRSZXNwb25lSGFuZGxlcihjbWQ6IG51bWJlciwgY2FsbGJhY2s6IE5ldENhbGxGdW5jLCB0YXJnZXQ/OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYE5ldE5vZGUgc2V0UmVzcG9uZUhhbmRsZXIgZXJyb3IgJHtjbWR9YCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbGlzdGVuZXJbY21kXSA9IFt7IHRhcmdldCwgY2FsbGJhY2sgfV07XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRSZXNwb25lSGFuZGxlcihjbWQ6IG51bWJlciwgY2FsbGJhY2s6IE5ldENhbGxGdW5jLCB0YXJnZXQ/OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYE5ldE5vZGUgYWRkUmVzcG9uZUhhbmRsZXIgZXJyb3IgJHtjbWR9YCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJzcE9iamVjdCA9IHsgdGFyZ2V0LCBjYWxsYmFjayB9O1xuICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9saXN0ZW5lcltjbWRdKSB7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcltjbWRdID0gW3JzcE9iamVjdF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmdldE5ldExpc3RlbmVyc0luZGV4KGNtZCwgcnNwT2JqZWN0KTtcbiAgICAgICAgICAgIGlmICgtMSA9PSBpbmRleCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyW2NtZF0ucHVzaChyc3BPYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmVSZXNwb25lSGFuZGxlcihjbWQ6IG51bWJlciwgY2FsbGJhY2s6IE5ldENhbGxGdW5jLCB0YXJnZXQ/OiBhbnkpIHtcbiAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fbGlzdGVuZXJbY21kXSAmJiBjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmdldE5ldExpc3RlbmVyc0luZGV4KGNtZCwgeyB0YXJnZXQsIGNhbGxiYWNrIH0pO1xuICAgICAgICAgICAgaWYgKC0xICE9IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJbY21kXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFuTGlzdGVuZXJzKGNtZDogbnVtYmVyID0gLTEpIHtcbiAgICAgICAgaWYgKGNtZCA9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSB7fVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJbY21kXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0TmV0TGlzdGVuZXJzSW5kZXgoY21kOiBudW1iZXIsIHJzcE9iamVjdDogQ2FsbGJhY2tPYmplY3QpOiBudW1iZXIge1xuICAgICAgICBsZXQgaW5kZXggPSAtMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9saXN0ZW5lcltjbWRdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgaXRlcmF0b3IgPSB0aGlzLl9saXN0ZW5lcltjbWRdW2ldO1xuICAgICAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGxiYWNrID09IHJzcE9iamVjdC5jYWxsYmFja1xuICAgICAgICAgICAgICAgICYmIGl0ZXJhdG9yLnRhcmdldCA9PSByc3BPYmplY3QudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKiDlv4Pot7PjgIHotoXml7bnm7jlhbPlpITnkIYgKioqKioqKioqKioqKioqKioqKioqL1xuICAgIHByb3RlY3RlZCByZXNldFJlY2VpdmVNc2dUaW1lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuX3JlY2VpdmVNc2dUaW1lciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JlY2VpdmVNc2dUaW1lcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yZWNlaXZlTXNnVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5ldE5vZGUgcmVjdmllTXNnVGltZXIgY2xvc2Ugc29ja2V0IVwiKTtcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5jbG9zZSgpO1xuICAgICAgICB9LCB0aGlzLl9yZWNlaXZlVGltZSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlc2V0SGVhcmJlYXRUaW1lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2tlZXBBbGl2ZVRpbWVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fa2VlcEFsaXZlVGltZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fa2VlcEFsaXZlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV0Tm9kZSBrZWVwQWxpdmVUaW1lciBzZW5kIEhlYXJiZWF0XCIpXG4gICAgICAgICAgICB0aGlzLnNlbmQodGhpcy5fcHJvdG9jb2xIZWxwZXIuZ2V0SGVhcmJlYXQoKSk7XG4gICAgICAgIH0sIHRoaXMuX2hlYXJ0VGltZSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNsZWFyVGltZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLl9yZWNlaXZlTXNnVGltZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZWNlaXZlTXNnVGltZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9rZWVwQWxpdmVUaW1lciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2tlZXBBbGl2ZVRpbWVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcmVjb25uZWN0VGltZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZWNvbm5lY3RUaW1lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaXNBdXRvUmVjb25uZWN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXV0b1JlY29ubmVjdCAhPSAwO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWplY3RSZWNvbm5lY3QoKSB7XG4gICAgICAgIHRoaXMuX2F1dG9SZWNvbm5lY3QgPSAwO1xuICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICB9XG59Il19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/uiviews/UIHall.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f3353O2bc9EsbNFkNcfD5/M', 'UIHall');
// Script/example/uiviews/UIHall.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var UIView_1 = require("../../ui/UIView");
var UIManager_1 = require("../../ui/UIManager");
var UIExample_1 = require("../UIExample");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UIHall = /** @class */ (function (_super) {
    __extends(UIHall, _super);
    function UIHall() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.weapon = null;
        return _this;
    }
    UIHall.prototype.onBag = function () {
        UIManager_1.uiManager.open(UIExample_1.UIID.UIBag);
    };
    UIHall.prototype.onNotice = function () {
        UIManager_1.uiManager.open(UIExample_1.UIID.UINotice);
    };
    UIHall.prototype.onTop = function (preID, item) {
        this.weapon.spriteFrame = item;
    };
    __decorate([
        property({ type: cc.Sprite })
    ], UIHall.prototype, "weapon", void 0);
    UIHall = __decorate([
        ccclass
    ], UIHall);
    return UIHall;
}(UIView_1.UIView));
exports.default = UIHall;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS91aXZpZXdzL1VJSGFsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBeUM7QUFDekMsZ0RBQStDO0FBQy9DLDBDQUFvQztBQUU5QixJQUFBLGtCQUFtQyxFQUFsQyxvQkFBTyxFQUFFLHNCQUF5QixDQUFDO0FBRzFDO0lBQW9DLDBCQUFNO0lBRDFDO1FBQUEscUVBaUJDO1FBYkcsWUFBTSxHQUFjLElBQUksQ0FBQzs7SUFhN0IsQ0FBQztJQVhVLHNCQUFLLEdBQVo7UUFDSSxxQkFBUyxDQUFDLElBQUksQ0FBQyxnQkFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTSx5QkFBUSxHQUFmO1FBQ0kscUJBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sc0JBQUssR0FBWixVQUFhLEtBQWEsRUFBRSxJQUFvQjtRQUM1QyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDbkMsQ0FBQztJQVpEO1FBREMsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUMsQ0FBQzswQ0FDSjtJQUhSLE1BQU07UUFEMUIsT0FBTztPQUNhLE1BQU0sQ0FnQjFCO0lBQUQsYUFBQztDQWhCRCxBQWdCQyxDQWhCbUMsZUFBTSxHQWdCekM7a0JBaEJvQixNQUFNIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVUlWaWV3IH0gZnJvbSBcIi4uLy4uL3VpL1VJVmlld1wiO1xuaW1wb3J0IHsgdWlNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uL3VpL1VJTWFuYWdlclwiO1xuaW1wb3J0IHsgVUlJRCB9IGZyb20gXCIuLi9VSUV4YW1wbGVcIjtcblxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XG5cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVSUhhbGwgZXh0ZW5kcyBVSVZpZXcge1xuXG4gICAgQHByb3BlcnR5KHt0eXBlIDogY2MuU3ByaXRlfSlcbiAgICB3ZWFwb246IGNjLlNwcml0ZSA9IG51bGw7XG5cbiAgICBwdWJsaWMgb25CYWcoKSB7XG4gICAgICAgIHVpTWFuYWdlci5vcGVuKFVJSUQuVUlCYWcpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbk5vdGljZSgpIHtcbiAgICAgICAgdWlNYW5hZ2VyLm9wZW4oVUlJRC5VSU5vdGljZSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uVG9wKHByZUlEOiBudW1iZXIsIGl0ZW06IGNjLlNwcml0ZUZyYW1lKSB7XG4gICAgICAgIHRoaXMud2VhcG9uLnNwcml0ZUZyYW1lID0gaXRlbTtcbiAgICB9XG59XG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/res/ResManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '057d16YWG1BLYw+M2uo2hYT', 'ResManager');
// Script/res/ResManager.ts

"use strict";
/**
 * cc.Asset的管理器
 * 1. 对cc.Asset进行注入，扩展其addRef和decRef方法，使其支持引用计数
 * 2. 对cc.Asset进行资源依赖管理
 * 3. 接管场景切换时，资源的引用管理，避免无引用计数的场景依赖被意外释放
 *
 * 2021-1-21 by 宝爷
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ResKeeper_1 = require("./ResKeeper");
var ResUtil_1 = require("./ResUtil");
var loader = cc.loader;
var ResManager = /** @class */ (function () {
    function ResManager() {
        var _this = this;
        this.defaultKeeper = new ResKeeper_1.ResKeeper();
        this.persistDepends = new Set();
        this.sceneDepends = null;
        this.lastScene = null;
        cc.game.once(cc.game.EVENT_ENGINE_INITED, ResManager.assetInit);
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, function (scene) {
            _this.onSceneChange(scene);
        });
    }
    /**
     * 获取当前场景的持久节点应用的资源
     */
    ResManager.prototype.getPersistDepends = function () {
        var game = cc.game;
        var persistNodeList = Object.keys(game._persistRootNodes).map(function (x) {
            return game._persistRootNodes[x];
        });
        return ResUtil_1.ResUtil.getNodesDepends(persistNodeList);
    };
    /**
     * 处理场景切换，分两种情况，一种为根据scene的uuid找到场景的资源，另外一种为根据scene.dependAssets进行缓存
     * @param scene
     */
    ResManager.prototype.onSceneChange = function (scene) {
        var _this = this;
        console.log('On Scene Change');
        if (CC_EDITOR || this.lastScene == scene) {
            return;
        }
        // 获取新场景的依赖
        var depends = null;
        if (scene['dependAssets'] instanceof Array) {
            depends = scene['dependAssets'];
        }
        else {
            var item = loader.getItem(scene.uuid);
            if (item) {
                depends = item.dependKeys;
            }
            else {
                console.error("cache scene faile " + scene);
                return;
            }
        }
        // 缓存新场景的依赖
        for (var i = 0; i < depends.length; ++i) {
            // 下一个场景的资源可能是之前的常驻资源，这里
            if (!this.persistDepends.has(depends[i])) {
                this.cacheAsset(depends[i]);
            }
        }
        // 获取持久节点依赖
        var persistRes = this.getPersistDepends();
        // 释放旧场景依赖
        if (this.sceneDepends) {
            for (var i = 0; i < this.sceneDepends.length; ++i) {
                if (persistRes.has(this.sceneDepends[i])) {
                    // 如果是常驻节点的资源，就先不释放，放到persistDepends，等待合适的时机释放
                    this.persistDepends.add(this.sceneDepends[i]);
                }
                else if (!this.persistDepends.has(this.sceneDepends[i])) {
                    // 当资源是上个场景的依赖，又是上上个场景的依赖和常驻资源时，释放的话会导致重复释放
                    this.releaseAsset(this.sceneDepends[i]);
                }
            }
        }
        // 释放不再是常驻节点依赖的资源，防止泄露，遍历中删除是安全的
        this.persistDepends.forEach(function (item) {
            if (!persistRes.has(item)) {
                _this.releaseAsset(item);
                _this.persistDepends.delete(item);
            }
        });
        // 切场景时，自动释放默认资源
        this.getKeeper().releaseAssets();
        this.lastScene = scene;
    };
    // 为cc.Asset注入引用计数的功能
    ResManager.assetInit = function () {
        console.log('asset init');
        if (!Object.getOwnPropertyDescriptor(cc.Asset.prototype, 'addRef')) {
            Object.defineProperties(cc.Asset.prototype, {
                refDepends: {
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: false,
                },
                refCount: {
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: 0,
                },
                addRef: {
                    configurable: true,
                    writable: true,
                    value: function () {
                        ++this.refCount;
                        return this;
                    }
                },
                decRef: {
                    configurable: true,
                    writable: true,
                    value: function (autoRelease) {
                        if (autoRelease === void 0) { autoRelease = true; }
                        --this.refCount;
                        if (this.refCount <= 0 && autoRelease) {
                            ResManager.Instance.releaseAsset(this);
                        }
                        return this;
                    }
                }
            });
        }
    };
    Object.defineProperty(ResManager, "Instance", {
        get: function () {
            if (!this.instance) {
                this.instance = new ResManager();
            }
            return this.instance;
        },
        enumerable: true,
        configurable: true
    });
    ResManager.prototype.getKeeper = function () {
        return this.defaultKeeper;
    };
    ResManager.prototype.getReferenceKey = function (assetOrUrlOrUuid) {
        if (assetOrUrlOrUuid instanceof cc.Asset && !assetOrUrlOrUuid['_uuid']) {
            // 远程资源没有_uuid
            if (assetOrUrlOrUuid.url) {
                return assetOrUrlOrUuid.url;
            }
        }
        return loader._getReferenceKey(assetOrUrlOrUuid);
    };
    /**
     * 缓存一个资源
     * @param item 资源的item对象
     */
    ResManager.prototype.cacheItem = function (item) {
        if (item) {
            var asset = item.content;
            if (asset instanceof cc.Asset) {
                asset.addRef();
                if (!asset.refDepends && item.dependKeys) {
                    var depends = item.dependKeys;
                    for (var i = 0; i < depends.length; i++) {
                        this.cacheItem(loader.getItem(depends[i]));
                    }
                    asset.refDepends = true;
                }
            }
            else {
                // 原生资源、html元素有可能走到这里，原生资源都是有对应的cc.Asset对应引用的，所以这里可以不处理
                console.log("cacheItem " + item + " is not cc.Asset " + asset);
            }
        }
        else {
            console.warn("cacheItem error, item is " + item);
        }
    };
    ResManager.prototype.cacheAsset = function (assetOrUrlOrUuid) {
        var key = this.getReferenceKey(assetOrUrlOrUuid);
        if (key) {
            var item = loader.getItem(key);
            if (item) {
                this.cacheItem(item);
            }
            else {
                console.warn("cacheAsset error, loader.getItem " + key + " is " + item);
            }
        }
        else {
            console.warn("cacheAsset error, this.getReferenceKey " + assetOrUrlOrUuid + " return " + key);
        }
    };
    /**
     * 释放一个资源
     * @param item 资源的item对象
     */
    ResManager.prototype.releaseItem = function (item, dec) {
        if (dec === void 0) { dec = false; }
        if (item && item.content) {
            var asset = item.content;
            var res = item.uuid || item.id;
            if (asset instanceof cc.Asset) {
                if (dec) {
                    asset.decRef(false);
                }
                if (asset.refCount <= 0) {
                    var depends = item.dependKeys;
                    if (depends) {
                        for (var i = 0; i < depends.length; i++) {
                            this.releaseItem(loader.getItem(depends[i]), true);
                        }
                    }
                    loader.release(res);
                    cc.log("loader.release cc.Asset " + res);
                }
            }
            else {
                loader.release(res);
                cc.log("loader.release " + res + " rawAsset " + asset);
            }
        }
        else {
            console.warn("releaseItem error, item is " + item);
        }
    };
    /**
     * 释放一个资源（会减少其引用计数）
     * @param assetOrUrlOrUuid
     */
    ResManager.prototype.releaseAsset = function (assetOrUrlOrUuid) {
        var key = this.getReferenceKey(assetOrUrlOrUuid);
        if (key) {
            var item = loader.getItem(key);
            if (item) {
                this.releaseItem(item);
            }
            else {
                console.warn("releaseAsset error, loader.getItem " + key + " is " + item);
            }
        }
        else {
            console.warn("releaseAsset error, this.getReferenceKey " + assetOrUrlOrUuid + " return " + key);
        }
    };
    return ResManager;
}());
exports.default = ResManager;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvcmVzL1Jlc01hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7O0dBT0c7O0FBRUgseUNBQXdDO0FBQ3hDLHFDQUFvQztBQUVwQyxJQUFJLE1BQU0sR0FBUSxFQUFFLENBQUMsTUFBTSxDQUFDO0FBRTVCO0lBd0hJO1FBQUEsaUJBS0M7UUEzSE8sa0JBQWEsR0FBYyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztRQUMzQyxtQkFBYyxHQUFnQixJQUFJLEdBQUcsRUFBVSxDQUFDO1FBQ2hELGlCQUFZLEdBQWEsSUFBSSxDQUFDO1FBQzlCLGNBQVMsR0FBRyxJQUFJLENBQUM7UUFvSHJCLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hFLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMseUJBQXlCLEVBQUUsVUFBQyxLQUFLO1lBQ3hELEtBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBdEhEOztPQUVHO0lBQ0ssc0NBQWlCLEdBQXpCO1FBQ0ksSUFBSSxJQUFJLEdBQU8sRUFBRSxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLGVBQWUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7WUFDckUsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLGlCQUFPLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRDs7O09BR0c7SUFDSyxrQ0FBYSxHQUFyQixVQUFzQixLQUFl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moTnrqHnkIblmahcclxuICogMS4g5a+5Y2MuQXNzZXTov5vooYzms6jlhaXvvIzmianlsZXlhbZhZGRSZWblkoxkZWNSZWbmlrnms5XvvIzkvb/lhbbmlK/mjIHlvJXnlKjorqHmlbBcclxuICogMi4g5a+5Y2MuQXNzZXTov5vooYzotYTmupDkvp3otZbnrqHnkIZcclxuICogMy4g5o6l566h5Zy65pmv5YiH5o2i5pe277yM6LWE5rqQ55qE5byV55So566h55CG77yM6YG/5YWN5peg5byV55So6K6h5pWw55qE5Zy65pmv5L6d6LWW6KKr5oSP5aSW6YeK5pS+XHJcbiAqIFxyXG4gKiAyMDIxLTEtMjEgYnkg5a6d54i3XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgUmVzS2VlcGVyIH0gZnJvbSBcIi4vUmVzS2VlcGVyXCI7XHJcbmltcG9ydCB7IFJlc1V0aWwgfSBmcm9tIFwiLi9SZXNVdGlsXCI7XHJcblxyXG5sZXQgbG9hZGVyOiBhbnkgPSBjYy5sb2FkZXI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXNNYW5hZ2VyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBSZXNNYW5hZ2VyO1xyXG4gICAgcHJpdmF0ZSBkZWZhdWx0S2VlcGVyOiBSZXNLZWVwZXIgPSBuZXcgUmVzS2VlcGVyKCk7XHJcbiAgICBwcml2YXRlIHBlcnNpc3REZXBlbmRzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG4gICAgcHJpdmF0ZSBzY2VuZURlcGVuZHM6IHN0cmluZ1tdID0gbnVsbDtcclxuICAgIHByaXZhdGUgbGFzdFNjZW5lID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluW9k+WJjeWcuuaZr+eahOaMgeS5heiKgueCueW6lOeUqOeahOi1hOa6kFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldFBlcnNpc3REZXBlbmRzKCkgOiBTZXQ8c3RyaW5nPiB7XHJcbiAgICAgICAgbGV0IGdhbWU6YW55ID0gY2MuZ2FtZTtcclxuICAgICAgICB2YXIgcGVyc2lzdE5vZGVMaXN0ID0gT2JqZWN0LmtleXMoZ2FtZS5fcGVyc2lzdFJvb3ROb2RlcykubWFwKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnYW1lLl9wZXJzaXN0Um9vdE5vZGVzW3hdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBSZXNVdGlsLmdldE5vZGVzRGVwZW5kcyhwZXJzaXN0Tm9kZUxpc3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5aSE55CG5Zy65pmv5YiH5o2i77yM5YiG5Lik56eN5oOF5Ya177yM5LiA56eN5Li65qC55o2uc2NlbmXnmoR1dWlk5om+5Yiw5Zy65pmv55qE6LWE5rqQ77yM5Y+m5aSW5LiA56eN5Li65qC55o2uc2NlbmUuZGVwZW5kQXNzZXRz6L+b6KGM57yT5a2YXHJcbiAgICAgKiBAcGFyYW0gc2NlbmUgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgb25TY2VuZUNoYW5nZShzY2VuZTogY2MuU2NlbmUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnT24gU2NlbmUgQ2hhbmdlJyk7XHJcbiAgICAgICAgaWYgKENDX0VESVRPUiB8fCB0aGlzLmxhc3RTY2VuZSA9PSBzY2VuZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDojrflj5bmlrDlnLrmma/nmoTkvp3otZZcclxuICAgICAgICBsZXQgZGVwZW5kczogc3RyaW5nW10gPSBudWxsO1xyXG4gICAgICAgIGlmIChzY2VuZVsnZGVwZW5kQXNzZXRzJ10gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBkZXBlbmRzID0gc2NlbmVbJ2RlcGVuZEFzc2V0cyddO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gbG9hZGVyLmdldEl0ZW0oc2NlbmUudXVpZCk7XHJcbiAgICAgICAgICAgIGlmKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGRlcGVuZHMgPSBpdGVtLmRlcGVuZEtleXM7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBjYWNoZSBzY2VuZSBmYWlsZSAke3NjZW5lfWApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDnvJPlrZjmlrDlnLrmma/nmoTkvp3otZZcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlcGVuZHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgLy8g5LiL5LiA5Liq5Zy65pmv55qE6LWE5rqQ5Y+v6IO95piv5LmL5YmN55qE5bi46am76LWE5rqQ77yM6L+Z6YeMXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wZXJzaXN0RGVwZW5kcy5oYXMoZGVwZW5kc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVBc3NldChkZXBlbmRzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6I635Y+W5oyB5LmF6IqC54K55L6d6LWWXHJcbiAgICAgICAgbGV0IHBlcnNpc3RSZXMgOiBTZXQ8c3RyaW5nPiA9IHRoaXMuZ2V0UGVyc2lzdERlcGVuZHMoKTtcclxuXHJcbiAgICAgICAgLy8g6YeK5pS+5pen5Zy65pmv5L6d6LWWXHJcbiAgICAgICAgaWYgKHRoaXMuc2NlbmVEZXBlbmRzKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zY2VuZURlcGVuZHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwZXJzaXN0UmVzLmhhcyh0aGlzLnNjZW5lRGVwZW5kc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzmmK/luLjpqbvoioLngrnnmoTotYTmupDvvIzlsLHlhYjkuI3ph4rmlL7vvIzmlL7liLBwZXJzaXN0RGVwZW5kc++8jOetieW+heWQiOmAgueahOaXtuacuumHiuaUvlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGVyc2lzdERlcGVuZHMuYWRkKHRoaXMuc2NlbmVEZXBlbmRzW2ldKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMucGVyc2lzdERlcGVuZHMuaGFzKHRoaXMuc2NlbmVEZXBlbmRzW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOW9k+i1hOa6kOaYr+S4iuS4quWcuuaZr+eahOS+nei1lu+8jOWPiOaYr+S4iuS4iuS4quWcuuaZr+eahOS+nei1luWSjOW4uOmpu+i1hOa6kOaXtu+8jOmHiuaUvueahOivneS8muWvvOiHtOmHjeWkjemHiuaUvlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVsZWFzZUFzc2V0KHRoaXMuc2NlbmVEZXBlbmRzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6YeK5pS+5LiN5YaN5piv5bi46am76IqC54K55L6d6LWW55qE6LWE5rqQ77yM6Ziy5q2i5rOE6Zyy77yM6YGN5Y6G5Lit5Yig6Zmk5piv5a6J5YWo55qEXHJcbiAgICAgICAgdGhpcy5wZXJzaXN0RGVwZW5kcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghcGVyc2lzdFJlcy5oYXMoaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVsZWFzZUFzc2V0KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wZXJzaXN0RGVwZW5kcy5kZWxldGUoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g5YiH5Zy65pmv5pe277yM6Ieq5Yqo6YeK5pS+6buY6K6k6LWE5rqQXHJcbiAgICAgICAgdGhpcy5nZXRLZWVwZXIoKS5yZWxlYXNlQXNzZXRzKCk7XHJcbiAgICAgICAgdGhpcy5sYXN0U2NlbmUgPSBzY2VuZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8g5Li6Y2MuQXNzZXTms6jlhaXlvJXnlKjorqHmlbDnmoTlip/og71cclxuICAgIHByaXZhdGUgc3RhdGljIGFzc2V0SW5pdCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnYXNzZXQgaW5pdCcpO1xyXG4gICAgICAgIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjYy5Bc3NldC5wcm90b3R5cGUsICdhZGRSZWYnKSkge1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhjYy5Bc3NldC5wcm90b3R5cGUsIHtcclxuICAgICAgICAgICAgICAgIHJlZkRlcGVuZHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlZkNvdW50OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAwLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFkZFJlZjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKCk6IGNjLkFzc2V0IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyt0aGlzLnJlZkNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGVjUmVmOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoYXV0b1JlbGVhc2UgPSB0cnVlKTogY2MuQXNzZXQge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAtLXRoaXMucmVmQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlZkNvdW50IDw9IDAgJiYgYXV0b1JlbGVhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc01hbmFnZXIuSW5zdGFuY2UucmVsZWFzZUFzc2V0KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgY2MuZ2FtZS5vbmNlKGNjLmdhbWUuRVZFTlRfRU5HSU5FX0lOSVRFRCwgUmVzTWFuYWdlci5hc3NldEluaXQpO1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9TQ0VORV9MQVVOQ0gsIChzY2VuZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9uU2NlbmVDaGFuZ2Uoc2NlbmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEluc3RhbmNlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlID0gbmV3IFJlc01hbmFnZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEtlZXBlcigpIDogUmVzS2VlcGVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0S2VlcGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UmVmZXJlbmNlS2V5KGFzc2V0T3JVcmxPclV1aWQ6IGNjLkFzc2V0IHwgc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKGFzc2V0T3JVcmxPclV1aWQgaW5zdGFuY2VvZiBjYy5Bc3NldCAmJiAhYXNzZXRPclVybE9yVXVpZFsnX3V1aWQnXSkge1xyXG4gICAgICAgICAgICAvLyDov5znqIvotYTmupDmsqHmnIlfdXVpZFxyXG4gICAgICAgICAgICBpZiAoYXNzZXRPclVybE9yVXVpZC51cmwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhc3NldE9yVXJsT3JVdWlkLnVybDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbG9hZGVyLl9nZXRSZWZlcmVuY2VLZXkoYXNzZXRPclVybE9yVXVpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnvJPlrZjkuIDkuKrotYTmupBcclxuICAgICAqIEBwYXJhbSBpdGVtIOi1hOa6kOeahGl0ZW3lr7nosaFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjYWNoZUl0ZW0oaXRlbTogYW55KSB7XHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgbGV0IGFzc2V0OiBjYy5Bc3NldCA9IGl0ZW0uY29udGVudDtcclxuICAgICAgICAgICAgaWYgKGFzc2V0IGluc3RhbmNlb2YgY2MuQXNzZXQpIHtcclxuICAgICAgICAgICAgICAgIGFzc2V0LmFkZFJlZigpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFhc3NldC5yZWZEZXBlbmRzICYmIGl0ZW0uZGVwZW5kS2V5cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkZXBlbmRzID0gaXRlbS5kZXBlbmRLZXlzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVwZW5kcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlSXRlbShsb2FkZXIuZ2V0SXRlbShkZXBlbmRzW2ldKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0LnJlZkRlcGVuZHMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8g5Y6f55Sf6LWE5rqQ44CBaHRtbOWFg+e0oOacieWPr+iDvei1sOWIsOi/memHjO+8jOWOn+eUn+i1hOa6kOmDveaYr+acieWvueW6lOeahGNjLkFzc2V05a+55bqU5byV55So55qE77yM5omA5Lul6L+Z6YeM5Y+v5Lul5LiN5aSE55CGXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgY2FjaGVJdGVtICR7aXRlbX0gaXMgbm90IGNjLkFzc2V0ICR7YXNzZXR9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYGNhY2hlSXRlbSBlcnJvciwgaXRlbSBpcyAke2l0ZW19YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjYWNoZUFzc2V0KGFzc2V0T3JVcmxPclV1aWQ6IGNjLkFzc2V0IHwgc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IGtleSA9IHRoaXMuZ2V0UmVmZXJlbmNlS2V5KGFzc2V0T3JVcmxPclV1aWQpO1xyXG4gICAgICAgIGlmIChrZXkpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSBsb2FkZXIuZ2V0SXRlbShrZXkpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZUl0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYGNhY2hlQXNzZXQgZXJyb3IsIGxvYWRlci5nZXRJdGVtICR7a2V5fSBpcyAke2l0ZW19YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYGNhY2hlQXNzZXQgZXJyb3IsIHRoaXMuZ2V0UmVmZXJlbmNlS2V5ICR7YXNzZXRPclVybE9yVXVpZH0gcmV0dXJuICR7a2V5fWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHiuaUvuS4gOS4qui1hOa6kFxyXG4gICAgICogQHBhcmFtIGl0ZW0g6LWE5rqQ55qEaXRlbeWvueixoVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlbGVhc2VJdGVtKGl0ZW06IGFueSwgZGVjOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgbGV0IGFzc2V0OiBhbnkgPSBpdGVtLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSBpdGVtLnV1aWQgfHwgaXRlbS5pZDtcclxuICAgICAgICAgICAgaWYgKGFzc2V0IGluc3RhbmNlb2YgY2MuQXNzZXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkZWMpIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3NldC5kZWNSZWYoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGFzc2V0LnJlZkNvdW50IDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGVwZW5kcyA9IGl0ZW0uZGVwZW5kS2V5cztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVwZW5kcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRlcGVuZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsZWFzZUl0ZW0obG9hZGVyLmdldEl0ZW0oZGVwZW5kc1tpXSksIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsb2FkZXIucmVsZWFzZShyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZyhgbG9hZGVyLnJlbGVhc2UgY2MuQXNzZXQgJHtyZXN9YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb2FkZXIucmVsZWFzZShyZXMpO1xyXG4gICAgICAgICAgICAgICAgY2MubG9nKGBsb2FkZXIucmVsZWFzZSAke3Jlc30gcmF3QXNzZXQgJHthc3NldH1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgcmVsZWFzZUl0ZW0gZXJyb3IsIGl0ZW0gaXMgJHtpdGVtfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHiuaUvuS4gOS4qui1hOa6kO+8iOS8muWHj+WwkeWFtuW8leeUqOiuoeaVsO+8iVxyXG4gICAgICogQHBhcmFtIGFzc2V0T3JVcmxPclV1aWQgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWxlYXNlQXNzZXQoYXNzZXRPclVybE9yVXVpZDogY2MuQXNzZXQgfCBzdHJpbmcpIHtcclxuICAgICAgICBsZXQga2V5ID0gdGhpcy5nZXRSZWZlcmVuY2VLZXkoYXNzZXRPclVybE9yVXVpZCk7XHJcbiAgICAgICAgaWYgKGtleSkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IGxvYWRlci5nZXRJdGVtKGtleSk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbGVhc2VJdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGByZWxlYXNlQXNzZXQgZXJyb3IsIGxvYWRlci5nZXRJdGVtICR7a2V5fSBpcyAke2l0ZW19YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYHJlbGVhc2VBc3NldCBlcnJvciwgdGhpcy5nZXRSZWZlcmVuY2VLZXkgJHthc3NldE9yVXJsT3JVdWlkfSByZXR1cm4gJHtrZXl9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/NetExample.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '55d23dNa9JDRafcCFqeXFVH', 'NetExample');
// Script/example/NetExample.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WebSock_1 = require("../network/WebSock");
var NetManager_1 = require("../network/NetManager");
var NetNode_1 = require("../network/NetNode");
var NetInterface_1 = require("../network/NetInterface");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NetTips = /** @class */ (function () {
    function NetTips() {
    }
    NetTips.prototype.getLabel = function () {
        var label = null;
        var node = cc.director.getScene().getChildByName("@net_tip_label");
        if (node) {
            label = node.getComponent(cc.Label);
        }
        else {
            node = new cc.Node("@net_tip_label");
            label = node.addComponent(cc.Label);
            node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        }
        return label;
    };
    NetTips.prototype.connectTips = function (isShow) {
        if (isShow) {
            this.getLabel().string = "Connecting";
            this.getLabel().node.active = true;
        }
        else {
            this.getLabel().node.active = false;
        }
    };
    NetTips.prototype.reconnectTips = function (isShow) {
        if (isShow) {
            this.getLabel().string = "Reconnecting";
            this.getLabel().node.active = true;
        }
        else {
            this.getLabel().node.active = false;
        }
    };
    NetTips.prototype.requestTips = function (isShow) {
        if (isShow) {
            this.getLabel().string = "Requesting";
            this.getLabel().node.active = true;
        }
        else {
            this.getLabel().node.active = false;
        }
    };
    return NetTips;
}());
var NetExample = /** @class */ (function (_super) {
    __extends(NetExample, _super);
    function NetExample() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.textLabel = null;
        _this.urlLabel = null;
        _this.msgLabel = null;
        _this.lineCount = 0;
        return _this;
        // update (dt) {}
    }
    NetExample.prototype.onLoad = function () {
        var _this = this;
        var Node = new NetNode_1.NetNode();
        Node.init(new WebSock_1.WebSock(), new NetInterface_1.DefStringProtocol(), new NetTips());
        Node.setResponeHandler(0, function (cmd, data) {
            if (_this.lineCount > 5) {
                var idx = _this.msgLabel.string.search("\n");
                _this.msgLabel.string = _this.msgLabel.string.substr(idx + 1);
            }
            _this.msgLabel.string += data + "\n";
            ++_this.lineCount;
        });
        NetManager_1.NetManager.getInstance().setNetNode(Node);
    };
    NetExample.prototype.onConnectClick = function () {
        NetManager_1.NetManager.getInstance().connect({ url: this.urlLabel.string });
    };
    NetExample.prototype.onSendClick = function () {
        NetManager_1.NetManager.getInstance().send(this.textLabel.string);
    };
    NetExample.prototype.onDisconnectClick = function () {
        NetManager_1.NetManager.getInstance().close();
    };
    __decorate([
        property(cc.Label)
    ], NetExample.prototype, "textLabel", void 0);
    __decorate([
        property(cc.Label)
    ], NetExample.prototype, "urlLabel", void 0);
    __decorate([
        property(cc.RichText)
    ], NetExample.prototype, "msgLabel", void 0);
    NetExample = __decorate([
        ccclass
    ], NetExample);
    return NetExample;
}(cc.Component));
exports.default = NetExample;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS9OZXRFeGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUE2QztBQUM3QyxvREFBbUQ7QUFDbkQsOENBQTZDO0FBQzdDLHdEQUFtRjtBQUk3RSxJQUFBLGtCQUFxQyxFQUFuQyxvQkFBTyxFQUFFLHNCQUEwQixDQUFDO0FBRTVDO0lBQUE7SUF3Q0EsQ0FBQztJQXZDVywwQkFBUSxHQUFoQjtRQUNJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ25FLElBQUksSUFBSSxFQUFFO1lBQ04sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3ZDO2FBQU07WUFDSCxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDckMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELDZCQUFXLEdBQVgsVUFBWSxNQUFlO1FBQ3ZCLElBQUksTUFBTSxFQUFFO1lBQ1IsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7WUFDdEMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3RDO2FBQU07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LENBQUMsUUFBUSxDQUFDO2dEQUNPO0lBTlosVUFBVTtRQUQ5QixPQUFPO09BQ2EsVUFBVSxDQW9DOUI7SUFBRCxpQkFBQztDQXBDRCxBQW9DQyxDQXBDdUMsRUFBRSxDQUFDLFNBQVMsR0FvQ25EO2tCQXBDb0IsVUFBVSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFdlYlNvY2sgfSBmcm9tIFwiLi4vbmV0d29yay9XZWJTb2NrXCI7XG5pbXBvcnQgeyBOZXRNYW5hZ2VyIH0gZnJvbSBcIi4uL25ldHdvcmsvTmV0TWFuYWdlclwiO1xuaW1wb3J0IHsgTmV0Tm9kZSB9IGZyb20gXCIuLi9uZXR3b3JrL05ldE5vZGVcIjtcbmltcG9ydCB7IERlZlN0cmluZ1Byb3RvY29sLCBOZXREYXRhLCBJTmV0d29ya1RpcHMgfSBmcm9tIFwiLi4vbmV0d29yay9OZXRJbnRlcmZhY2VcIjtcblxuXG5cbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XG5cbmNsYXNzIE5ldFRpcHMgaW1wbGVtZW50cyBJTmV0d29ya1RpcHMge1xuICAgIHByaXZhdGUgZ2V0TGFiZWwoKTogY2MuTGFiZWwge1xuICAgICAgICBsZXQgbGFiZWwgPSBudWxsO1xuICAgICAgICBsZXQgbm9kZSA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJAbmV0X3RpcF9sYWJlbFwiKTtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgIGxhYmVsID0gbm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZSA9IG5ldyBjYy5Ob2RlKFwiQG5ldF90aXBfbGFiZWxcIik7XG4gICAgICAgICAgICBsYWJlbCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICAgICAgICAgIG5vZGUuc2V0UG9zaXRpb24oY2Mud2luU2l6ZS53aWR0aCAvIDIsIGNjLndpblNpemUuaGVpZ2h0IC8gMik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhYmVsO1xuICAgIH1cblxuICAgIGNvbm5lY3RUaXBzKGlzU2hvdzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAoaXNTaG93KSB7XG4gICAgICAgICAgICB0aGlzLmdldExhYmVsKCkuc3RyaW5nID0gXCJDb25uZWN0aW5nXCI7XG4gICAgICAgICAgICB0aGlzLmdldExhYmVsKCkubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZXRMYWJlbCgpLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWNvbm5lY3RUaXBzKGlzU2hvdzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAoaXNTaG93KSB7XG4gICAgICAgICAgICB0aGlzLmdldExhYmVsKCkuc3RyaW5nID0gXCJSZWNvbm5lY3RpbmdcIjtcbiAgICAgICAgICAgIHRoaXMuZ2V0TGFiZWwoKS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdldExhYmVsKCkubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlcXVlc3RUaXBzKGlzU2hvdzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAoaXNTaG93KSB7XG4gICAgICAgICAgICB0aGlzLmdldExhYmVsKCkuc3RyaW5nID0gXCJSZXF1ZXN0aW5nXCI7XG4gICAgICAgICAgICB0aGlzLmdldExhYmVsKCkubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZXRMYWJlbCgpLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOZXRFeGFtcGxlIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAgICBAcHJvcGVydHkoY2MuTGFiZWwpXG4gICAgdGV4dExhYmVsOiBjYy5MYWJlbCA9IG51bGw7XG4gICAgQHByb3BlcnR5KGNjLkxhYmVsKVxuICAgIHVybExhYmVsOiBjYy5MYWJlbCA9IG51bGw7XG4gICAgQHByb3BlcnR5KGNjLlJpY2hUZXh0KVxuICAgIG1zZ0xhYmVsOiBjYy5SaWNoVGV4dCA9IG51bGw7XG4gICAgcHJpdmF0ZSBsaW5lQ291bnQ6IG51bWJlciA9IDA7XG5cbiAgICBvbkxvYWQoKSB7XG4gICAgICAgIGxldCBOb2RlID0gbmV3IE5ldE5vZGUoKTtcbiAgICAgICAgTm9kZS5pbml0KG5ldyBXZWJTb2NrKCksIG5ldyBEZWZTdHJpbmdQcm90b2NvbCgpLCBuZXcgTmV0VGlwcygpKTtcbiAgICAgICAgTm9kZS5zZXRSZXNwb25lSGFuZGxlcigwLCAoY21kOiBudW1iZXIsIGRhdGE6IE5ldERhdGEpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmVDb3VudCA+IDUpIHtcbiAgICAgICAgICAgICAgICBsZXQgaWR4ID0gdGhpcy5tc2dMYWJlbC5zdHJpbmcuc2VhcmNoKFwiXFxuXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMubXNnTGFiZWwuc3RyaW5nID0gdGhpcy5tc2dMYWJlbC5zdHJpbmcuc3Vic3RyKGlkeCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tc2dMYWJlbC5zdHJpbmcgKz0gYCR7ZGF0YX1cXG5gO1xuICAgICAgICAgICAgKyt0aGlzLmxpbmVDb3VudDtcbiAgICAgICAgfSk7XG4gICAgICAgIE5ldE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5zZXROZXROb2RlKE5vZGUpO1xuICAgIH1cblxuICAgIG9uQ29ubmVjdENsaWNrKCkge1xuICAgICAgICBOZXRNYW5hZ2VyLmdldEluc3RhbmNlKCkuY29ubmVjdCh7IHVybDogdGhpcy51cmxMYWJlbC5zdHJpbmcgfSk7XG4gICAgfVxuXG4gICAgb25TZW5kQ2xpY2soKSB7XG4gICAgICAgIE5ldE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5zZW5kKHRoaXMudGV4dExhYmVsLnN0cmluZyk7XG4gICAgfVxuXG4gICAgb25EaXNjb25uZWN0Q2xpY2soKSB7XG4gICAgICAgIE5ldE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5jbG9zZSgpO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9XG59XG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/common/TaskQueue.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '26663rTKJRAT5IjOTN+GERU', 'TaskQueue');
// Script/common/TaskQueue.ts

"use strict";
/*
*   任务队列管理器
*   1. 传入任务，进入队列顺序执行
*   2. 支持优先级（从小到大排序，priority越小优先级越高）
*   3. 支持队列Tag，允许多个互不影响的队列执行
*   4. 支持清理任务队列
*   5. 一个任务只能完成一次，避免代码的原因多次调用完成，导致后续任务提前执行
*
*   6. 调试模式下记录了每个Task添加时的堆栈，方便调试（可以快速查看哪个任务没有结束）
*
*   2018-5-7 by 宝爷
*/
Object.defineProperty(exports, "__esModule", { value: true });
var TaskInfo = /** @class */ (function () {
    function TaskInfo(task, priority) {
        this.task = task;
        this.priority = priority;
    }
    return TaskInfo;
}());
var TaskQueue = /** @class */ (function () {
    function TaskQueue() {
        this._curTask = null;
        this._taskQueue = Array();
    }
    // 添加一个任务，如果当前没有任务在执行，该任务会立即执行，否则进入队列等待
    TaskQueue.prototype.pushTask = function (task, priority) {
        if (priority === void 0) { priority = 0; }
        var taskInfo = new TaskInfo(task, priority);
        if (this._taskQueue.length > 0) {
            for (var i = this._taskQueue.length - 1; i >= 0; --i) {
                if (this._taskQueue[i].priority <= priority) {
                    this._taskQueue.splice(i + 1, 0, taskInfo);
                    return;
                }
            }
        }
        // 插到头部
        this._taskQueue.splice(0, 0, taskInfo);
        if (this._curTask == null) {
            this.executeNextTask();
        }
    };
    TaskQueue.prototype.clearTask = function () {
        this._curTask = null;
        this._taskQueue.length = 0;
    };
    TaskQueue.prototype.executeNextTask = function () {
        var _this = this;
        var taskInfo = this._taskQueue.shift() || null;
        this._curTask = taskInfo;
        if (taskInfo) {
            taskInfo.task(function () {
                if (taskInfo === _this._curTask) {
                    _this.executeNextTask();
                }
                else {
                    console.warn("your task finish twice!");
                }
            });
        }
    };
    return TaskQueue;
}());
exports.TaskQueue = TaskQueue;
var TaskManager = /** @class */ (function () {
    function TaskManager() {
        this._taskQueues = {};
    }
    TaskManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new TaskManager();
        }
        return this._instance;
    };
    TaskManager.destory = function () {
        this._instance = null;
    };
    TaskManager.prototype.pushTask = function (task, priority) {
        if (priority === void 0) { priority = 0; }
        return this.getTaskQueue().pushTask(task, priority);
    };
    TaskManager.prototype.pushTaskByTag = function (task, tag, priority) {
        if (priority === void 0) { priority = 0; }
        return this.getTaskQueue(tag).pushTask(task, priority);
    };
    TaskManager.prototype.clearTaskQueue = function (tag) {
        if (tag === void 0) { tag = 0; }
        var taskQueue = this._taskQueues[tag];
        if (taskQueue) {
            taskQueue.clearTask();
        }
    };
    TaskManager.prototype.clearAllTaskQueue = function () {
        for (var queue in this._taskQueues) {
            this._taskQueues[queue].clearTask();
        }
        this._taskQueues = {};
    };
    TaskManager.prototype.getTaskQueue = function (tag) {
        if (tag === void 0) { tag = 0; }
        var taskQueue = this._taskQueues[tag];
        if (taskQueue == null) {
            taskQueue = new TaskQueue();
            this._taskQueues[tag] = taskQueue;
        }
        return taskQueue;
    };
    TaskManager._instance = null;
    return TaskManager;
}());
exports.TaskManager = TaskManager;
/* 测试用例：
* 1. 测试多个任务的执行顺序 + 优先级
* 2. 测试在执行任务的过程中动态添加新任务

export function testQueue() {
    let creatTask = (idx, pri): TaskCallback => {
        return (finish) => {
            console.log(`execute task ${idx} priority ${pri}`);
            finish();
        };
    };
    let tag = 0;
    let begin = (finish) => {
        for (var i = 0; i < 100; ++i) {
            let priority = 0;
            if (i % 10 == 0) {
                priority = -1;
            } else if (i == 88) {
                priority = 1;
            } else if (i == 22) {
                let task = creatTask(1.1, priority);
                TaskManager.getInstance().pushTaskByTag(task, tag, priority);
                task = creatTask(1.2, priority);
                TaskManager.getInstance().pushTaskByTag(task, tag, priority);
                task = creatTask(1.3, priority);
                TaskManager.getInstance().pushTaskByTag(task, tag, priority);
            } else if (i == 51 && tag == 2) {
                // 清理之后，添加的任务会立即执行...
                TaskManager.getInstance().clearTaskQueue(tag);
            }
            let task = creatTask(i, priority);
            Object.defineProperty(task, "idx", { value: i });
            TaskManager.getInstance().pushTaskByTag(task, tag, priority);
        }
        console.log("add task finish, start test");
        finish();
        // 测试重复调用结束
        finish();
        // tag为2时的finish两次都会报警告，因为begin已经被清理了
    }
    TaskManager.getInstance().pushTaskByTag(begin, tag);
    tag = 2;
    TaskManager.getInstance().pushTaskByTag(begin, tag);

}*/

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvY29tbW9uL1Rhc2tRdWV1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7O0VBV0U7O0FBUUY7SUFHSSxrQkFBbUIsSUFBa0IsRUFBRSxRQUFnQjtRQUNuRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUM3QixDQUFDO0lBQ0wsZUFBQztBQUFELENBUEEsQUFPQyxJQUFBO0FBRUQ7SUFBQTtRQUNZLGFBQVEsR0FBYSxJQUFJLENBQUM7UUFDMUIsZUFBVSxHQUFlLEtBQUssRUFBWSxDQUFDO0lBc0N2RCxDQUFDO0lBcENHLHVDQUF1QztJQUNoQyw0QkFBUSxHQUFmLFVBQWdCLElBQWtCLEVBQUUsUUFBb0I7UUFBcEIseUJBQUEsRUFBQSxZQUFvQjtRQUNwRCxJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDNUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDNUIsS0FBSyxJQUFJLENBQUMsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDMUQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLEVBQUU7b0JBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUMzQyxPQUFPO2lCQUNWO2FBQ0o7U0FDSjtRQUNELE9BQU87UUFDUCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLElB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REMsSUFBQTtBQWpEWSxrQ0FBVztBQW1EeEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNENHIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiogICDku7vliqHpmJ/liJfnrqHnkIblmahcbiogICAxLiDkvKDlhaXku7vliqHvvIzov5vlhaXpmJ/liJfpobrluo/miafooYxcbiogICAyLiDmlK/mjIHkvJjlhYjnuqfvvIjku47lsI/liLDlpKfmjpLluo/vvIxwcmlvcml0eei2iuWwj+S8mOWFiOe6p+i2iumrmO+8iVxuKiAgIDMuIOaUr+aMgemYn+WIl1RhZ++8jOWFgeiuuOWkmuS4quS6kuS4jeW9seWTjeeahOmYn+WIl+aJp+ihjFxuKiAgIDQuIOaUr+aMgea4heeQhuS7u+WKoemYn+WIl1xuKiAgIDUuIOS4gOS4quS7u+WKoeWPquiDveWujOaIkOS4gOasoe+8jOmBv+WFjeS7o+eggeeahOWOn+WboOWkmuasoeiwg+eUqOWujOaIkO+8jOWvvOiHtOWQjue7reS7u+WKoeaPkOWJjeaJp+ihjFxuKlxuKiAgIDYuIOiwg+ivleaooeW8j+S4i+iusOW9leS6huavj+S4qlRhc2vmt7vliqDml7bnmoTloIbmoIjvvIzmlrnkvr/osIPor5XvvIjlj6/ku6Xlv6vpgJ/mn6XnnIvlk6rkuKrku7vliqHmsqHmnInnu5PmnZ/vvIlcbiogICBcbiogICAyMDE4LTUtNyBieSDlrp3niLdcbiovXG5cblxuLy8g5Lu75Yqh57uT5p2f5Zue6LCDXG5leHBvcnQgdHlwZSBUYXNrRmluaXNoQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xuLy8g5Lu75Yqh5omn6KGM5Zue6LCDXG5leHBvcnQgdHlwZSBUYXNrQ2FsbGJhY2sgPSAoVGFza0ZpbmlzaENhbGxiYWNrKSA9PiB2b2lkO1xuXG5jbGFzcyBUYXNrSW5mbyB7XG4gICAgcHVibGljIHRhc2s6IFRhc2tDYWxsYmFjaztcbiAgICBwdWJsaWMgcHJpb3JpdHk6IG51bWJlcjtcbiAgICBwdWJsaWMgY29uc3RydWN0b3IodGFzazogVGFza0NhbGxiYWNrLCBwcmlvcml0eTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudGFzayA9IHRhc2s7XG4gICAgICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUYXNrUXVldWUge1xuICAgIHByaXZhdGUgX2N1clRhc2s6IFRhc2tJbmZvID0gbnVsbDtcbiAgICBwcml2YXRlIF90YXNrUXVldWU6IFRhc2tJbmZvW10gPSBBcnJheTxUYXNrSW5mbz4oKTtcblxuICAgIC8vIOa3u+WKoOS4gOS4quS7u+WKoe+8jOWmguaenOW9k+WJjeayoeacieS7u+WKoeWcqOaJp+ihjO+8jOivpeS7u+WKoeS8mueri+WNs+aJp+ihjO+8jOWQpuWImei/m+WFpemYn+WIl+etieW+hVxuICAgIHB1YmxpYyBwdXNoVGFzayh0YXNrOiBUYXNrQ2FsbGJhY2ssIHByaW9yaXR5OiBudW1iZXIgPSAwKTogdm9pZCB7XG4gICAgICAgIGxldCB0YXNrSW5mbyA9IG5ldyBUYXNrSW5mbyh0YXNrLCBwcmlvcml0eSk7XG4gICAgICAgIGlmICh0aGlzLl90YXNrUXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gdGhpcy5fdGFza1F1ZXVlLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3Rhc2tRdWV1ZVtpXS5wcmlvcml0eSA8PSBwcmlvcml0eSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90YXNrUXVldWUuc3BsaWNlKGkgKyAxLCAwLCB0YXNrSW5mbyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8g5o+S5Yiw5aS06YOoXG4gICAgICAgIHRoaXMuX3Rhc2tRdWV1ZS5zcGxpY2UoMCwgMCwgdGFza0luZm8pO1xuICAgICAgICBpZiAodGhpcy5fY3VyVGFzayA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVOZXh0VGFzaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyVGFzaygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fY3VyVGFzayA9IG51bGw7XG4gICAgICAgIHRoaXMuX3Rhc2tRdWV1ZS5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXhlY3V0ZU5leHRUYXNrKCk6IHZvaWQge1xuICAgICAgICBsZXQgdGFza0luZm8gPSB0aGlzLl90YXNrUXVldWUuc2hpZnQoKSB8fCBudWxsO1xuICAgICAgICB0aGlzLl9jdXJUYXNrID0gdGFza0luZm87XG4gICAgICAgIGlmICh0YXNrSW5mbykge1xuICAgICAgICAgICAgdGFza0luZm8udGFzaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2tJbmZvID09PSB0aGlzLl9jdXJUYXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhlY3V0ZU5leHRUYXNrKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwieW91ciB0YXNrIGZpbmlzaCB0d2ljZSFcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUYXNrTWFuYWdlciB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBUYXNrTWFuYWdlciA9IG51bGw7XG4gICAgcHJpdmF0ZSBfdGFza1F1ZXVlczogeyBba2V5OiBudW1iZXJdOiBUYXNrUXVldWUgfSA9IHt9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IFRhc2tNYW5hZ2VyIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xuICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgVGFza01hbmFnZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5faW5zdGFuY2U7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBkZXN0b3J5KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBwdXNoVGFzayh0YXNrOiBUYXNrQ2FsbGJhY2ssIHByaW9yaXR5OiBudW1iZXIgPSAwKTogdm9pZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFRhc2tRdWV1ZSgpLnB1c2hUYXNrKHRhc2ssIHByaW9yaXR5KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHVzaFRhc2tCeVRhZyh0YXNrOiBUYXNrQ2FsbGJhY2ssIHRhZzogbnVtYmVyLCBwcmlvcml0eTogbnVtYmVyID0gMCk6IHZvaWQge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUYXNrUXVldWUodGFnKS5wdXNoVGFzayh0YXNrLCBwcmlvcml0eSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyVGFza1F1ZXVlKHRhZzogbnVtYmVyID0gMCk6IHZvaWQge1xuICAgICAgICBsZXQgdGFza1F1ZXVlID0gdGhpcy5fdGFza1F1ZXVlc1t0YWddO1xuICAgICAgICBpZiAodGFza1F1ZXVlKSB7XG4gICAgICAgICAgICB0YXNrUXVldWUuY2xlYXJUYXNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYXJBbGxUYXNrUXVldWUoKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IHF1ZXVlIGluIHRoaXMuX3Rhc2tRdWV1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuX3Rhc2tRdWV1ZXNbcXVldWVdLmNsZWFyVGFzaygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Rhc2tRdWV1ZXMgPSB7fVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGFza1F1ZXVlKHRhZzogbnVtYmVyID0gMCk6IFRhc2tRdWV1ZSB7XG4gICAgICAgIGxldCB0YXNrUXVldWUgPSB0aGlzLl90YXNrUXVldWVzW3RhZ107XG4gICAgICAgIGlmICh0YXNrUXVldWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGFza1F1ZXVlID0gbmV3IFRhc2tRdWV1ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdGFza1F1ZXVlc1t0YWddID0gdGFza1F1ZXVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXNrUXVldWU7XG4gICAgfVxufVxuXG4vKiDmtYvor5XnlKjkvovvvJpcbiogMS4g5rWL6K+V5aSa5Liq5Lu75Yqh55qE5omn6KGM6aG65bqPICsg5LyY5YWI57qnXG4qIDIuIOa1i+ivleWcqOaJp+ihjOS7u+WKoeeahOi/h+eoi+S4reWKqOaAgea3u+WKoOaWsOS7u+WKoVxuXG5leHBvcnQgZnVuY3Rpb24gdGVzdFF1ZXVlKCkge1xuICAgIGxldCBjcmVhdFRhc2sgPSAoaWR4LCBwcmkpOiBUYXNrQ2FsbGJhY2sgPT4ge1xuICAgICAgICByZXR1cm4gKGZpbmlzaCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYGV4ZWN1dGUgdGFzayAke2lkeH0gcHJpb3JpdHkgJHtwcml9YCk7XG4gICAgICAgICAgICBmaW5pc2goKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIGxldCB0YWcgPSAwO1xuICAgIGxldCBiZWdpbiA9IChmaW5pc2gpID0+IHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDA7ICsraSkge1xuICAgICAgICAgICAgbGV0IHByaW9yaXR5ID0gMDtcbiAgICAgICAgICAgIGlmIChpICUgMTAgPT0gMCkge1xuICAgICAgICAgICAgICAgIHByaW9yaXR5ID0gLTE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gODgpIHtcbiAgICAgICAgICAgICAgICBwcmlvcml0eSA9IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gMjIpIHtcbiAgICAgICAgICAgICAgICBsZXQgdGFzayA9IGNyZWF0VGFzaygxLjEsIHByaW9yaXR5KTtcbiAgICAgICAgICAgICAgICBUYXNrTWFuYWdlci5nZXRJbnN0YW5jZSgpLnB1c2hUYXNrQnlUYWcodGFzaywgdGFnLCBwcmlvcml0eSk7XG4gICAgICAgICAgICAgICAgdGFzayA9IGNyZWF0VGFzaygxLjIsIHByaW9yaXR5KTtcbiAgICAgICAgICAgICAgICBUYXNrTWFuYWdlci5nZXRJbnN0YW5jZSgpLnB1c2hUYXNrQnlUYWcodGFzaywgdGFnLCBwcmlvcml0eSk7XG4gICAgICAgICAgICAgICAgdGFzayA9IGNyZWF0VGFzaygxLjMsIHByaW9yaXR5KTtcbiAgICAgICAgICAgICAgICBUYXNrTWFuYWdlci5nZXRJbnN0YW5jZSgpLnB1c2hUYXNrQnlUYWcodGFzaywgdGFnLCBwcmlvcml0eSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gNTEgJiYgdGFnID09IDIpIHtcbiAgICAgICAgICAgICAgICAvLyDmuIXnkIbkuYvlkI7vvIzmt7vliqDnmoTku7vliqHkvJrnq4vljbPmiafooYwuLi5cbiAgICAgICAgICAgICAgICBUYXNrTWFuYWdlci5nZXRJbnN0YW5jZSgpLmNsZWFyVGFza1F1ZXVlKHRhZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdGFzayA9IGNyZWF0VGFzayhpLCBwcmlvcml0eSk7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFzaywgXCJpZHhcIiwgeyB2YWx1ZTogaSB9KTtcbiAgICAgICAgICAgIFRhc2tNYW5hZ2VyLmdldEluc3RhbmNlKCkucHVzaFRhc2tCeVRhZyh0YXNrLCB0YWcsIHByaW9yaXR5KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcImFkZCB0YXNrIGZpbmlzaCwgc3RhcnQgdGVzdFwiKTtcbiAgICAgICAgZmluaXNoKCk7XG4gICAgICAgIC8vIOa1i+ivlemHjeWkjeiwg+eUqOe7k+adn1xuICAgICAgICBmaW5pc2goKTtcbiAgICAgICAgLy8gdGFn5Li6MuaXtueahGZpbmlzaOS4pOasoemDveS8muaKpeitpuWRiu+8jOWboOS4umJlZ2lu5bey57uP6KKr5riF55CG5LqGXG4gICAgfVxuICAgIFRhc2tNYW5hZ2VyLmdldEluc3RhbmNlKCkucHVzaFRhc2tCeVRhZyhiZWdpbiwgdGFnKTtcbiAgICB0YWcgPSAyO1xuICAgIFRhc2tNYW5hZ2VyLmdldEluc3RhbmNlKCkucHVzaFRhc2tCeVRhZyhiZWdpbiwgdGFnKTtcblxufSovXG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/UIExample.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '1ac13Sq8cxLKZtQe1hCgor0', 'UIExample');
// Script/example/UIExample.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var UIManager_1 = require("../ui/UIManager");
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var _b = cc._decorator, ccclass = _b.ccclass, property = _b.property;
var UIID;
(function (UIID) {
    UIID[UIID["UILogin"] = 0] = "UILogin";
    UIID[UIID["UIHall"] = 1] = "UIHall";
    UIID[UIID["UINotice"] = 2] = "UINotice";
    UIID[UIID["UIBag"] = 3] = "UIBag";
})(UIID = exports.UIID || (exports.UIID = {}));
exports.UICF = (_a = {},
    _a[UIID.UILogin] = { prefab: "Prefab/Login" },
    _a[UIID.UIHall] = { prefab: "Prefab/Hall" },
    _a[UIID.UINotice] = { prefab: "Prefab/Notice" },
    _a[UIID.UIBag] = { prefab: "Prefab/Bag", preventTouch: true },
    _a);
var UIExample = /** @class */ (function (_super) {
    __extends(UIExample, _super);
    function UIExample() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIExample.prototype.start = function () {
        UIManager_1.uiManager.initUIConf(exports.UICF);
        UIManager_1.uiManager.open(UIID.UILogin);
    };
    UIExample = __decorate([
        ccclass
    ], UIExample);
    return UIExample;
}(cc.Component));
exports.default = UIExample;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS9VSUV4YW1wbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUFvRDtBQUdwRCxvQkFBb0I7QUFDcEIsa0ZBQWtGO0FBQ2xGLHlGQUF5RjtBQUN6RixtQkFBbUI7QUFDbkIsNEZBQTRGO0FBQzVGLG1HQUFtRztBQUNuRyw4QkFBOEI7QUFDOUIsNEZBQTRGO0FBQzVGLG1HQUFtRztBQUU3RixJQUFBLGtCQUFxQyxFQUFuQyxvQkFBTyxFQUFFLHNCQUEwQixDQUFDO0FBRTVDLElBQVksSUFLWDtBQUxELFdBQVksSUFBSTtJQUNaLHFDQUFPLENBQUE7SUFDUCxtQ0FBTSxDQUFBO0lBQ04sdUNBQVEsQ0FBQTtJQUNSLGlDQUFLLENBQUE7QUFDVCxDQUFDLEVBTFcsSUFBSSxHQUFKLFlBQUksS0FBSixZQUFJLFFBS2Y7QUFFVSxRQUFBLElBQUk7SUFDWCxHQUFDLElBQUksQ0FBQyxPQUFPLElBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFO0lBQzFDLEdBQUMsSUFBSSxDQUFDLE1BQU0sSUFBRyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUU7SUFDeEMsR0FBQyxJQUFJLENBQUMsUUFBUSxJQUFHLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRTtJQUM1QyxHQUFDLElBQUksQ0FBQyxLQUFLLElBQUcsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUU7UUFDN0Q7QUFHRDtJQUF1Qyw2QkFBWTtJQUFuRDs7SUFRQSxDQUFDO0lBTkcseUJBQUssR0FBTDtRQUNJLHFCQUFTLENBQUMsVUFBVSxDQUFDLFlBQUksQ0FBQyxDQUFDO1FBQzNCLHFCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBTGdCLFNBQVM7UUFEN0IsT0FBTztPQUNhLFNBQVMsQ0FRN0I7SUFBRCxnQkFBQztDQVJELEFBUUMsQ0FSc0MsRUFBRSxDQUFDLFNBQVMsR0FRbEQ7a0JBUm9CLFNBQVMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVSUNvbmYsIHVpTWFuYWdlciB9IGZyb20gXCIuLi91aS9VSU1hbmFnZXJcIjtcbmltcG9ydCB7IHJlc0xvYWRlciB9IGZyb20gXCIuLi9yZXMvUmVzTG9hZGVyXCI7XG5cbi8vIExlYXJuIFR5cGVTY3JpcHQ6XG4vLyAgLSBbQ2hpbmVzZV0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC96aC9zY3JpcHRpbmcvdHlwZXNjcmlwdC5odG1sXG4vLyAgLSBbRW5nbGlzaF0gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnL2RvY3MvY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3R5cGVzY3JpcHQuaHRtbFxuLy8gTGVhcm4gQXR0cmlidXRlOlxuLy8gIC0gW0NoaW5lc2VdIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvemgvc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcbi8vICAtIFtFbmdsaXNoXSBodHRwOi8vd3d3LmNvY29zMmQteC5vcmcvZG9jcy9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XG4vLyAgLSBbQ2hpbmVzZV0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC96aC9zY3JpcHRpbmcvbGlmZS1jeWNsZS1jYWxsYmFja3MuaHRtbFxuLy8gIC0gW0VuZ2xpc2hdIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZy9kb2NzL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9saWZlLWN5Y2xlLWNhbGxiYWNrcy5odG1sXG5cbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XG5cbmV4cG9ydCBlbnVtIFVJSUQge1xuICAgIFVJTG9naW4sXG4gICAgVUlIYWxsLFxuICAgIFVJTm90aWNlLFxuICAgIFVJQmFnLFxufVxuXG5leHBvcnQgbGV0IFVJQ0Y6IHsgW2tleTogbnVtYmVyXTogVUlDb25mIH0gPSB7XG4gICAgW1VJSUQuVUlMb2dpbl06IHsgcHJlZmFiOiBcIlByZWZhYi9Mb2dpblwiIH0sXG4gICAgW1VJSUQuVUlIYWxsXTogeyBwcmVmYWI6IFwiUHJlZmFiL0hhbGxcIiB9LFxuICAgIFtVSUlELlVJTm90aWNlXTogeyBwcmVmYWI6IFwiUHJlZmFiL05vdGljZVwiIH0sXG4gICAgW1VJSUQuVUlCYWddOiB7IHByZWZhYjogXCJQcmVmYWIvQmFnXCIsIHByZXZlbnRUb3VjaDogdHJ1ZSB9LFxufVxuXG5AY2NjbGFzc1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVUlFeGFtcGxlIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcblxuICAgIHN0YXJ0KCkge1xuICAgICAgICB1aU1hbmFnZXIuaW5pdFVJQ29uZihVSUNGKTtcbiAgICAgICAgdWlNYW5hZ2VyLm9wZW4oVUlJRC5VSUxvZ2luKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgKGR0KSB7fVxufVxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/ResExample.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '35e3enlxPVNnbcdFPQpVJAV', 'ResExample');
// Script/example/ResExample.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ResLoader_1 = require("../res/ResLoader");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NetExample = /** @class */ (function (_super) {
    __extends(NetExample, _super);
    function NetExample() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.attachNode = null;
        _this.dumpLabel = null;
        _this.ress = null;
        _this.remoteRes = null;
        return _this;
    }
    NetExample.prototype.start = function () {
    };
    NetExample.prototype.onLoadRes = function () {
        var _this = this;
        cc.loader.loadRes("prefabDir/HelloWorld", cc.Prefab, function (error, prefab) {
            if (!error) {
                cc.instantiate(prefab).parent = _this.attachNode;
            }
        });
    };
    NetExample.prototype.onUnloadRes = function () {
        this.attachNode.destroyAllChildren();
        cc.loader.releaseRes("prefabDir/HelloWorld");
    };
    NetExample.prototype.onMyLoadRes = function () {
        var _this = this;
        ResLoader_1.default.loadDir("prefabDir", cc.Prefab, function (error, prefabs) {
            if (!error) {
                _this.ress = prefabs;
                for (var i = 0; i < prefabs.length; ++i) {
                    cc.instantiate(prefabs[i]).parent = _this.attachNode;
                }
            }
        });
    };
    NetExample.prototype.onMyUnloadRes = function () {
        this.attachNode.destroyAllChildren();
        if (this.ress) {
            for (var _i = 0, _a = this.ress; _i < _a.length; _i++) {
                var item = _a[_i];
                ResLoader_1.default.release(item);
            }
            this.ress = null;
        }
    };
    NetExample.prototype.onLoadRemote = function () {
        var _this = this;
        ResLoader_1.default.load("http://tools.itharbors.com/christmas/res/tree.png", function (err, res) {
            if (err || !res)
                return;
            _this.remoteRes = res;
            var spriteFrame = new cc.SpriteFrame(res);
            var node = new cc.Node("tmp");
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            node.parent = _this.attachNode;
        });
    };
    NetExample.prototype.onUnloadRemote = function () {
        this.attachNode.destroyAllChildren();
        this.remoteRes.decRef();
    };
    NetExample.prototype.onDump = function () {
        var Loader = cc.loader;
        this.dumpLabel.string = "\u5F53\u524D\u8D44\u6E90\u603B\u6570:" + Object.keys(Loader._cache).length;
    };
    __decorate([
        property(cc.Node)
    ], NetExample.prototype, "attachNode", void 0);
    __decorate([
        property(cc.Label)
    ], NetExample.prototype, "dumpLabel", void 0);
    NetExample = __decorate([
        ccclass
    ], NetExample);
    return NetExample;
}(cc.Component));
exports.default = NetExample;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS9SZXNFeGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUF3RDtBQUVsRCxJQUFBLGtCQUFxQyxFQUFuQyxvQkFBTyxFQUFFLHNCQUEwQixDQUFDO0FBRzVDO0lBQXdDLDhCQUFZO0lBRHBEO1FBQUEscUVBbUVDO1FBaEVHLGdCQUFVLEdBQVksSUFBSSxDQUFDO1FBRTNCLGVBQVMsR0FBYSxJQUFJLENBQUM7UUFDM0IsVUFBSSxHQUFlLElBQUksQ0FBQztRQUN4QixlQUFTLEdBQWEsSUFBSSxDQUFDOztJQTREL0IsQ0FBQztJQTFERywwQkFBSyxHQUFMO0lBQ0EsQ0FBQztJQUVELDhCQUFTLEdBQVQ7UUFBQSxpQkFNQztRQUxHLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFZLEVBQUUsTUFBaUI7WUFDakYsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDUixFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDO2FBQ25EO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsZ0NBQVcsR0FBWDtRQUNJLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNyQyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxnQ0FBVyxHQUFYO1FBQUEsaUJBU0M7UUFSRyxtQkFBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQVksRUFBRSxPQUFvQjtZQUN6RSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNSLEtBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO2dCQUNwQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtvQkFDckMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQztpQkFDdkQ7YUFDSjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGtDQUFhLEdBQWI7UUFDSSxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDckMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1gsS0FBZ0IsVUFBUyxFQUFULEtBQUEsSUFBSSxDQUFDLElBQUksRUFBVCxjQUFTLEVBQVQsSUFBUyxFQUFFO2dCQUF2QixJQUFJLElBQUksU0FBQTtnQkFDUixtQkFBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMzQjtZQUNELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO0lBQ0wsQ0FBQztJQUVELGlDQUFZLEdBQVo7UUFBQSxpQkFVQztRQVRHLG1CQUFTLENBQUMsSUFBSSxDQUFDLG1EQUFtRCxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDekUsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHO2dCQUFFLE9BQU87WUFDeEIsS0FBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7WUFDckIsSUFBSSxXQUFXLEdBQUcsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFDLElBQUksSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsbUNBQWMsR0FBZDtRQUNJLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCwyQkFBTSxHQUFOO1FBQ0ksSUFBSSxNQUFNLEdBQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRywwQ0FBVSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFRLENBQUM7SUFDMUUsQ0FBQztJQS9ERDtRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO2tEQUNTO0lBRTNCO1FBREMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7aURBQ1E7SUFKVixVQUFVO1FBRDlCLE9BQU87T0FDYSxVQUFVLENBa0U5QjtJQUFELGlCQUFDO0NBbEVELEFBa0VDLENBbEV1QyxFQUFFLENBQUMsU0FBUyxHQWtFbkQ7a0JBbEVvQixVQUFVIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlc0xvYWRlciwgeyByZXNMb2FkZXIgfSBmcm9tIFwiLi4vcmVzL1Jlc0xvYWRlclwiO1xyXG5cclxuY29uc3QgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5ldEV4YW1wbGUgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xyXG4gICAgQHByb3BlcnR5KGNjLk5vZGUpXHJcbiAgICBhdHRhY2hOb2RlOiBjYy5Ob2RlID0gbnVsbDtcclxuICAgIEBwcm9wZXJ0eShjYy5MYWJlbClcclxuICAgIGR1bXBMYWJlbDogY2MuTGFiZWwgPSBudWxsO1xyXG4gICAgcmVzczogY2MuQXNzZXRbXSA9IG51bGw7XHJcbiAgICByZW1vdGVSZXM6IGNjLkFzc2V0ID0gbnVsbDtcclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWRSZXMoKSB7XHJcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWJEaXIvSGVsbG9Xb3JsZFwiLCBjYy5QcmVmYWIsIChlcnJvcjogRXJyb3IsIHByZWZhYjogY2MuUHJlZmFiKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNjLmluc3RhbnRpYXRlKHByZWZhYikucGFyZW50ID0gdGhpcy5hdHRhY2hOb2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25VbmxvYWRSZXMoKSB7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hOb2RlLmRlc3Ryb3lBbGxDaGlsZHJlbigpO1xyXG4gICAgICAgIGNjLmxvYWRlci5yZWxlYXNlUmVzKFwicHJlZmFiRGlyL0hlbGxvV29ybGRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgb25NeUxvYWRSZXMoKSB7XHJcbiAgICAgICAgUmVzTG9hZGVyLmxvYWREaXIoXCJwcmVmYWJEaXJcIiwgY2MuUHJlZmFiLCAoZXJyb3I6IEVycm9yLCBwcmVmYWJzOiBjYy5QcmVmYWJbXSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3MgPSBwcmVmYWJzO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmVmYWJzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuaW5zdGFudGlhdGUocHJlZmFic1tpXSkucGFyZW50ID0gdGhpcy5hdHRhY2hOb2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25NeVVubG9hZFJlcygpIHtcclxuICAgICAgICB0aGlzLmF0dGFjaE5vZGUuZGVzdHJveUFsbENoaWxkcmVuKCk7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzcykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGl0ZW0gb2YgdGhpcy5yZXNzKSB7XHJcbiAgICAgICAgICAgICAgICBSZXNMb2FkZXIucmVsZWFzZShpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlc3MgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWRSZW1vdGUoKSB7XHJcbiAgICAgICAgUmVzTG9hZGVyLmxvYWQoXCJodHRwOi8vdG9vbHMuaXRoYXJib3JzLmNvbS9jaHJpc3RtYXMvcmVzL3RyZWUucG5nXCIsIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyIHx8ICFyZXMpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdGVSZXMgPSByZXM7XHJcbiAgICAgICAgICAgIGxldCBzcHJpdGVGcmFtZSA9IG5ldyBjYy5TcHJpdGVGcmFtZShyZXMpO1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBjYy5Ob2RlKFwidG1wXCIpO1xyXG4gICAgICAgICAgICBsZXQgc3ByaXRlID0gbm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcclxuICAgICAgICAgICAgc3ByaXRlLnNwcml0ZUZyYW1lID0gc3ByaXRlRnJhbWU7XHJcbiAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5hdHRhY2hOb2RlO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgb25VbmxvYWRSZW1vdGUoKSB7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hOb2RlLmRlc3Ryb3lBbGxDaGlsZHJlbigpO1xyXG4gICAgICAgIHRoaXMucmVtb3RlUmVzLmRlY1JlZigpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRHVtcCgpIHtcclxuICAgICAgICBsZXQgTG9hZGVyOmFueSA9IGNjLmxvYWRlcjtcclxuICAgICAgICB0aGlzLmR1bXBMYWJlbC5zdHJpbmcgPSBg5b2T5YmN6LWE5rqQ5oC75pWwOiR7T2JqZWN0LmtleXMoTG9hZGVyLl9jYWNoZSkubGVuZ3RofWA7XHJcbiAgICB9XHJcbn1cclxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/ResKeeperExample.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '44dff6sUhxOK5EHy6webOHq', 'ResKeeperExample');
// Script/example/ResKeeperExample.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ResLeakChecker_1 = require("../res/ResLeakChecker");
var ResLoader_1 = require("../res/ResLoader");
var ResUtil_1 = require("../res/ResUtil");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NetExample = /** @class */ (function (_super) {
    __extends(NetExample, _super);
    function NetExample() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resUtilMode = true;
        _this.attachNode = null;
        _this.dumpLabel = null;
        _this.checker = new ResLeakChecker_1.ResLeakChecker();
        return _this;
    }
    NetExample.prototype.start = function () {
        this.checker.startCheck();
    };
    NetExample.prototype.onAdd = function () {
        var _this = this;
        ResLoader_1.default.load("prefabDir/HelloWorld", cc.Prefab, function (error, prefab) {
            if (!error) {
                var myNode = ResUtil_1.ResUtil.instantiate(prefab);
                myNode.parent = _this.attachNode;
                myNode.setPosition((Math.random() * 500) - 250, myNode.position.y);
                console.log(myNode.position);
                prefab.decRef();
            }
        });
    };
    NetExample.prototype.onSub = function () {
        if (this.attachNode.childrenCount > 0) {
            this.attachNode.children[this.attachNode.childrenCount - 1].destroy();
        }
    };
    NetExample.prototype.onAssign = function () {
        var _this = this;
        ResLoader_1.default.load("images/test", cc.SpriteFrame, function (error, sp) {
            _this.checker.traceAsset(sp);
            if (_this.attachNode.childrenCount > 0) {
                var targetNode = _this.attachNode.children[_this.attachNode.childrenCount - 1];
                targetNode.getComponent(cc.Sprite).spriteFrame = ResUtil_1.ResUtil.assignWith(sp, targetNode, true);
            }
            sp.decRef();
        });
    };
    NetExample.prototype.onClean = function () {
        this.attachNode.destroyAllChildren();
    };
    NetExample.prototype.onDump = function () {
        this.checker.dump();
        var Loader = cc.loader;
        this.dumpLabel.string = "\u5F53\u524D\u8D44\u6E90\u603B\u6570:" + Object.keys(Loader._cache).length;
    };
    NetExample.prototype.onLoadClick = function () {
        cc.director.loadScene("example_empty");
    };
    NetExample.prototype.onPreloadClick = function () {
        cc.director.preloadScene("example_empty");
    };
    __decorate([
        property(cc.Boolean)
    ], NetExample.prototype, "resUtilMode", void 0);
    __decorate([
        property(cc.Node)
    ], NetExample.prototype, "attachNode", void 0);
    __decorate([
        property(cc.Label)
    ], NetExample.prototype, "dumpLabel", void 0);
    NetExample = __decorate([
        ccclass
    ], NetExample);
    return NetExample;
}(cc.Component));
exports.default = NetExample;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS9SZXNLZWVwZXJFeGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdEQUF1RDtBQUN2RCw4Q0FBd0Q7QUFDeEQsMENBQXlDO0FBRW5DLElBQUEsa0JBQXFDLEVBQW5DLG9CQUFPLEVBQUUsc0JBQTBCLENBQUM7QUFHNUM7SUFBd0MsOEJBQVk7SUFEcEQ7UUFBQSxxRUE0REM7UUF6REcsaUJBQVcsR0FBRyxJQUFJLENBQUM7UUFFbkIsZ0JBQVUsR0FBWSxJQUFJLENBQUM7UUFFM0IsZUFBUyxHQUFhLElBQUksQ0FBQztRQUMzQixhQUFPLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7O0lBb0RuQyxDQUFDO0lBbERHLDBCQUFLLEdBQUw7UUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCwwQkFBSyxHQUFMO1FBQUEsaUJBVUM7UUFURyxtQkFBUyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBWSxFQUFFLE1BQWlCO1lBQzlFLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1IsSUFBSSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNuQjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDBCQUFLLEdBQUw7UUFDSSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxHQUFHLENBQUMsRUFBRTtZQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN6RTtJQUNMLENBQUM7SUFFRCw2QkFBUSxHQUFSO1FBQUEsaUJBU0M7UUFSRyxtQkFBUyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFDLEtBQVksRUFBRSxFQUFrQjtZQUMzRSxLQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QixJQUFJLEtBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxHQUFHLENBQUMsRUFBRTtnQkFDbkMsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzdFLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsR0FBRyxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzdGO1lBQ0QsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDRCQUFPLEdBQVA7UUFDSSxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELDJCQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLElBQUksTUFBTSxHQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsMENBQVUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBUSxDQUFDO0lBQzFFLENBQUM7SUFFRCxnQ0FBVyxHQUFYO1FBQ0ksRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELG1DQUFjLEdBQWQ7UUFDSSxFQUFFLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBeEREO1FBREMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUM7bURBQ0Y7SUFFbkI7UUFEQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztrREFDUztJQUUzQjtRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO2lEQUNRO0lBTlYsVUFBVTtRQUQ5QixPQUFPO09BQ2EsVUFBVSxDQTJEOUI7SUFBRCxpQkFBQztDQTNERCxBQTJEQyxDQTNEdUMsRUFBRSxDQUFDLFNBQVMsR0EyRG5EO2tCQTNEb0IsVUFBVSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlc0xlYWtDaGVja2VyIH0gZnJvbSBcIi4uL3Jlcy9SZXNMZWFrQ2hlY2tlclwiO1xyXG5pbXBvcnQgUmVzTG9hZGVyLCB7IHJlc0xvYWRlciB9IGZyb20gXCIuLi9yZXMvUmVzTG9hZGVyXCI7XHJcbmltcG9ydCB7IFJlc1V0aWwgfSBmcm9tIFwiLi4vcmVzL1Jlc1V0aWxcIjtcclxuXHJcbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG5AY2NjbGFzc1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOZXRFeGFtcGxlIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuICAgIEBwcm9wZXJ0eShjYy5Cb29sZWFuKVxyXG4gICAgcmVzVXRpbE1vZGUgPSB0cnVlO1xyXG4gICAgQHByb3BlcnR5KGNjLk5vZGUpXHJcbiAgICBhdHRhY2hOb2RlOiBjYy5Ob2RlID0gbnVsbDtcclxuICAgIEBwcm9wZXJ0eShjYy5MYWJlbClcclxuICAgIGR1bXBMYWJlbDogY2MuTGFiZWwgPSBudWxsO1xyXG4gICAgY2hlY2tlciA9IG5ldyBSZXNMZWFrQ2hlY2tlcigpO1xyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tlci5zdGFydENoZWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25BZGQoKSB7XHJcbiAgICAgICAgUmVzTG9hZGVyLmxvYWQoXCJwcmVmYWJEaXIvSGVsbG9Xb3JsZFwiLCBjYy5QcmVmYWIsIChlcnJvcjogRXJyb3IsIHByZWZhYjogY2MuUHJlZmFiKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGxldCBteU5vZGUgPSBSZXNVdGlsLmluc3RhbnRpYXRlKHByZWZhYik7XHJcbiAgICAgICAgICAgICAgICBteU5vZGUucGFyZW50ID0gdGhpcy5hdHRhY2hOb2RlO1xyXG4gICAgICAgICAgICAgICAgbXlOb2RlLnNldFBvc2l0aW9uKChNYXRoLnJhbmRvbSgpICogNTAwKSAtIDI1MCwgbXlOb2RlLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXlOb2RlLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIHByZWZhYi5kZWNSZWYoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uU3ViKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmF0dGFjaE5vZGUuY2hpbGRyZW5Db3VudCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5hdHRhY2hOb2RlLmNoaWxkcmVuW3RoaXMuYXR0YWNoTm9kZS5jaGlsZHJlbkNvdW50IC0gMV0uZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkFzc2lnbigpIHtcclxuICAgICAgICBSZXNMb2FkZXIubG9hZChcImltYWdlcy90ZXN0XCIsIGNjLlNwcml0ZUZyYW1lLCAoZXJyb3I6IEVycm9yLCBzcDogY2MuU3ByaXRlRnJhbWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jaGVja2VyLnRyYWNlQXNzZXQoc3ApO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hdHRhY2hOb2RlLmNoaWxkcmVuQ291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0Tm9kZSA9IHRoaXMuYXR0YWNoTm9kZS5jaGlsZHJlblt0aGlzLmF0dGFjaE5vZGUuY2hpbGRyZW5Db3VudCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IFJlc1V0aWwuYXNzaWduV2l0aChzcCwgdGFyZ2V0Tm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3AuZGVjUmVmKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25DbGVhbigpIHtcclxuICAgICAgICB0aGlzLmF0dGFjaE5vZGUuZGVzdHJveUFsbENoaWxkcmVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25EdW1wKCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tlci5kdW1wKCk7XHJcbiAgICAgICAgbGV0IExvYWRlcjogYW55ID0gY2MubG9hZGVyO1xyXG4gICAgICAgIHRoaXMuZHVtcExhYmVsLnN0cmluZyA9IGDlvZPliY3otYTmupDmgLvmlbA6JHtPYmplY3Qua2V5cyhMb2FkZXIuX2NhY2hlKS5sZW5ndGh9YDtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWRDbGljaygpIHtcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJleGFtcGxlX2VtcHR5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUHJlbG9hZENsaWNrKCkge1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLnByZWxvYWRTY2VuZShcImV4YW1wbGVfZW1wdHlcIik7XHJcbiAgICB9XHJcbn1cclxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/uiviews/UILogin.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '969aczWd9lHOpX3wou4IN95', 'UILogin');
// Script/example/uiviews/UILogin.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var UIView_1 = require("../../ui/UIView");
var UIManager_1 = require("../../ui/UIManager");
var UIExample_1 = require("../UIExample");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UILogin = /** @class */ (function (_super) {
    __extends(UILogin, _super);
    function UILogin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UILogin.prototype.onLogin = function () {
        // 连续打开2个界面
        UIManager_1.uiManager.replace(UIExample_1.UIID.UIHall);
        UIManager_1.uiManager.open(UIExample_1.UIID.UINotice);
    };
    UILogin = __decorate([
        ccclass
    ], UILogin);
    return UILogin;
}(UIView_1.UIView));
exports.default = UILogin;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS91aXZpZXdzL1VJTG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQXlDO0FBQ3pDLGdEQUErQztBQUMvQywwQ0FBb0M7QUFFOUIsSUFBQSxrQkFBbUMsRUFBbEMsb0JBQU8sRUFBRSxzQkFBeUIsQ0FBQztBQUcxQztJQUFxQywyQkFBTTtJQUEzQzs7SUFPQSxDQUFDO0lBTFUseUJBQU8sR0FBZDtRQUNJLFdBQVc7UUFDWCxxQkFBUyxDQUFDLE9BQU8sQ0FBQyxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLHFCQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQU5nQixPQUFPO1FBRDNCLE9BQU87T0FDYSxPQUFPLENBTzNCO0lBQUQsY0FBQztDQVBELEFBT0MsQ0FQb0MsZUFBTSxHQU8xQztrQkFQb0IsT0FBTyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVJVmlldyB9IGZyb20gXCIuLi8uLi91aS9VSVZpZXdcIjtcbmltcG9ydCB7IHVpTWFuYWdlciB9IGZyb20gXCIuLi8uLi91aS9VSU1hbmFnZXJcIjtcbmltcG9ydCB7IFVJSUQgfSBmcm9tIFwiLi4vVUlFeGFtcGxlXCI7XG5cbmNvbnN0IHtjY2NsYXNzLCBwcm9wZXJ0eX0gPSBjYy5fZGVjb3JhdG9yO1xuXG5AY2NjbGFzc1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVUlMb2dpbiBleHRlbmRzIFVJVmlldyB7XG5cbiAgICBwdWJsaWMgb25Mb2dpbigpIHtcbiAgICAgICAgLy8g6L+e57ut5omT5byAMuS4queVjOmdolxuICAgICAgICB1aU1hbmFnZXIucmVwbGFjZShVSUlELlVJSGFsbCk7XG4gICAgICAgIHVpTWFuYWdlci5vcGVuKFVJSUQuVUlOb3RpY2UpO1xuICAgIH1cbn1cbiJdfQ==
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/uiviews/UIBag.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'fca327d1KhLiq6nzIlLgtCj', 'UIBag');
// Script/example/uiviews/UIBag.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var UIView_1 = require("../../ui/UIView");
var UIManager_1 = require("../../ui/UIManager");
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UIBag = /** @class */ (function (_super) {
    __extends(UIBag, _super);
    function UIBag() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectItem = null;
        _this.selectNode = null;
        return _this;
    }
    UIBag.prototype.init = function () {
    };
    UIBag.prototype.onClick = function (event) {
        if (this.selectNode) {
            this.selectNode.setScale(1);
        }
        var node = event.target;
        this.selectNode = node;
        this.selectNode.setScale(1.5);
        var sprite = node.getComponent(cc.Sprite);
        this.selectItem = sprite.spriteFrame;
    };
    UIBag.prototype.onOkClick = function () {
        UIManager_1.uiManager.close();
    };
    UIBag.prototype.onClose = function () {
        return this.selectItem;
    };
    UIBag = __decorate([
        ccclass
    ], UIBag);
    return UIBag;
}(UIView_1.UIView));
exports.default = UIBag;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS91aXZpZXdzL1VJQmFnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUF5QztBQUN6QyxnREFBK0M7QUFFL0Msb0JBQW9CO0FBQ3BCLGtGQUFrRjtBQUNsRix5RkFBeUY7QUFDekYsbUJBQW1CO0FBQ25CLDRGQUE0RjtBQUM1RixtR0FBbUc7QUFDbkcsOEJBQThCO0FBQzlCLDRGQUE0RjtBQUM1RixtR0FBbUc7QUFFN0YsSUFBQSxrQkFBbUMsRUFBbEMsb0JBQU8sRUFBRSxzQkFBeUIsQ0FBQztBQUcxQztJQUFtQyx5QkFBTTtJQUR6QztRQUFBLHFFQTZCQztRQTNCVyxnQkFBVSxHQUFtQixJQUFJLENBQUM7UUFDbEMsZ0JBQVUsR0FBWSxJQUFJLENBQUM7O0lBMEJ2QyxDQUFDO0lBeEJVLG9CQUFJLEdBQVg7SUFFQSxDQUFDO0lBRU0sdUJBQU8sR0FBZCxVQUFlLEtBQUs7UUFDaEIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxJQUFJLEdBQWEsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNsQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU5QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDekMsQ0FBQztJQUVNLHlCQUFTLEdBQWhCO1FBQ0kscUJBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU0sdUJBQU8sR0FBZDtRQUNJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBM0JnQixLQUFLO1FBRHpCLE9BQU87T0FDYSxLQUFLLENBNEJ6QjtJQUFELFlBQUM7Q0E1QkQsQUE0QkMsQ0E1QmtDLGVBQU0sR0E0QnhDO2tCQTVCb0IsS0FBSyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVJVmlldyB9IGZyb20gXCIuLi8uLi91aS9VSVZpZXdcIjtcbmltcG9ydCB7IHVpTWFuYWdlciB9IGZyb20gXCIuLi8uLi91aS9VSU1hbmFnZXJcIjtcblxuLy8gTGVhcm4gVHlwZVNjcmlwdDpcbi8vICAtIFtDaGluZXNlXSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL3poL3NjcmlwdGluZy90eXBlc2NyaXB0Lmh0bWxcbi8vICAtIFtFbmdsaXNoXSBodHRwOi8vd3d3LmNvY29zMmQteC5vcmcvZG9jcy9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvdHlwZXNjcmlwdC5odG1sXG4vLyBMZWFybiBBdHRyaWJ1dGU6XG4vLyAgLSBbQ2hpbmVzZV0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC96aC9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxuLy8gIC0gW0VuZ2xpc2hdIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZy9kb2NzL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9yZWZlcmVuY2UvYXR0cmlidXRlcy5odG1sXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcbi8vICAtIFtDaGluZXNlXSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL3poL3NjcmlwdGluZy9saWZlLWN5Y2xlLWNhbGxiYWNrcy5odG1sXG4vLyAgLSBbRW5nbGlzaF0gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnL2RvY3MvY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcblxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XG5cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVSUJhZyBleHRlbmRzIFVJVmlldyB7XG4gICAgcHJpdmF0ZSBzZWxlY3RJdGVtOiBjYy5TcHJpdGVGcmFtZSA9IG51bGw7XG4gICAgcHJpdmF0ZSBzZWxlY3ROb2RlOiBjYy5Ob2RlID0gbnVsbDtcbiAgICBcbiAgICBwdWJsaWMgaW5pdCgpIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBvbkNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdE5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0Tm9kZS5zZXRTY2FsZSgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBub2RlIDogY2MuTm9kZSA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgdGhpcy5zZWxlY3ROb2RlID0gbm9kZTtcbiAgICAgICAgdGhpcy5zZWxlY3ROb2RlLnNldFNjYWxlKDEuNSk7XG5cbiAgICAgICAgbGV0IHNwcml0ZSA9IG5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIHRoaXMuc2VsZWN0SXRlbSA9IHNwcml0ZS5zcHJpdGVGcmFtZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Pa0NsaWNrKCkge1xuICAgICAgICB1aU1hbmFnZXIuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25DbG9zZSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RJdGVtO1xuICAgIH1cbn1cbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/network/NetInterface.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvbmV0d29yay9OZXRJbnRlcmZhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7O0VBSUU7O0FBMkJGLFlBQVk7QUFDWjtJQUFBO0lBaUJBLENBQUM7SUFoQkcsc0NBQVUsR0FBVjtRQUNJLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUNELHVDQUFXLEdBQVg7UUFDSSxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFDRCx5Q0FBYSxHQUFiLFVBQWMsR0FBWTtRQUV0QixPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDakMsQ0FBQztJQUNELHdDQUFZLEdBQVosVUFBYSxHQUFZO1FBQ3JCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCx3Q0FBWSxHQUFaLFVBQWEsR0FBWTtRQUNyQixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDTCx3QkFBQztBQUFELENBakJBLEFBaUJDLElBQUE7QUFqQlksOENBQWlCIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKlxuKiAgIOe9kee7nOebuOWFs+aOpeWPo+WumuS5iVxuKiAgIFxuKiAgIDIwMTktMTAtOCBieSDlrp3niLdcbiovXG5cbmV4cG9ydCB0eXBlIE5ldERhdGEgPSAoc3RyaW5nIHwgQXJyYXlCdWZmZXJMaWtlIHwgQmxvYiB8IEFycmF5QnVmZmVyVmlldyk7XG5leHBvcnQgdHlwZSBOZXRDYWxsRnVuYyA9IChjbWQ6IG51bWJlciwgZGF0YTogYW55KSA9PiB2b2lkO1xuXG4vLyDlm57osIPlr7nosaFcbmV4cG9ydCBpbnRlcmZhY2UgQ2FsbGJhY2tPYmplY3Qge1xuICAgIHRhcmdldDogYW55LCAgICAgICAgICAgICAgICAvLyDlm57osIPlr7nosaHvvIzkuI3kuLpudWxs5pe26LCD55SodGFyZ2V0LmNhbGxiYWNrKHh4eClcbiAgICBjYWxsYmFjazogTmV0Q2FsbEZ1bmMsICAgICAgLy8g5Zue6LCD5Ye95pWwXG59XG5cbi8vIOivt+axguWvueixoVxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0T2JqZWN0IHtcbiAgICBidWZmZXI6IE5ldERhdGEsICAgICAgICAgICAgLy8g6K+35rGC55qEQnVmZmVyXG4gICAgcnNwQ21kOiBudW1iZXIsICAgICAgICAgICAgIC8vIOetieW+heWTjeW6lOaMh+S7pFxuICAgIHJzcE9iamVjdDogQ2FsbGJhY2tPYmplY3QsICAvLyDnrYnlvoXlk43lupTnmoTlm57osIPlr7nosaFcbn1cblxuLy8g5Y2P6K6u6L6F5Yqp5o6l5Y+jXG5leHBvcnQgaW50ZXJmYWNlIElQcm90b2NvbEhlbHBlciB7XG4gICAgZ2V0SGVhZGxlbigpOiBudW1iZXI7ICAgICAgICAgICAgICAgICAgIC8vIOi/lOWbnuWMheWktOmVv+W6plxuICAgIGdldEhlYXJiZWF0KCk6IE5ldERhdGE7ICAgICAgICAgICAgICAgICAvLyDov5Tlm57kuIDkuKrlv4Pot7PljIVcbiAgICBnZXRQYWNrYWdlTGVuKG1zZzogTmV0RGF0YSk6IG51bWJlcjsgICAgLy8g6L+U5Zue5pW05Liq5YyF55qE6ZW/5bqmXG4gICAgY2hlY2tQYWNrYWdlKG1zZzogTmV0RGF0YSk6IGJvb2xlYW47ICAgIC8vIOajgOafpeWMheaVsOaNruaYr+WQpuWQiOazlVxuICAgIGdldFBhY2thZ2VJZChtc2c6IE5ldERhdGEpOiBudW1iZXI7ICAgICAvLyDov5Tlm57ljIXnmoRpZOaIluWNj+iuruexu+Wei1xufVxuXG4vLyDpu5jorqTlrZfnrKbkuLLljY/orq7lr7nosaFcbmV4cG9ydCBjbGFzcyBEZWZTdHJpbmdQcm90b2NvbCBpbXBsZW1lbnRzIElQcm90b2NvbEhlbHBlciB7XG4gICAgZ2V0SGVhZGxlbigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgZ2V0SGVhcmJlYXQoKTogTmV0RGF0YSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICBnZXRQYWNrYWdlTGVuKG1zZzogTmV0RGF0YSk6IG51bWJlclxuICAgIHtcbiAgICAgICAgcmV0dXJuIG1zZy50b1N0cmluZygpLmxlbmd0aDtcbiAgICB9XG4gICAgY2hlY2tQYWNrYWdlKG1zZzogTmV0RGF0YSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZ2V0UGFja2FnZUlkKG1zZzogTmV0RGF0YSk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cblxuLy8gU29ja2V05o6l5Y+jXG5leHBvcnQgaW50ZXJmYWNlIElTb2NrZXQge1xuICAgIG9uQ29ubmVjdGVkOiAoZXZlbnQpID0+IHZvaWQ7ICAgICAgICAgICAvLyDov57mjqXlm57osINcbiAgICBvbk1lc3NhZ2U6IChtc2c6IE5ldERhdGEpID0+IHZvaWQ7ICAgICAgLy8g5raI5oGv5Zue6LCDXG4gICAgb25FcnJvcjogKGV2ZW50KSA9PiB2b2lkOyAgICAgICAgICAgICAgIC8vIOmUmeivr+Wbnuiwg1xuICAgIG9uQ2xvc2VkOiAoZXZlbnQpID0+IHZvaWQ7ICAgICAgICAgICAgICAvLyDlhbPpl63lm57osINcbiAgICBcbiAgICBjb25uZWN0KG9wdGlvbnM6IGFueSk7ICAgICAgICAgICAgICAgICAgLy8g6L+e5o6l5o6l5Y+jXG4gICAgc2VuZChidWZmZXI6IE5ldERhdGEpOyAgICAgICAgICAgICAgICAgIC8vIOaVsOaNruWPkemAgeaOpeWPo1xuICAgIGNsb3NlKGNvZGU/OiBudW1iZXIsIHJlYXNvbj86IHN0cmluZyk7ICAvLyDlhbPpl63mjqXlj6Ncbn1cblxuLy8g572R57uc5o+Q56S65o6l5Y+jXG5leHBvcnQgaW50ZXJmYWNlIElOZXR3b3JrVGlwcyB7XG4gICAgY29ubmVjdFRpcHMoaXNTaG93OiBib29sZWFuKTogdm9pZDtcbiAgICByZWNvbm5lY3RUaXBzKGlzU2hvdzogYm9vbGVhbik6IHZvaWQ7XG4gICAgcmVxdWVzdFRpcHMoaXNTaG93OiBib29sZWFuKTogdm9pZDtcbn1cbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/network/WebSock.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvbmV0d29yay9XZWJTb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7RUFPRTtBQUVGO0lBQUE7UUFDWSxRQUFHLEdBQWMsSUFBSSxDQUFDLENBQWMsY0FBYztRQUUxRCxnQkFBVyxHQUFvQixJQUFJLENBQUM7UUFDcEMsY0FBUyxHQUFrQixJQUFJLENBQUM7UUFDaEMsWUFBTyxHQUFvQixJQUFJLENBQUM7UUFDaEMsYUFBUSxHQUFvQixJQUFJLENBQUM7SUEyQ3JDLENBQUM7SUF6Q0cseUJBQU8sR0FBUCxVQUFRLE9BQVk7UUFBcEIsaUJBMkJDO1FBMUJHLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLFVBQVUsRUFBRTtnQkFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFBO2dCQUN6RCxPQUFPLEtBQUssQ0FBQzthQUNoQjtTQUNKO1FBRUQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2YsSUFBRyxPQUFPLENBQUMsR0FBRyxFQUFFO1lBQ1osR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7U0FDckI7YUFBTTtZQUNILElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDcEIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztZQUN4QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ2hDLEdBQUcsR0FBTSxRQUFRLFdBQU0sRUFBRSxTQUFJLElBQU0sQ0FBQztTQUN2QztRQUVELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO1FBQzlFLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLFVBQUMsS0FBSztZQUN2QixLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUM7UUFDRixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNqQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsc0JBQUksR0FBSixVQUFLLE1BQWU7UUFDaEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUN6QztZQUNJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsdUJBQUssR0FBTCxVQUFNLElBQWEsRUFBRSxNQUFlO1FBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0wsY0FBQztBQUFELENBakRBLEFBaURDLElBQUE7QUFqRFksMEJBQU8iLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJU29ja2V0LCBOZXREYXRhIH0gZnJvbSBcIi4vTmV0SW50ZXJmYWNlXCI7XG5cbi8qXG4qICAgV2ViU29ja2V05bCB6KOFXG4qICAgMS4g6L+e5o6lL+aWreW8gOebuOWFs+aOpeWPo1xuKiAgIDIuIOe9kee7nOW8guW4uOWbnuiwg1xuKiAgIDMuIOaVsOaNruWPkemAgeS4juaOpeaUtlxuKiAgIFxuKiAgIDIwMTgtNS0xNCBieSDlrp3niLdcbiovXG5cbmV4cG9ydCBjbGFzcyBXZWJTb2NrIGltcGxlbWVudHMgSVNvY2tldCB7XG4gICAgcHJpdmF0ZSBfd3M6IFdlYlNvY2tldCA9IG51bGw7ICAgICAgICAgICAgICAvLyB3ZWJzb2NrZXTlr7nosaFcblxuICAgIG9uQ29ubmVjdGVkOiAoZXZlbnQpID0+IHZvaWQgPSBudWxsO1xuICAgIG9uTWVzc2FnZTogKG1zZykgPT4gdm9pZCA9IG51bGw7XG4gICAgb25FcnJvcjogKGV2ZW50KSA9PiB2b2lkID0gbnVsbDtcbiAgICBvbkNsb3NlZDogKGV2ZW50KSA9PiB2b2lkID0gbnVsbDtcblxuICAgIGNvbm5lY3Qob3B0aW9uczogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLl93cykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3dzLnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5DT05ORUNUSU5HKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgY29ubmVjdGluZywgd2FpdCBmb3IgYSBtb21lbnQuLi5cIilcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdXJsID0gbnVsbDtcbiAgICAgICAgaWYob3B0aW9ucy51cmwpIHtcbiAgICAgICAgICAgIHVybCA9IG9wdGlvbnMudXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGlwID0gb3B0aW9ucy5pcDtcbiAgICAgICAgICAgIGxldCBwb3J0ID0gb3B0aW9ucy5wb3J0O1xuICAgICAgICAgICAgbGV0IHByb3RvY29sID0gb3B0aW9ucy5wcm90b2NvbDtcbiAgICAgICAgICAgIHVybCA9IGAke3Byb3RvY29sfTovLyR7aXB9OiR7cG9ydH1gOyAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3dzID0gbmV3IFdlYlNvY2tldCh1cmwpO1xuICAgICAgICB0aGlzLl93cy5iaW5hcnlUeXBlID0gb3B0aW9ucy5iaW5hcnlUeXBlID8gb3B0aW9ucy5iaW5hcnlUeXBlIDogXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgICB0aGlzLl93cy5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKGV2ZW50LmRhdGEpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl93cy5vbm9wZW4gPSB0aGlzLm9uQ29ubmVjdGVkO1xuICAgICAgICB0aGlzLl93cy5vbmVycm9yID0gdGhpcy5vbkVycm9yO1xuICAgICAgICB0aGlzLl93cy5vbmNsb3NlID0gdGhpcy5vbkNsb3NlZDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc2VuZChidWZmZXI6IE5ldERhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dzLnJlYWR5U3RhdGUgPT0gV2ViU29ja2V0Lk9QRU4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3dzLnNlbmQoYnVmZmVyKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjbG9zZShjb2RlPzogbnVtYmVyLCByZWFzb24/OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fd3MuY2xvc2UoY29kZSwgcmVhc29uKTtcbiAgICB9XG59Il19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/EmptyScene.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '2d3e36atnNNiLeEqusEYQBm', 'EmptyScene');
// Script/example/EmptyScene.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var EmptyScene = /** @class */ (function (_super) {
    __extends(EmptyScene, _super);
    function EmptyScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        return _this;
    }
    EmptyScene.prototype.start = function () {
        var ccloader = cc.loader;
        this.label.string = "Current Scene Asset Count " + Object.keys(ccloader._cache).length;
    };
    __decorate([
        property(cc.Label)
    ], EmptyScene.prototype, "label", void 0);
    EmptyScene = __decorate([
        ccclass
    ], EmptyScene);
    return EmptyScene;
}(cc.Component));
exports.default = EmptyScene;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS9FbXB0eVNjZW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFNLElBQUEsa0JBQXFDLEVBQW5DLG9CQUFPLEVBQUUsc0JBQTBCLENBQUM7QUFFNUM7SUFBd0MsOEJBQVk7SUFEcEQ7UUFBQSxxRUFTQztRQU5HLFdBQUssR0FBYSxJQUFJLENBQUM7O0lBTTNCLENBQUM7SUFKRywwQkFBSyxHQUFMO1FBQ0ksSUFBSSxRQUFRLEdBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQztRQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRywrQkFBNkIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBUSxDQUFDO0lBQzNGLENBQUM7SUFMRDtRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDOzZDQUNJO0lBRk4sVUFBVTtRQUQ5QixPQUFPO09BQ2EsVUFBVSxDQVE5QjtJQUFELGlCQUFDO0NBUkQsQUFRQyxDQVJ1QyxFQUFFLENBQUMsU0FBUyxHQVFuRDtrQkFSb0IsVUFBVSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XG5AY2NjbGFzc1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW1wdHlTY2VuZSBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG4gICAgQHByb3BlcnR5KGNjLkxhYmVsKVxuICAgIGxhYmVsOiBjYy5MYWJlbCA9IG51bGw7XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgbGV0IGNjbG9hZGVyOiBhbnkgPSBjYy5sb2FkZXI7XG4gICAgICAgIHRoaXMubGFiZWwuc3RyaW5nID0gYEN1cnJlbnQgU2NlbmUgQXNzZXQgQ291bnQgJHtPYmplY3Qua2V5cyhjY2xvYWRlci5fY2FjaGUpLmxlbmd0aH1gO1xuICAgIH1cbn1cbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/res/ResKeeper.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'e7548uPzG1IHbJAG5JOhIeu', 'ResKeeper');
// Script/res/ResKeeper.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ResLoader_1 = require("./ResLoader");
/**
 * 资源引用类
 * 1. 提供加载功能，并记录加载过的资源
 * 2. 在node释放时自动清理加载过的资源
 * 3. 支持手动添加记录
 *
 * 2019-12-13 by 宝爷
 */
var ccclass = cc._decorator.ccclass;
var ResKeeper = /** @class */ (function (_super) {
    __extends(ResKeeper, _super);
    function ResKeeper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resCache = new Set();
        return _this;
    }
    ResKeeper.prototype.load = function () {
        var _this = this;
        // 最后一个参数是加载完成回调
        if (arguments.length < 2 || typeof arguments[arguments.length - 1] != "function") {
            console.error("load faile, completed callback not found");
            return;
        }
        // 包装完成回调，添加自动缓存功能
        var finishCallback = arguments[arguments.length - 1];
        arguments[arguments.length - 1] = function (error, resource) {
            if (!error) {
                if (resource instanceof Array) {
                    resource.forEach(function (element) {
                        _this.cacheAsset(element);
                    });
                }
                else {
                    _this.cacheAsset(resource);
                }
            }
            finishCallback();
        };
        // 调用加载接口
        ResLoader_1.default.load.apply(ResLoader_1.default, arguments);
    };
    /**
     * 缓存资源
     * @param asset
     */
    ResKeeper.prototype.cacheAsset = function (asset) {
        if (!this.resCache.has(asset)) {
            asset.addRef();
            this.resCache.add(asset);
        }
    };
    /**
     * 组件销毁时自动释放所有keep的资源
     */
    ResKeeper.prototype.onDestroy = function () {
        this.releaseAssets();
    };
    /**
     * 释放资源，组件销毁时自动调用
     */
    ResKeeper.prototype.releaseAssets = function () {
        this.resCache.forEach(function (element) {
            element.decRef();
        });
        this.resCache.clear();
    };
    ResKeeper = __decorate([
        ccclass
    ], ResKeeper);
    return ResKeeper;
}(cc.Component));
exports.ResKeeper = ResKeeper;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvcmVzL1Jlc0tlZXBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEU7QUFDNUU7Ozs7Ozs7R0FPRztBQUNLLElBQUEsK0JBQU8sQ0FBbUI7QUFHbEM7SUFBK0IsNkJBQVk7SUFEM0M7UUFBQSxxRUFnRkM7UUE3RVcsY0FBUSxHQUFHLElBQUksR0FBRyxFQUFZLENBQUM7O0lBNkUzQyxDQUFDO0lBbkRVLHdCQUFJLEdBQVg7UUFBQSxpQkFzQkM7UUFyQkcsZ0JBQWdCO1FBQ2hCLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksT0FBTyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxVQUFVLEVBQUU7WUFDOUUsT0FBTyxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1lBQzFELE9BQU87U0FDVjtRQUNELGtCQUFrQjtRQUNsQixJQUFJLGNBQWMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyRCxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFDLEtBQUssRUFBRSxRQUFRO1lBQzlDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1IsSUFBSSxRQUFRLFlBQVksS0FBSyxFQUFFO29CQUMzQixRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTzt3QkFDcEIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDN0IsQ0FBQyxDQUFDLENBQUM7aUJBQ047cUJBQU07b0JBQ0gsS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDN0I7YUFDSjtZQUNELGNBQWMsRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQTtRQUNELFNBQVM7UUFDVCxtQkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksOEJBQVUsR0FBakIsVUFBa0IsS0FBZTtRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDM0IsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUI7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSSw2QkFBUyxHQUFoQjtRQUNJLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQ7O09BRUc7SUFDSSxpQ0FBYSxHQUFwQjtRQUNJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztZQUN6QixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzFCLENBQUM7SUE5RVEsU0FBUztRQURyQixPQUFPO09BQ0ssU0FBUyxDQStFckI7SUFBRCxnQkFBQztDQS9FRCxBQStFQyxDQS9FOEIsRUFBRSxDQUFDLFNBQVMsR0ErRTFDO0FBL0VZLDhCQUFTIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlc0xvYWRlciwgeyBDb21wbGV0ZWRDYWxsYmFjaywgUHJvY2Vzc0NhbGxiYWNrIH0gZnJvbSBcIi4vUmVzTG9hZGVyXCI7XHJcbi8qKlxyXG4gKiDotYTmupDlvJXnlKjnsbtcclxuICogMS4g5o+Q5L6b5Yqg6L295Yqf6IO977yM5bm26K6w5b2V5Yqg6L296L+H55qE6LWE5rqQXHJcbiAqIDIuIOWcqG5vZGXph4rmlL7ml7boh6rliqjmuIXnkIbliqDovb3ov4fnmoTotYTmupBcclxuICogMy4g5pSv5oyB5omL5Yqo5re75Yqg6K6w5b2VXHJcbiAqIFxyXG4gKiAyMDE5LTEyLTEzIGJ5IOWuneeIt1xyXG4gKi9cclxuY29uc3QgeyBjY2NsYXNzIH0gPSBjYy5fZGVjb3JhdG9yO1xyXG5cclxuQGNjY2xhc3NcclxuZXhwb3J0IGNsYXNzIFJlc0tlZXBlciBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcblxyXG4gICAgcHJpdmF0ZSByZXNDYWNoZSA9IG5ldyBTZXQ8Y2MuQXNzZXQ+KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvIDlp4vliqDovb3otYTmupBcclxuICAgICAqIEBwYXJhbSBidW5kbGUgICAgICAgIGFzc2V0YnVuZGxl55qE6Lev5b6EXHJcbiAgICAgKiBAcGFyYW0gdXJsICAgICAgICAgICDotYTmupB1cmzmiJZ1cmzmlbDnu4RcclxuICAgICAqIEBwYXJhbSB0eXBlICAgICAgICAgIOi1hOa6kOexu+Wei++8jOm7mOiupOS4um51bGxcclxuICAgICAqIEBwYXJhbSBvblByb2dlc3MgICAgIOWKoOi9vei/m+W6puWbnuiwg1xyXG4gICAgICogQHBhcmFtIG9uQ29tcGxldGVkICAg5Yqg6L295a6M5oiQ5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBsb2FkKHVybDogc3RyaW5nLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQodXJsOiBzdHJpbmcsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQodXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKHVybDogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQodXJsOiBzdHJpbmdbXSwgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKHVybDogc3RyaW5nW10sIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQodXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQodXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvblByb2dlc3M6IFByb2Nlc3NDYWxsYmFjaywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZywgb25Qcm9nZXNzOiBQcm9jZXNzQ2FsbGJhY2ssIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgbG9hZChidW5kbGU6IHN0cmluZywgdXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvblByb2dlc3M6IFByb2Nlc3NDYWxsYmFjaywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZ1tdLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQoYnVuZGxlOiBzdHJpbmcsIHVybDogc3RyaW5nW10sIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQoYnVuZGxlOiBzdHJpbmcsIHVybDogc3RyaW5nW10sIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBsb2FkKGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZ1tdLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIGxvYWQoKSB7XHJcbiAgICAgICAgLy8g5pyA5ZCO5LiA5Liq5Y+C5pWw5piv5Yqg6L295a6M5oiQ5Zue6LCDXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyIHx8IHR5cGVvZiBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdICE9IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBsb2FkIGZhaWxlLCBjb21wbGV0ZWQgY2FsbGJhY2sgbm90IGZvdW5kYCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5YyF6KOF5a6M5oiQ5Zue6LCD77yM5re75Yqg6Ieq5Yqo57yT5a2Y5Yqf6IO9XHJcbiAgICAgICAgbGV0IGZpbmlzaENhbGxiYWNrID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcclxuICAgICAgICBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdID0gKGVycm9yLCByZXNvdXJjZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVBc3NldChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZUFzc2V0KHJlc291cmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaW5pc2hDYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDosIPnlKjliqDovb3mjqXlj6NcclxuICAgICAgICBSZXNMb2FkZXIubG9hZC5hcHBseShSZXNMb2FkZXIsIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnvJPlrZjotYTmupBcclxuICAgICAqIEBwYXJhbSBhc3NldCBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNhY2hlQXNzZXQoYXNzZXQ6IGNjLkFzc2V0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJlc0NhY2hlLmhhcyhhc3NldCkpIHtcclxuICAgICAgICAgICAgYXNzZXQuYWRkUmVmKCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzQ2FjaGUuYWRkKGFzc2V0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnu4Tku7bplIDmr4Hml7boh6rliqjph4rmlL7miYDmnIlrZWVw55qE6LWE5rqQXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5yZWxlYXNlQXNzZXRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDph4rmlL7otYTmupDvvIznu4Tku7bplIDmr4Hml7boh6rliqjosIPnlKhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbGVhc2VBc3NldHMoKSB7XHJcbiAgICAgICAgdGhpcy5yZXNDYWNoZS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBlbGVtZW50LmRlY1JlZigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVzQ2FjaGUuY2xlYXIoKTtcclxuICAgIH1cclxufSJdfQ==
//------QC-SOURCE-SPLIT------

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvcmVzL1Jlc0xlYWtDaGVja2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHOztBQUVILHFDQUFvQztBQUlwQztJQUFBO1FBQ1csY0FBUyxHQUFtQixJQUFJLENBQUMsQ0FBSSxTQUFTO1FBQzdDLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsZ0JBQVcsR0FBa0IsSUFBSSxHQUFHLEVBQVksQ0FBQztJQWlHN0QsQ0FBQztJQS9GRzs7O09BR0c7SUFDSSxvQ0FBVyxHQUFsQixVQUFtQixLQUFlO1FBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2pCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNoQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7O09BR0c7SUFDSSxtQ0FBVSxHQUFqQixVQUFrQixLQUFlO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzFCLE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM5QixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9CO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNJLG9DQUFXLEdBQWxCLFVBQW1CLEtBQWU7UUFDOUIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM5QixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzlCLElBQUksUUFBUSxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO1FBQ3pDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDOUIsS0FBSyxDQUFDLE1BQU0sR0FBRztZQUNYLElBQUksS0FBSyxHQUFHLGlCQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDekIsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUE7UUFFRCxLQUFLLENBQUMsTUFBTSxHQUFHO1lBQ1gsSUFBSSxLQUFLLEdBQUcsaUJBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RCxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN6QixPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFFRDs7O09BR0c7SUFDSSxtQ0FBVSxHQUFqQixVQUFrQixLQUFlO1FBQzdCLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3BCLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNwQixPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDcEIsT0FBTyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDN0I7SUFDTCxDQUFDO0lBRU0scUNBQVksR0FBbkIsVUFBb0IsS0FBZTtRQUMvQixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkIsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEM7SUFDTCxDQUFDO0lBRU0sbUNBQVUsR0FBakIsY0FBc0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLGtDQUFTLEdBQWhCLGNBQXFCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2Qyx1Q0FBYyxHQUFyQixjQUF5QyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBRTVELDhCQUFLLEdBQVo7UUFBQSxpQkFNQztRQUxHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztZQUM1QixLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVNLDZCQUFJLEdBQVg7UUFDSSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87WUFDNUIsSUFBSSxRQUFRLEdBQXdCLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6RCxJQUFJLFFBQVEsRUFBRTtnQkFDVixRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFFLEtBQUs7b0JBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUksR0FBRyxXQUFNLEtBQUssTUFBRyxDQUFDLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxDQUFDO2FBQ047UUFDTCxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFDTCxxQkFBQztBQUFELENBcEdBLEFBb0dDLElBQUE7QUFwR1ksd0NBQWMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog6LWE5rqQ5rOE6Zyy5qOA5p+l57G777yM5Y+v5Lul55So5LqO6Lef6Liq6LWE5rqQ55qE5byV55So5oOF5Ya1XHJcbiAqIFxyXG4gKiAyMDIxLTEtMzEgYnkg5a6d54i3XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgUmVzVXRpbCB9IGZyb20gXCIuL1Jlc1V0aWxcIjtcclxuXHJcbmV4cG9ydCB0eXBlIEZpbHRlckNhbGxiYWNrID0gKGFzc2V0OiBjYy5Bc3NldCkgPT4gYm9vbGVhbjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZXNMZWFrQ2hlY2tlciB7XHJcbiAgICBwdWJsaWMgcmVzRmlsdGVyOiBGaWx0ZXJDYWxsYmFjayA9IG51bGw7ICAgIC8vIOi1hOa6kOi/h+a7pOWbnuiwg1xyXG4gICAgcHJpdmF0ZSBfY2hlY2tpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgdHJhY2VBc3NldHM6IFNldDxjYy5Bc3NldD4gPSBuZXcgU2V0PGNjLkFzc2V0PigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qOA5p+l6K+l6LWE5rqQ5piv5ZCm56ym5ZCI6L+H5ruk5p2h5Lu2XHJcbiAgICAgKiBAcGFyYW0gdXJsIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2hlY2tGaWx0ZXIoYXNzZXQ6IGNjLkFzc2V0KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jaGVja2luZykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlc0ZpbHRlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNGaWx0ZXIoYXNzZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWvuei1hOa6kOi/m+ihjOW8leeUqOeahOi3n+i4qlxyXG4gICAgICogQHBhcmFtIGFzc2V0IFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdHJhY2VBc3NldChhc3NldDogY2MuQXNzZXQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2hlY2tGaWx0ZXIoYXNzZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLnRyYWNlQXNzZXRzLmhhcyhhc3NldCkpIHtcclxuICAgICAgICAgICAgYXNzZXQuYWRkUmVmKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXh0ZW5kQXNzZXQoYXNzZXQpO1xyXG4gICAgICAgICAgICB0aGlzLnRyYWNlQXNzZXRzLmFkZChhc3NldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omp5bGVYXNzZXTvvIzkvb/lhbbmlK/mjIHlvJXnlKjorqHmlbDov73ouKpcclxuICAgICAqIEBwYXJhbSBhc3NldCBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGV4dGVuZEFzc2V0KGFzc2V0OiBjYy5Bc3NldCkge1xyXG4gICAgICAgIGxldCBhZGRSZWZGdW5jID0gYXNzZXQuYWRkUmVmO1xyXG4gICAgICAgIGxldCBkZWNSZWZGdW5jID0gYXNzZXQuZGVjUmVmO1xyXG4gICAgICAgIGxldCB0cmFjZU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XHJcbiAgICAgICAgYXNzZXRbJ0B0cmFjZU1hcCddID0gdHJhY2VNYXA7XHJcbiAgICAgICAgYXNzZXQuYWRkUmVmID0gZnVuY3Rpb24gKCk6IGNjLkFzc2V0IHtcclxuICAgICAgICAgICAgbGV0IHN0YWNrID0gUmVzVXRpbC5nZXRDYWxsU3RhY2soMSk7XHJcbiAgICAgICAgICAgIGxldCBjbnQgPSB0cmFjZU1hcC5oYXMoc3RhY2spID8gdHJhY2VNYXAuZ2V0KHN0YWNrKSArIDEgOiAxO1xyXG4gICAgICAgICAgICB0cmFjZU1hcC5zZXQoc3RhY2ssIGNudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBhZGRSZWZGdW5jLmFwcGx5KGFzc2V0LCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXNzZXQuZGVjUmVmID0gZnVuY3Rpb24gKCk6IGNjLkFzc2V0IHtcclxuICAgICAgICAgICAgbGV0IHN0YWNrID0gUmVzVXRpbC5nZXRDYWxsU3RhY2soMSk7XHJcbiAgICAgICAgICAgIGxldCBjbnQgPSB0cmFjZU1hcC5oYXMoc3RhY2spID8gdHJhY2VNYXAuZ2V0KHN0YWNrKSArIDEgOiAxO1xyXG4gICAgICAgICAgICB0cmFjZU1hcC5zZXQoc3RhY2ssIGNudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWNSZWZGdW5jLmFwcGx5KGFzc2V0LCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/mOWOn2Fzc2V077yM5L2/5YW25oGi5aSN6buY6K6k55qE5byV55So6K6h5pWw5Yqf6IO9XHJcbiAgICAgKiBAcGFyYW0gYXNzZXQgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXNldEFzc2V0KGFzc2V0OiBjYy5Bc3NldCkge1xyXG4gICAgICAgIGlmIChhc3NldFsnQHRyYWNlTWFwJ10pIHtcclxuICAgICAgICAgICAgZGVsZXRlIGFzc2V0LmFkZFJlZjtcclxuICAgICAgICAgICAgZGVsZXRlIGFzc2V0LmRlY1JlZjtcclxuICAgICAgICAgICAgZGVsZXRlIGFzc2V0WydAdHJhY2VNYXAnXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVudHJhY2VBc3NldChhc3NldDogY2MuQXNzZXQpIHtcclxuICAgICAgICBpZiAodGhpcy50cmFjZUFzc2V0cy5oYXMoYXNzZXQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRBc3NldChhc3NldCk7XHJcbiAgICAgICAgICAgIGFzc2V0LmRlY1JlZigpO1xyXG4gICAgICAgICAgICB0aGlzLnRyYWNlQXNzZXRzLmRlbGV0ZShhc3NldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydENoZWNrKCkgeyB0aGlzLl9jaGVja2luZyA9IHRydWU7IH1cclxuICAgIHB1YmxpYyBzdG9wQ2hlY2soKSB7IHRoaXMuX2NoZWNraW5nID0gZmFsc2U7IH1cclxuICAgIHB1YmxpYyBnZXRUcmFjZUFzc2V0cygpOiBTZXQ8Y2MuQXNzZXQ+IHsgcmV0dXJuIHRoaXMudHJhY2VBc3NldHM7IH1cclxuXHJcbiAgICBwdWJsaWMgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy50cmFjZUFzc2V0cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0QXNzZXQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZGVjUmVmKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50cmFjZUFzc2V0cy5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkdW1wKCkge1xyXG4gICAgICAgIHRoaXMudHJhY2VBc3NldHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHRyYWNlTWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gZWxlbWVudFsnQHRyYWNlTWFwJ107XHJcbiAgICAgICAgICAgIGlmICh0cmFjZU1hcCkge1xyXG4gICAgICAgICAgICAgICAgdHJhY2VNYXAuZm9yRWFjaCgoa2V5LCB2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2tleX0gOiAke3ZhbHVlfSBgKTsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/network/NetManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvbmV0d29yay9OZXRNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7Ozs7RUFJRTtBQUVGO0lBQUE7UUFFYyxjQUFTLEdBQStCLEVBQUUsQ0FBQztJQTJEekQsQ0FBQztJQXpEaUIsc0JBQVcsR0FBekI7UUFDSSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztTQUNyQztRQUNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRUQscUJBQXFCO0lBQ2QsK0JBQVUsR0FBakIsVUFBa0IsT0FBZ0IsRUFBRSxTQUFxQjtRQUFyQiwwQkFBQSxFQUFBLGFBQXFCO1FBQ3JELElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxTQUFTO0lBQ0Ysa0NBQWEsR0FBcEIsVUFBcUIsU0FBaUI7UUFDbEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxXQUFXO0lBQ0osNEJBQU8sR0FBZCxVQUFlLE9BQTBCLEVBQUUsU0FBcUI7UUFBckIsMEJBQUEsRUFBQSxhQUFxQjtRQUM1RCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNyRDtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxXQUFXO0lBQ0oseUJBQUksR0FBWCxVQUFZLEdBQVksRUFBRSxLQUFzQixFQUFFLFNBQXFCO1FBQTdDLHNCQUFBLEVBQUEsYUFBc0I7UUFBRSwwQkFBQSxFQUFBLGFBQXFCO1FBQ25FLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckMsSUFBRyxJQUFJLEVBQUU7WUFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELDBCQUEwQjtJQUNuQiw0QkFBTyxHQUFkLFVBQWUsR0FBWSxFQUFFLE1BQWMsRUFBRSxTQUF5QixFQUFFLFFBQXdCLEVBQUUsS0FBc0IsRUFBRSxTQUFxQjtRQUF2RSx5QkFBQSxFQUFBLGVBQXdCO1FBQUUsc0JBQUEsRUFBQSxhQUFzQjtRQUFFLDBCQUFBLEVBQUEsYUFBcUI7UUFDM0ksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyQyxJQUFHLElBQUksRUFBRTtZQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3pEO0lBQ0wsQ0FBQztJQUVELG1EQUFtRDtJQUM1QyxrQ0FBYSxHQUFwQixVQUFxQixHQUFZLEVBQUUsTUFBYyxFQUFFLFNBQXlCLEVBQUUsUUFBd0IsRUFBRSxLQUFzQixFQUFFLFNBQXFCO1FBQXZFLHlCQUFBLEVBQUEsZUFBd0I7UUFBRSxzQkFBQSxFQUFBLGFBQXNCO1FBQUUsMEJBQUEsRUFBQSxhQUFxQjtRQUNqSixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLElBQUcsSUFBSSxFQUFFO1lBQ0wsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN0RTtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxXQUFXO0lBQ0osMEJBQUssR0FBWixVQUFhLElBQWEsRUFBRSxNQUFlLEVBQUUsU0FBcUI7UUFBckIsMEJBQUEsRUFBQSxhQUFxQjtRQUM5RCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDOUQ7SUFDTCxDQUFDO0lBM0RjLG9CQUFTLEdBQWUsSUFBSSxDQUFDO0lBNERoRCxpQkFBQztDQTdERCxBQTZEQyxJQUFBO0FBN0RZLGdDQUFVIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV0Tm9kZSwgTmV0Q29ubmVjdE9wdGlvbnMgfSBmcm9tIFwiLi9OZXROb2RlXCI7XG5pbXBvcnQgeyBOZXREYXRhLCBDYWxsYmFja09iamVjdCB9IGZyb20gXCIuL05ldEludGVyZmFjZVwiO1xuXG4vKlxuKiAgIOe9kee7nOiKgueCueeuoeeQhuexu1xuKlxuKiAgIDIwMTktMTAtOCBieSDlrp3niLdcbiovXG5cbmV4cG9ydCBjbGFzcyBOZXRNYW5hZ2VyIHtcbiAgICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IE5ldE1hbmFnZXIgPSBudWxsO1xuICAgIHByb3RlY3RlZCBfY2hhbm5lbHM6IHsgW2tleTogbnVtYmVyXTogTmV0Tm9kZSB9ID0ge307XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IE5ldE1hbmFnZXIge1xuICAgICAgICBpZiAodGhpcy5faW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgTmV0TWFuYWdlcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvLyDmt7vliqBOb2Rl77yM6L+U5ZueQ2hhbm5lbElEXG4gICAgcHVibGljIHNldE5ldE5vZGUobmV3Tm9kZTogTmV0Tm9kZSwgY2hhbm5lbElkOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxJZF0gPSBuZXdOb2RlO1xuICAgIH1cblxuICAgIC8vIOenu+mZpE5vZGVcbiAgICBwdWJsaWMgcmVtb3ZlTmV0Tm9kZShjaGFubmVsSWQ6IG51bWJlcikge1xuICAgICAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbElkXTtcbiAgICB9XG5cbiAgICAvLyDosIPnlKhOb2Rl6L+e5o6lXG4gICAgcHVibGljIGNvbm5lY3Qob3B0aW9uczogTmV0Q29ubmVjdE9wdGlvbnMsIGNoYW5uZWxJZDogbnVtYmVyID0gMCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5fY2hhbm5lbHNbY2hhbm5lbElkXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxJZF0uY29ubmVjdChvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8g6LCD55SoTm9kZeWPkemAgVxuICAgIHB1YmxpYyBzZW5kKGJ1ZjogTmV0RGF0YSwgZm9yY2U6IGJvb2xlYW4gPSBmYWxzZSwgY2hhbm5lbElkOiBudW1iZXIgPSAwKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbElkXTtcbiAgICAgICAgaWYobm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuc2VuZChidWYsIGZvcmNlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8g5Y+R6LW36K+35rGC77yM5bm25Zyo5Zyo57uT5p6c6L+U5Zue5pe26LCD55So5oyH5a6a5aW955qE5Zue6LCD5Ye95pWwXG4gICAgcHVibGljIHJlcXVlc3QoYnVmOiBOZXREYXRhLCByc3BDbWQ6IG51bWJlciwgcnNwT2JqZWN0OiBDYWxsYmFja09iamVjdCwgc2hvd1RpcHM6IGJvb2xlYW4gPSB0cnVlLCBmb3JjZTogYm9vbGVhbiA9IGZhbHNlLCBjaGFubmVsSWQ6IG51bWJlciA9IDApIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsSWRdO1xuICAgICAgICBpZihub2RlKSB7XG4gICAgICAgICAgICBub2RlLnJlcXVlc3QoYnVmLCByc3BDbWQsIHJzcE9iamVjdCwgc2hvd1RpcHMsIGZvcmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWQjHJlcXVlc3TvvIzkvYblnKhyZXF1ZXN05LmL5YmN5Lya5YWI5Yik5pat6Zif5YiX5Lit5piv5ZCm5bey5pyJcnNwQ21k77yM5aaC5pyJ6YeN5aSN55qE5YiZ55u05o6l6L+U5ZueXG4gICAgcHVibGljIHJlcXVlc3RVbmlxdWUoYnVmOiBOZXREYXRhLCByc3BDbWQ6IG51bWJlciwgcnNwT2JqZWN0OiBDYWxsYmFja09iamVjdCwgc2hvd1RpcHM6IGJvb2xlYW4gPSB0cnVlLCBmb3JjZTogYm9vbGVhbiA9IGZhbHNlLCBjaGFubmVsSWQ6IG51bWJlciA9IDApOiBib29sZWFuIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsSWRdO1xuICAgICAgICBpZihub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5yZXF1ZXN0VW5pcXVlKGJ1ZiwgcnNwQ21kLCByc3BPYmplY3QsIHNob3dUaXBzLCBmb3JjZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIOiwg+eUqE5vZGXlhbPpl61cbiAgICBwdWJsaWMgY2xvc2UoY29kZT86IG51bWJlciwgcmVhc29uPzogc3RyaW5nLCBjaGFubmVsSWQ6IG51bWJlciA9IDApIHtcbiAgICAgICAgaWYgKHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxJZF0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsSWRdLmNsb3NlU29ja2V0KGNvZGUsIHJlYXNvbik7XG4gICAgICAgIH1cbiAgICB9XG59Il19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/res/ResUtil.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '8f503HZlhxLTY5UPaFTxC1e', 'ResUtil');
// Script/res/ResUtil.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResKeeper_1 = require("./ResKeeper");
var ResManager_1 = require("./ResManager");
/**
 * 资源使用相关工具类
 * 2020-1-18 by 宝爷
 */
function parseDepends(key, parsed) {
    var loader = cc.loader;
    var item = loader.getItem(key);
    if (item) {
        var depends = item.dependKeys;
        if (depends) {
            for (var i = 0; i < depends.length; i++) {
                var depend = depends[i];
                if (!parsed.has(depend)) {
                    parsed.add(depend);
                    parseDepends(depend, parsed);
                }
            }
        }
    }
}
function visitAsset(asset, excludeMap) {
    if (!asset._uuid) {
        return;
    }
    var loader = cc.loader;
    var key = loader._getReferenceKey(asset);
    if (!excludeMap.has(key)) {
        excludeMap.add(key);
        parseDepends(key, excludeMap);
    }
}
function visitComponent(comp, excludeMap) {
    var props = Object.getOwnPropertyNames(comp);
    for (var i = 0; i < props.length; i++) {
        var value = comp[props[i]];
        if (typeof value === 'object' && value) {
            if (Array.isArray(value)) {
                for (var j = 0; j < value.length; j++) {
                    var val = value[j];
                    if (val instanceof cc.RawAsset) {
                        visitAsset(val, excludeMap);
                    }
                }
            }
            else if (!value.constructor || value.constructor === Object) {
                var keys = Object.getOwnPropertyNames(value);
                for (var j = 0; j < keys.length; j++) {
                    var val = value[keys[j]];
                    if (val instanceof cc.RawAsset) {
                        visitAsset(val, excludeMap);
                    }
                }
            }
            else if (value instanceof cc.RawAsset) {
                visitAsset(value, excludeMap);
            }
        }
    }
}
function visitNode(node, excludeMap) {
    for (var i = 0; i < node._components.length; i++) {
        visitComponent(node._components[i], excludeMap);
    }
    for (var i = 0; i < node._children.length; i++) {
        visitNode(node._children[i], excludeMap);
    }
}
var ResUtil = /** @class */ (function () {
    function ResUtil() {
    }
    ResUtil.load = function () {
        var attachNode = arguments[0];
        var keeper = ResUtil.getResKeeper(attachNode);
        var newArgs = new Array();
        for (var i = 1; i < arguments.length; ++i) {
            newArgs[i - 1] = arguments[i];
        }
        keeper.load.apply(keeper, newArgs);
    };
    /**
     * 从目标节点或其父节点递归查找一个资源挂载组件
     * @param attachNode 目标节点
     * @param autoCreate 当目标节点找不到ResKeeper时是否自动创建一个
     */
    ResUtil.getResKeeper = function (attachNode, autoCreate) {
        if (attachNode) {
            var ret = attachNode.getComponent(ResKeeper_1.ResKeeper);
            if (!ret) {
                if (autoCreate) {
                    return attachNode.addComponent(ResKeeper_1.ResKeeper);
                }
                else {
                    return ResUtil.getResKeeper(attachNode.parent, autoCreate);
                }
            }
            return ret;
        }
        return ResManager_1.default.Instance.getKeeper();
    };
    /**
    * 赋值srcAsset，并使其跟随targetNode自动释放，用法如下
    * mySprite.spriteFrame = AssignWith(otherSpriteFrame, mySpriteNode);
    * @param srcAsset 用于赋值的资源，如cc.SpriteFrame、cc.Texture等等
    * @param targetNode
    * @param autoCreate
    */
    ResUtil.assignWith = function (srcAsset, targetNode, autoCreate) {
        var keeper = ResUtil.getResKeeper(targetNode, autoCreate);
        if (keeper && srcAsset instanceof cc.Asset) {
            keeper.cacheAsset(srcAsset);
            return srcAsset;
        }
        else {
            console.error("assignWith " + srcAsset + " to " + targetNode + " faile");
            return null;
        }
    };
    /**
     * 实例化一个prefab，并带自动释放功能
     * @param prefab 要实例化的预制
     */
    ResUtil.instantiate = function (prefab) {
        var node = cc.instantiate(prefab);
        var keeper = ResUtil.getResKeeper(node, true);
        if (keeper) {
            keeper.cacheAsset(prefab);
        }
        return node;
    };
    /**
     * 获取一系列节点依赖的资源
     */
    ResUtil.getNodesDepends = function (nodes) {
        var ret = new Set();
        for (var i = 0; i < nodes.length; i++) {
            visitNode(nodes[i], ret);
        }
        return ret;
    };
    /**
     * 从字符串中查找第N个字符
     * @param str 目标字符串
     * @param cha 要查找的字符
     * @param num 第N个
     */
    ResUtil.findCharPos = function (str, cha, num) {
        var x = str.indexOf(cha);
        var ret = x;
        for (var i = 0; i < num; i++) {
            x = str.indexOf(cha, x + 1);
            if (x != -1) {
                ret = x;
            }
            else {
                return ret;
            }
        }
        return ret;
    };
    /**
     * 获取当前调用堆栈
     * @param popCount 要弹出的堆栈数量
     */
    ResUtil.getCallStack = function (popCount) {
        // 严格模式无法访问 arguments.callee.caller 获取堆栈，只能先用Error的stack
        var ret = (new Error()).stack;
        var pos = ResUtil.findCharPos(ret, '\n', popCount);
        if (pos > 0) {
            ret = ret.slice(pos);
        }
        return ret;
    };
    return ResUtil;
}());
exports.ResUtil = ResUtil;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvcmVzL1Jlc1V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBd0M7QUFFeEMsMkNBQXNDO0FBQ3RDOzs7R0FHRztBQUVILFNBQVMsWUFBWSxDQUFDLEdBQUcsRUFBRSxNQUFtQjtJQUMxQyxJQUFJLE1BQU0sR0FBUSxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQzVCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsSUFBSSxJQUFJLEVBQUU7UUFDTixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQzlCLElBQUksT0FBTyxFQUFFO1lBQ1QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQ3JCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ25CLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQ2hDO2FBQ0o7U0FDSjtLQUNKO0FBQ0wsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFDLEtBQUssRUFBRSxVQUF1QjtJQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtRQUNkLE9BQU87S0FDVjtJQUNELElBQUksTUFBTSxHQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDNUIsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3RCLFVBQVUsQ0FBQyxHQUFH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QUFZLEdBQW5CLFVBQW9CLFFBQWdCO1FBQ2hDLHdEQUF3RDtRQUN4RCxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDOUIsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtZQUNULEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3hCO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBQ0wsY0FBQztBQUFELENBbElBLEFBa0lDLElBQUE7QUFsSVksMEJBQU8iLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXNLZWVwZXIgfSBmcm9tIFwiLi9SZXNLZWVwZXJcIjtcclxuaW1wb3J0IHsgQ29tcGxldGVkQ2FsbGJhY2ssIFByb2Nlc3NDYWxsYmFjayB9IGZyb20gXCIuL1Jlc0xvYWRlclwiO1xyXG5pbXBvcnQgUmVzTWFuYWdlciBmcm9tIFwiLi9SZXNNYW5hZ2VyXCI7XHJcbi8qKlxyXG4gKiDotYTmupDkvb/nlKjnm7jlhbPlt6XlhbfnsbtcclxuICogMjAyMC0xLTE4IGJ5IOWuneeIt1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIHBhcnNlRGVwZW5kcyhrZXksIHBhcnNlZDogU2V0PHN0cmluZz4pIHtcclxuICAgIGxldCBsb2FkZXI6IGFueSA9IGNjLmxvYWRlcjtcclxuICAgIHZhciBpdGVtID0gbG9hZGVyLmdldEl0ZW0oa2V5KTtcclxuICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgdmFyIGRlcGVuZHMgPSBpdGVtLmRlcGVuZEtleXM7XHJcbiAgICAgICAgaWYgKGRlcGVuZHMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZXBlbmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVwZW5kID0gZGVwZW5kc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmICghcGFyc2VkLmhhcyhkZXBlbmQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkLmFkZChkZXBlbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlRGVwZW5kcyhkZXBlbmQsIHBhcnNlZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZpc2l0QXNzZXQoYXNzZXQsIGV4Y2x1ZGVNYXA6IFNldDxzdHJpbmc+KSB7XHJcbiAgICBpZiAoIWFzc2V0Ll91dWlkKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGxvYWRlcjogYW55ID0gY2MubG9hZGVyO1xyXG4gICAgdmFyIGtleSA9IGxvYWRlci5fZ2V0UmVmZXJlbmNlS2V5KGFzc2V0KTtcclxuICAgIGlmICghZXhjbHVkZU1hcC5oYXMoa2V5KSkge1xyXG4gICAgICAgIGV4Y2x1ZGVNYXAuYWRkKGtleSk7XHJcbiAgICAgICAgcGFyc2VEZXBlbmRzKGtleSwgZXhjbHVkZU1hcCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZpc2l0Q29tcG9uZW50KGNvbXAsIGV4Y2x1ZGVNYXApIHtcclxuICAgIHZhciBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGNvbXApO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IGNvbXBbcHJvcHNbaV1dO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB2YWx1ZS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWwgPSB2YWx1ZVtqXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsIGluc3RhbmNlb2YgY2MuUmF3QXNzZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaXRBc3NldCh2YWwsIGV4Y2x1ZGVNYXApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICghdmFsdWUuY29uc3RydWN0b3IgfHwgdmFsdWUuY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGtleXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsID0gdmFsdWVba2V5c1tqXV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIGNjLlJhd0Fzc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2l0QXNzZXQodmFsLCBleGNsdWRlTWFwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBjYy5SYXdBc3NldCkge1xyXG4gICAgICAgICAgICAgICAgdmlzaXRBc3NldCh2YWx1ZSwgZXhjbHVkZU1hcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZpc2l0Tm9kZShub2RlLCBleGNsdWRlTWFwKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuX2NvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2aXNpdENvbXBvbmVudChub2RlLl9jb21wb25lbnRzW2ldLCBleGNsdWRlTWFwKTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5fY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2aXNpdE5vZGUobm9kZS5fY2hpbGRyZW5baV0sIGV4Y2x1ZGVNYXApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVzVXRpbCB7XHJcbiAgICAvKipcclxuICAgICAqIOW8gOWni+WKoOi9vei1hOa6kFxyXG4gICAgICogQHBhcmFtIGJ1bmRsZSAgICAgICAgYXNzZXRidW5kbGXnmoTot6/lvoRcclxuICAgICAqIEBwYXJhbSB1cmwgICAgICAgICAgIOi1hOa6kHVybOaIlnVybOaVsOe7hFxyXG4gICAgICogQHBhcmFtIHR5cGUgICAgICAgICAg6LWE5rqQ57G75Z6L77yM6buY6K6k5Li6bnVsbFxyXG4gICAgICogQHBhcmFtIG9uUHJvZ2VzcyAgICAg5Yqg6L296L+b5bqm5Zue6LCDXHJcbiAgICAgKiBAcGFyYW0gb25Db21wbGV0ZWQgICDliqDovb3lrozmiJDlm57osINcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGF0dGFjaE5vZGU6IGNjLk5vZGUsIHVybDogc3RyaW5nLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGF0dGFjaE5vZGU6IGNjLk5vZGUsIHVybDogc3RyaW5nLCBvblByb2dlc3M6IFByb2Nlc3NDYWxsYmFjaywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZChhdHRhY2hOb2RlOiBjYy5Ob2RlLCB1cmw6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGF0dGFjaE5vZGU6IGNjLk5vZGUsIHVybDogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGF0dGFjaE5vZGU6IGNjLk5vZGUsIHVybDogc3RyaW5nW10sIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQoYXR0YWNoTm9kZTogY2MuTm9kZSwgdXJsOiBzdHJpbmdbXSwgb25Qcm9nZXNzOiBQcm9jZXNzQ2FsbGJhY2ssIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQoYXR0YWNoTm9kZTogY2MuTm9kZSwgdXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGF0dGFjaE5vZGU6IGNjLk5vZGUsIHVybDogc3RyaW5nW10sIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Qcm9nZXNzOiBQcm9jZXNzQ2FsbGJhY2ssIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQoYXR0YWNoTm9kZTogY2MuTm9kZSwgYnVuZGxlOiBzdHJpbmcsIHVybDogc3RyaW5nLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGF0dGFjaE5vZGU6IGNjLk5vZGUsIGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZywgb25Qcm9nZXNzOiBQcm9jZXNzQ2FsbGJhY2ssIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQoYXR0YWNoTm9kZTogY2MuTm9kZSwgYnVuZGxlOiBzdHJpbmcsIHVybDogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjayk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQoYXR0YWNoTm9kZTogY2MuTm9kZSwgYnVuZGxlOiBzdHJpbmcsIHVybDogc3RyaW5nLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGF0dGFjaE5vZGU6IGNjLk5vZGUsIGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZ1tdLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGF0dGFjaE5vZGU6IGNjLk5vZGUsIGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZ1tdLCBvblByb2dlc3M6IFByb2Nlc3NDYWxsYmFjaywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZChhdHRhY2hOb2RlOiBjYy5Ob2RlLCBidW5kbGU6IHN0cmluZywgdXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGF0dGFjaE5vZGU6IGNjLk5vZGUsIGJ1bmRsZTogc3RyaW5nLCB1cmw6IHN0cmluZ1tdLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXQsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2spO1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKCkge1xyXG4gICAgICAgIGxldCBhdHRhY2hOb2RlID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIGxldCBrZWVwZXIgPSBSZXNVdGlsLmdldFJlc0tlZXBlcihhdHRhY2hOb2RlKTtcclxuICAgICAgICBsZXQgbmV3QXJncyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIG5ld0FyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBrZWVwZXIubG9hZC5hcHBseShrZWVwZXIsIG5ld0FyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5LuO55uu5qCH6IqC54K55oiW5YW254i26IqC54K56YCS5b2S5p+l5om+5LiA5Liq6LWE5rqQ5oyC6L2957uE5Lu2XHJcbiAgICAgKiBAcGFyYW0gYXR0YWNoTm9kZSDnm67moIfoioLngrlcclxuICAgICAqIEBwYXJhbSBhdXRvQ3JlYXRlIOW9k+ebruagh+iKgueCueaJvuS4jeWIsFJlc0tlZXBlcuaXtuaYr+WQpuiHquWKqOWIm+W7uuS4gOS4qlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJlc0tlZXBlcihhdHRhY2hOb2RlOiBjYy5Ob2RlLCBhdXRvQ3JlYXRlPzogYm9vbGVhbik6IFJlc0tlZXBlciB7XHJcbiAgICAgICAgaWYgKGF0dGFjaE5vZGUpIHtcclxuICAgICAgICAgICAgbGV0IHJldCA9IGF0dGFjaE5vZGUuZ2V0Q29tcG9uZW50KFJlc0tlZXBlcik7XHJcbiAgICAgICAgICAgIGlmICghcmV0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXV0b0NyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhdHRhY2hOb2RlLmFkZENvbXBvbmVudChSZXNLZWVwZXIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzVXRpbC5nZXRSZXNLZWVwZXIoYXR0YWNoTm9kZS5wYXJlbnQsIGF1dG9DcmVhdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBSZXNNYW5hZ2VyLkluc3RhbmNlLmdldEtlZXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgICAvKipcclxuICAgICAqIOi1i+WAvHNyY0Fzc2V077yM5bm25L2/5YW26Lef6ZqPdGFyZ2V0Tm9kZeiHquWKqOmHiuaUvu+8jOeUqOazleWmguS4i1xyXG4gICAgICogbXlTcHJpdGUuc3ByaXRlRnJhbWUgPSBBc3NpZ25XaXRoKG90aGVyU3ByaXRlRnJhbWUsIG15U3ByaXRlTm9kZSk7XHJcbiAgICAgKiBAcGFyYW0gc3JjQXNzZXQg55So5LqO6LWL5YC855qE6LWE5rqQ77yM5aaCY2MuU3ByaXRlRnJhbWXjgIFjYy5UZXh0dXJl562J562JXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0Tm9kZSBcclxuICAgICAqIEBwYXJhbSBhdXRvQ3JlYXRlIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzc2lnbldpdGgoc3JjQXNzZXQ6IGNjLkFzc2V0LCB0YXJnZXROb2RlOiBjYy5Ob2RlLCBhdXRvQ3JlYXRlPzogYm9vbGVhbik6IGFueSB7XHJcbiAgICAgICAgbGV0IGtlZXBlciA9IFJlc1V0aWwuZ2V0UmVzS2VlcGVyKHRhcmdldE5vZGUsIGF1dG9DcmVhdGUpO1xyXG4gICAgICAgIGlmIChrZWVwZXIgJiYgc3JjQXNzZXQgaW5zdGFuY2VvZiBjYy5Bc3NldCkge1xyXG4gICAgICAgICAgICBrZWVwZXIuY2FjaGVBc3NldChzcmNBc3NldCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzcmNBc3NldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBhc3NpZ25XaXRoICR7c3JjQXNzZXR9IHRvICR7dGFyZ2V0Tm9kZX0gZmFpbGVgKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5a6e5L6L5YyW5LiA5LiqcHJlZmFi77yM5bm25bim6Ieq5Yqo6YeK5pS+5Yqf6IO9XHJcbiAgICAgKiBAcGFyYW0gcHJlZmFiIOimgeWunuS+i+WMlueahOmihOWItlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbnRpYXRlKHByZWZhYjogY2MuUHJlZmFiKTogY2MuTm9kZSB7XHJcbiAgICAgICAgbGV0IG5vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xyXG4gICAgICAgIGxldCBrZWVwZXIgPSBSZXNVdGlsLmdldFJlc0tlZXBlcihub2RlLCB0cnVlKTtcclxuICAgICAgICBpZiAoa2VlcGVyKSB7XHJcbiAgICAgICAgICAgIGtlZXBlci5jYWNoZUFzc2V0KHByZWZhYik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5LiA57O75YiX6IqC54K55L6d6LWW55qE6LWE5rqQXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Tm9kZXNEZXBlbmRzKG5vZGVzOiBjYy5Ob2RlW10pOiBTZXQ8c3RyaW5nPiB7XHJcbiAgICAgICAgbGV0IHJldDogU2V0PHN0cmluZz4gPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZpc2l0Tm9kZShub2Rlc1tpXSwgcmV0KVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cdFxyXG4gICAgLyoqXHJcbiAgICAgKiDku47lrZfnrKbkuLLkuK3mn6Xmib7nrKxO5Liq5a2X56ymXHJcbiAgICAgKiBAcGFyYW0gc3RyIOebruagh+Wtl+espuS4slxyXG4gICAgICogQHBhcmFtIGNoYSDopoHmn6Xmib7nmoTlrZfnrKZcclxuICAgICAqIEBwYXJhbSBudW0g56ysTuS4qlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZmluZENoYXJQb3Moc3RyOiBzdHJpbmcsIGNoYTogc3RyaW5nLCBudW06IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IHggPSBzdHIuaW5kZXhPZihjaGEpO1xyXG4gICAgICAgIGxldCByZXQgPSB4O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcclxuICAgICAgICAgICAgeCA9IHN0ci5pbmRleE9mKGNoYSwgeCArIDEpO1xyXG4gICAgICAgICAgICBpZiAoeCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0ID0geDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluW9k+WJjeiwg+eUqOWghuagiFxyXG4gICAgICogQHBhcmFtIHBvcENvdW50IOimgeW8ueWHuueahOWghuagiOaVsOmHj1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0Q2FsbFN0YWNrKHBvcENvdW50OiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIC8vIOS4peagvOaooeW8j+aXoOazleiuv+mXriBhcmd1bWVudHMuY2FsbGVlLmNhbGxlciDojrflj5bloIbmoIjvvIzlj6rog73lhYjnlKhFcnJvcueahHN0YWNrXHJcbiAgICAgICAgbGV0IHJldCA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XHJcbiAgICAgICAgbGV0IHBvcyA9IFJlc1V0aWwuZmluZENoYXJQb3MocmV0LCAnXFxuJywgcG9wQ291bnQpO1xyXG4gICAgICAgIGlmIChwb3MgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHJldC5zbGljZShwb3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/res/ResPool.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '4d239KZe5hI4Zb4kyjxarWh', 'ResPool');
// Script/res/ResPool.ts

// import ResLoader, { resLoader, CompletedCallback, ProcessCallback, LoadResArgs } from "./ResLoader";
// /**
//  * ResPool，可提高资源缓存的效率，
//  * 当超过警戒水位时，每次加载新的资源都会自动检查可释放的资源进行释放
//  * 也可以手动调用releaseUnuseRes，自动释放可释放的资源
//  * 
//  * 2020-1-19 by 宝爷
//  */
// export class ResPool {
//     private _useKey: string;
//     private _urls: string[] = [];
//     private _waterMark: number = 32;
//     constructor() {
//         this._useKey = `@ResPool${resLoader.nextUseKey()}`;
//     }
//     /**
//      * 开始加载资源
//      * @param url           资源url
//      * @param type          资源类型，默认为null
//      * @param onProgess     加载进度回调
//      * @param onCompleted   加载完成回调
//      * @param use           资源使用key，根据makeUseKey方法生成
//      */
//     public loadRes(url: string, use?: string);
//     public loadRes(url: string, onCompleted: CompletedCallback, use?: string);
//     public loadRes(url: string, onProgess: ProcessCallback, onCompleted: CompletedCallback, use?: string);
//     public loadRes(url: string, type: typeof cc.Asset, use?: string);
//     public loadRes(url: string, type: typeof cc.Asset, onCompleted: CompletedCallback, use?: string);
//     public loadRes(url: string, type: typeof cc.Asset, onProgess: ProcessCallback, onCompleted: CompletedCallback, use?: string);
//     public loadRes() {
//         this.autoCheck();
//         let resArgs: LoadResArgs = ResLoader.makeLoadResArgs.apply(this, arguments);
//         let SaveCompleted = resArgs.onCompleted;
//         resArgs.onCompleted = (error: Error, resource: any) => {
//             let url = resLoader.getResKeyByAsset(resource);
//             if (!error && url) {
//                 this.addNewResUrl(url);
//             }
//             if (SaveCompleted) {
//                 SaveCompleted(error, resource);
//             }
//         };
//     }
//     /**
//      * 设置监控水位
//      * @param waterMakr 水位
//      */
//     public setWaterMark(waterMakr: number) {
//         this._waterMark = waterMakr;
//     }
//     /**
//      * 是否缓存了某url（这里的url为resloader的_resMap的key，可能不等于加载的url）
//      * @param url 
//      */
//     public hasResUrl(url: string) : boolean {
//         for (let i = 0; i < this._urls.length; ++i) {
//             if (url == this._urls[i]) {
//                 return true;
//             }
//         }
//         return false;
//     }
//     /**
//      * 加载完成后添加一个use
//      * @param url 
//      */
//     private addNewResUrl(url: string) {
//         if (!this.hasResUrl(url) && resLoader.addUse(url, this._useKey)) {
//             this._urls[this._urls.length] = url;
//         }
//     }
//     /**
//      * 自动检测是否需要释放资源，需要则自动释放资源
//      */
//     public autoCheck() {
//         if (this._urls.length > this._waterMark) {
//             this.autoReleaseUnuseRes();
//         }
//     }
//     /**
//      * 自动释放资源
//      */
//     public autoReleaseUnuseRes() {
//         for (let i = this._urls.length; i >= 0; --i) {
//             if (resLoader.canRelease(this._urls[i], this._useKey)) {
//                 resLoader.releaseRes(this._urls[i], this._useKey);
//                 this._urls.splice(i, 1);
//             }
//         }
//     }
//     /**
//      * 清空该ResPool
//      */
//     public destroy() {
//         for (let i = this._urls.length; i >= 0; --i) {
//             resLoader.releaseRes(this._urls[i], this._useKey);
//         }
//         this._urls.length = 0;
//     }
//     /**
//      * 调试打印缓存的urls
//      */
//     public dump() {
//         console.log(this._urls);
//     }
// }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvcmVzL1Jlc1Bvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUdBQXVHO0FBRXZHLE1BQU07QUFDTix5QkFBeUI7QUFDekIsdUNBQXVDO0FBQ3ZDLHVDQUF1QztBQUN2QyxNQUFNO0FBQ04scUJBQXFCO0FBQ3JCLE1BQU07QUFFTix5QkFBeUI7QUFDekIsK0JBQStCO0FBQy9CLG9DQUFvQztBQUNwQyx1Q0FBdUM7QUFFdkMsc0JBQXNCO0FBQ3RCLDhEQUE4RDtBQUM5RCxRQUFRO0FBRVIsVUFBVTtBQUNWLGdCQUFnQjtBQUNoQixvQ0FBb0M7QUFDcEMsMkNBQTJDO0FBQzNDLHFDQUFxQztBQUNyQyxxQ0FBcUM7QUFDckMsdURBQXVEO0FBQ3ZELFVBQVU7QUFDVixpREFBaUQ7QUFDakQsaUZBQWlGO0FBQ2pGLDZHQUE2RztBQUM3Ryx3RUFBd0U7QUFDeEUsd0dBQXdHO0FBQ3hHLG9JQUFvSTtBQUNwSSx5QkFBeUI7QUFDekIsNEJBQTRCO0FBQzVCLHVGQUF1RjtBQUN2RixtREFBbUQ7QUFDbkQsbUVBQW1FO0FBQ25FLDhEQUE4RDtBQUM5RCxtQ0FBbUM7QUFDbkMsMENBQTBDO0FBQzFDLGdCQUFnQjtBQUNoQixtQ0FBbUM7QUFDbkMsa0RBQWtEO0FBQ2xELGdCQUFnQjtBQUNoQixhQUFhO0FBQ2IsUUFBUTtBQUVSLFVBQVU7QUFDVixnQkFBZ0I7QUFDaEIsNkJBQTZCO0FBQzdCLFVBQVU7QUFDViwrQ0FBK0M7QUFDL0MsdUNBQXVDO0FBQ3ZDLFFBQVE7QUFFUixVQUFVO0FBQ1YsNkRBQTZEO0FBQzdELHFCQUFxQjtBQUNyQixVQUFVO0FBQ1YsZ0RBQWdEO0FBQ2hELHdEQUF3RDtBQUN4RCwwQ0FBMEM7QUFDMUMsK0JBQStCO0FBQy9CLGdCQUFnQjtBQUNoQixZQUFZO0FBQ1osd0JBQXdCO0FBQ3hCLFFBQVE7QUFFUixVQUFVO0FBQ1Ysc0JBQXNCO0FBQ3RCLHFCQUFxQjtBQUNyQixVQUFVO0FBQ1YsMENBQTBDO0FBQzFDLDZFQUE2RTtBQUM3RSxtREFBbUQ7QUFDbkQsWUFBWTtBQUNaLFFBQVE7QUFFUixVQUFVO0FBQ1YsZ0NBQWdDO0FBQ2hDLFVBQVU7QUFDViwyQkFBMkI7QUFDM0IscURBQXFEO0FBQ3JELDBDQUEwQztBQUMxQyxZQUFZO0FBQ1osUUFBUTtBQUVSLFVBQVU7QUFDVixnQkFBZ0I7QUFDaEIsVUFBVTtBQUNWLHFDQUFxQztBQUNyQyx5REFBeUQ7QUFDekQsdUVBQXVFO0FBQ3ZFLHFFQUFxRTtBQUNyRSwyQ0FBMkM7QUFDM0MsZ0JBQWdCO0FBQ2hCLFlBQVk7QUFDWixRQUFRO0FBRVIsVUFBVTtBQUNWLG9CQUFvQjtBQUNwQixVQUFVO0FBQ1YseUJBQXlCO0FBQ3pCLHlEQUF5RDtBQUN6RCxpRUFBaUU7QUFDakUsWUFBWTtBQUNaLGlDQUFpQztBQUNqQyxRQUFRO0FBRVIsVUFBVTtBQUNWLHFCQUFxQjtBQUNyQixVQUFVO0FBQ1Ysc0JBQXNCO0FBQ3RCLG1DQUFtQztBQUNuQyxRQUFRO0FBQ1IsSUFBSSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBSZXNMb2FkZXIsIHsgcmVzTG9hZGVyLCBDb21wbGV0ZWRDYWxsYmFjaywgUHJvY2Vzc0NhbGxiYWNrLCBMb2FkUmVzQXJncyB9IGZyb20gXCIuL1Jlc0xvYWRlclwiO1xyXG5cclxuLy8gLyoqXHJcbi8vICAqIFJlc1Bvb2zvvIzlj6/mj5Dpq5jotYTmupDnvJPlrZjnmoTmlYjnjofvvIxcclxuLy8gICog5b2T6LaF6L+H6K2m5oiS5rC05L2N5pe277yM5q+P5qyh5Yqg6L295paw55qE6LWE5rqQ6YO95Lya6Ieq5Yqo5qOA5p+l5Y+v6YeK5pS+55qE6LWE5rqQ6L+b6KGM6YeK5pS+XHJcbi8vICAqIOS5n+WPr+S7peaJi+WKqOiwg+eUqHJlbGVhc2VVbnVzZVJlc++8jOiHquWKqOmHiuaUvuWPr+mHiuaUvueahOi1hOa6kFxyXG4vLyAgKiBcclxuLy8gICogMjAyMC0xLTE5IGJ5IOWuneeIt1xyXG4vLyAgKi9cclxuXHJcbi8vIGV4cG9ydCBjbGFzcyBSZXNQb29sIHtcclxuLy8gICAgIHByaXZhdGUgX3VzZUtleTogc3RyaW5nO1xyXG4vLyAgICAgcHJpdmF0ZSBfdXJsczogc3RyaW5nW10gPSBbXTtcclxuLy8gICAgIHByaXZhdGUgX3dhdGVyTWFyazogbnVtYmVyID0gMzI7XHJcblxyXG4vLyAgICAgY29uc3RydWN0b3IoKSB7XHJcbi8vICAgICAgICAgdGhpcy5fdXNlS2V5ID0gYEBSZXNQb29sJHtyZXNMb2FkZXIubmV4dFVzZUtleSgpfWA7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDlvIDlp4vliqDovb3otYTmupBcclxuLy8gICAgICAqIEBwYXJhbSB1cmwgICAgICAgICAgIOi1hOa6kHVybFxyXG4vLyAgICAgICogQHBhcmFtIHR5cGUgICAgICAgICAg6LWE5rqQ57G75Z6L77yM6buY6K6k5Li6bnVsbFxyXG4vLyAgICAgICogQHBhcmFtIG9uUHJvZ2VzcyAgICAg5Yqg6L296L+b5bqm5Zue6LCDXHJcbi8vICAgICAgKiBAcGFyYW0gb25Db21wbGV0ZWQgICDliqDovb3lrozmiJDlm57osINcclxuLy8gICAgICAqIEBwYXJhbSB1c2UgICAgICAgICAgIOi1hOa6kOS9v+eUqGtlee+8jOagueaNrm1ha2VVc2VLZXnmlrnms5XnlJ/miJBcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIGxvYWRSZXModXJsOiBzdHJpbmcsIHVzZT86IHN0cmluZyk7XHJcbi8vICAgICBwdWJsaWMgbG9hZFJlcyh1cmw6IHN0cmluZywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrLCB1c2U/OiBzdHJpbmcpO1xyXG4vLyAgICAgcHVibGljIGxvYWRSZXModXJsOiBzdHJpbmcsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2ssIHVzZT86IHN0cmluZyk7XHJcbi8vICAgICBwdWJsaWMgbG9hZFJlcyh1cmw6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCB1c2U/OiBzdHJpbmcpO1xyXG4vLyAgICAgcHVibGljIGxvYWRSZXModXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrLCB1c2U/OiBzdHJpbmcpO1xyXG4vLyAgICAgcHVibGljIGxvYWRSZXModXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Qcm9nZXNzOiBQcm9jZXNzQ2FsbGJhY2ssIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjaywgdXNlPzogc3RyaW5nKTtcclxuLy8gICAgIHB1YmxpYyBsb2FkUmVzKCkge1xyXG4vLyAgICAgICAgIHRoaXMuYXV0b0NoZWNrKCk7XHJcbi8vICAgICAgICAgbGV0IHJlc0FyZ3M6IExvYWRSZXNBcmdzID0gUmVzTG9hZGVyLm1ha2VMb2FkUmVzQXJncy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4vLyAgICAgICAgIGxldCBTYXZlQ29tcGxldGVkID0gcmVzQXJncy5vbkNvbXBsZXRlZDtcclxuLy8gICAgICAgICByZXNBcmdzLm9uQ29tcGxldGVkID0gKGVycm9yOiBFcnJvciwgcmVzb3VyY2U6IGFueSkgPT4ge1xyXG4vLyAgICAgICAgICAgICBsZXQgdXJsID0gcmVzTG9hZGVyLmdldFJlc0tleUJ5QXNzZXQocmVzb3VyY2UpO1xyXG4vLyAgICAgICAgICAgICBpZiAoIWVycm9yICYmIHVybCkge1xyXG4vLyAgICAgICAgICAgICAgICAgdGhpcy5hZGROZXdSZXNVcmwodXJsKTtcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICBpZiAoU2F2ZUNvbXBsZXRlZCkge1xyXG4vLyAgICAgICAgICAgICAgICAgU2F2ZUNvbXBsZXRlZChlcnJvciwgcmVzb3VyY2UpO1xyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOiuvue9ruebkeaOp+awtOS9jVxyXG4vLyAgICAgICogQHBhcmFtIHdhdGVyTWFrciDmsLTkvY1cclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHNldFdhdGVyTWFyayh3YXRlck1ha3I6IG51bWJlcikge1xyXG4vLyAgICAgICAgIHRoaXMuX3dhdGVyTWFyayA9IHdhdGVyTWFrcjtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOaYr+WQpue8k+WtmOS6huafkHVybO+8iOi/memHjOeahHVybOS4unJlc2xvYWRlcueahF9yZXNNYXDnmoRrZXnvvIzlj6/og73kuI3nrYnkuo7liqDovb3nmoR1cmzvvIlcclxuLy8gICAgICAqIEBwYXJhbSB1cmwgXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBoYXNSZXNVcmwodXJsOiBzdHJpbmcpIDogYm9vbGVhbiB7XHJcbi8vICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl91cmxzLmxlbmd0aDsgKytpKSB7XHJcbi8vICAgICAgICAgICAgIGlmICh1cmwgPT0gdGhpcy5fdXJsc1tpXSkge1xyXG4vLyAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog5Yqg6L295a6M5oiQ5ZCO5re75Yqg5LiA5LiqdXNlXHJcbi8vICAgICAgKiBAcGFyYW0gdXJsIFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwcml2YXRlIGFkZE5ld1Jlc1VybCh1cmw6IHN0cmluZykge1xyXG4vLyAgICAgICAgIGlmICghdGhpcy5oYXNSZXNVcmwodXJsKSAmJiByZXNMb2FkZXIuYWRkVXNlKHVybCwgdGhpcy5fdXNlS2V5KSkge1xyXG4vLyAgICAgICAgICAgICB0aGlzLl91cmxzW3RoaXMuX3VybHMubGVuZ3RoXSA9IHVybDtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDoh6rliqjmo4DmtYvmmK/lkKbpnIDopoHph4rmlL7otYTmupDvvIzpnIDopoHliJnoh6rliqjph4rmlL7otYTmupBcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIGF1dG9DaGVjaygpIHtcclxuLy8gICAgICAgICBpZiAodGhpcy5fdXJscy5sZW5ndGggPiB0aGlzLl93YXRlck1hcmspIHtcclxuLy8gICAgICAgICAgICAgdGhpcy5hdXRvUmVsZWFzZVVudXNlUmVzKCk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog6Ieq5Yqo6YeK5pS+6LWE5rqQXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBhdXRvUmVsZWFzZVVudXNlUmVzKCkge1xyXG4vLyAgICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl91cmxzLmxlbmd0aDsgaSA+PSAwOyAtLWkpIHtcclxuLy8gICAgICAgICAgICAgaWYgKHJlc0xvYWRlci5jYW5SZWxlYXNlKHRoaXMuX3VybHNbaV0sIHRoaXMuX3VzZUtleSkpIHtcclxuLy8gICAgICAgICAgICAgICAgIHJlc0xvYWRlci5yZWxlYXNlUmVzKHRoaXMuX3VybHNbaV0sIHRoaXMuX3VzZUtleSk7XHJcbi8vICAgICAgICAgICAgICAgICB0aGlzLl91cmxzLnNwbGljZShpLCAxKTtcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOa4heepuuivpVJlc1Bvb2xcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIGRlc3Ryb3koKSB7XHJcbi8vICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX3VybHMubGVuZ3RoOyBpID49IDA7IC0taSkge1xyXG4vLyAgICAgICAgICAgICByZXNMb2FkZXIucmVsZWFzZVJlcyh0aGlzLl91cmxzW2ldLCB0aGlzLl91c2VLZXkpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICB0aGlzLl91cmxzLmxlbmd0aCA9IDA7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDosIPor5XmiZPljbDnvJPlrZjnmoR1cmxzXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBkdW1wKCkge1xyXG4vLyAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX3VybHMpO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/ui/UIView.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '743a8DSuqhBr4IQgN4a26Ii', 'UIView');
// Script/ui/UIView.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ResKeeper_1 = require("../res/ResKeeper");
/**
 * UIView界面基础类
 *
 * 1. 快速关闭与屏蔽点击的选项配置
 * 2. 界面缓存设置（开启后界面关闭不会被释放，以便下次快速打开）
 * 3. 界面显示类型配置
 *
 * 4. 加载资源接口（随界面释放自动释放），this.loadRes(xxx)
 * 5. 由UIManager释放
 *
 * 5. 界面初始化回调（只调用一次）
 * 6. 界面打开回调（每次打开回调）
 * 7. 界面打开动画播放结束回调（动画播放完回调）
 * 8. 界面关闭回调
 * 9. 界面置顶回调
 *
 * 2018-8-28 by 宝爷
 */
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
/** 界面展示类型 */
var UIShowTypes;
(function (UIShowTypes) {
    UIShowTypes[UIShowTypes["UIFullScreen"] = 0] = "UIFullScreen";
    UIShowTypes[UIShowTypes["UIAddition"] = 1] = "UIAddition";
    UIShowTypes[UIShowTypes["UISingle"] = 2] = "UISingle";
})(UIShowTypes = exports.UIShowTypes || (exports.UIShowTypes = {}));
;
var UIView = /** @class */ (function (_super) {
    __extends(UIView, _super);
    function UIView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 快速关闭 */
        _this.quickClose = false;
        /** 屏蔽点击选项 在UIConf设置屏蔽点击*/
        // @property
        // preventTouch: boolean = true;
        /** 缓存选项 */
        _this.cache = false;
        /** 界面显示类型 */
        _this.showType = UIShowTypes.UISingle;
        /** 界面id */
        _this.UIid = 0;
        return _this;
    }
    /********************** UI的回调 ***********************/
    /**
     * 当界面被创建时回调，生命周期内只调用
     * @param args 可变参数
     */
    UIView.prototype.init = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    /**
     * 当界面被打开时回调，每次调用Open时回调
     * @param fromUI 从哪个UI打开的
     * @param args 可变参数
     */
    UIView.prototype.onOpen = function (fromUI) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
    };
    /**
     * 每次界面Open动画播放完毕时回调
     */
    UIView.prototype.onOpenAniOver = function () {
    };
    /**
     * 当界面被关闭时回调，每次调用Close时回调
     * 返回值会传递给下一个界面
     */
    UIView.prototype.onClose = function () {
    };
    /**
     * 当界面被置顶时回调，Open时并不会回调该函数
     * @param preID 前一个ui
     * @param args 可变参数，
     */
    UIView.prototype.onTop = function (preID) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
    };
    /**  静态变量，用于区分相同界面的不同实例 */
    UIView.uiIndex = 0;
    __decorate([
        property
    ], UIView.prototype, "quickClose", void 0);
    __decorate([
        property
    ], UIView.prototype, "cache", void 0);
    __decorate([
        property({ type: cc.Enum(UIShowTypes) })
    ], UIView.prototype, "showType", void 0);
    UIView = __decorate([
        ccclass
    ], UIView);
    return UIView;
}(ResKeeper_1.ResKeeper));
exports.UIView = UIView;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvdWkvVUlWaWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUE2QztBQUU3Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFFRyxJQUFBLGtCQUFxQyxFQUFuQyxvQkFBTyxFQUFFLHNCQUEwQixDQUFDO0FBRTVDLGFBQWE7QUFDYixJQUFZLFdBSVg7QUFKRCxXQUFZLFdBQVc7SUFDbkIsNkRBQVksQ0FBQTtJQUNaLHlEQUFVLENBQUE7SUFDVixxREFBUSxDQUFBO0FBQ1osQ0FBQyxFQUpXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBSXRCO0FBQUEsQ0FBQztBQUdGO0lBQTRCLDBCQUFTO0lBRHJDO1FBQUEscUVBNkRDO1FBMURHLFdBQVc7UUFFWCxnQkFBVSxHQUFZLEtBQUssQ0FBQztRQUM1QiwwQkFBMEI7UUFDMUIsWUFBWTtRQUNaLGdDQUFnQztRQUNoQyxXQUFXO1FBRVgsV0FBSyxHQUFZLEtBQUssQ0FBQztRQUN2QixhQUFhO1FBRWIsY0FBUSxHQUFnQixXQUFXLENBQUMsUUFBUSxDQUFDO1FBRTdDLFdBQVc7UUFDSixVQUFJLEdBQVcsQ0FBQyxDQUFDOztJQTRDNUIsQ0FBQztJQXhDRyxzREFBc0Q7SUFDdEQ7OztPQUdHO0lBQ0kscUJBQUksR0FBWDtRQUFZLGNBQU87YUFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO1lBQVAseUJBQU87O0lBRW5CLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksdUJBQU0sR0FBYixVQUFjLE1BQWM7UUFBRSxjQUFPO2FBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztZQUFQLDZCQUFPOztJQUVyQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSw4QkFBYSxHQUFwQjtJQUNBLENBQUM7SUFFRDs7O09BR0c7SUFDSSx3QkFBTyxHQUFkO0lBRUEsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxzQkFBSyxHQUFaLFVBQWEsS0FBYTtRQUFFLGNBQU87YUFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO1lBQVAsNkJBQU87O0lBRW5DLENBQUM7SUExQ0QsMEJBQTBCO0lBQ1gsY0FBTyxHQUFXLENBQUMsQ0FBQztJQWRuQztRQURDLFFBQVE7OENBQ21CO0lBTTVCO1FBREMsUUFBUTt5Q0FDYztJQUd2QjtRQURDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7NENBQ0k7SUFicEMsTUFBTTtRQURsQixPQUFPO09BQ0ssTUFBTSxDQTREbEI7SUFBRCxhQUFDO0NBNURELEFBNERDLENBNUQyQixxQkFBUyxHQTREcEM7QUE1RFksd0JBQU0iLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXNLZWVwZXIgfSBmcm9tIFwiLi4vcmVzL1Jlc0tlZXBlclwiO1xyXG5cclxuLyoqXHJcbiAqIFVJVmlld+eVjOmdouWfuuehgOexu1xyXG4gKiBcclxuICogMS4g5b+r6YCf5YWz6Zet5LiO5bGP6JS954K55Ye755qE6YCJ6aG56YWN572uXHJcbiAqIDIuIOeVjOmdoue8k+WtmOiuvue9ru+8iOW8gOWQr+WQjueVjOmdouWFs+mXreS4jeS8muiiq+mHiuaUvu+8jOS7peS+v+S4i+asoeW/q+mAn+aJk+W8gO+8iVxyXG4gKiAzLiDnlYzpnaLmmL7npLrnsbvlnovphY3nva5cclxuICogXHJcbiAqIDQuIOWKoOi9vei1hOa6kOaOpeWPo++8iOmaj+eVjOmdoumHiuaUvuiHquWKqOmHiuaUvu+8ie+8jHRoaXMubG9hZFJlcyh4eHgpXHJcbiAqIDUuIOeUsVVJTWFuYWdlcumHiuaUvlxyXG4gKiBcclxuICogNS4g55WM6Z2i5Yid5aeL5YyW5Zue6LCD77yI5Y+q6LCD55So5LiA5qyh77yJXHJcbiAqIDYuIOeVjOmdouaJk+W8gOWbnuiwg++8iOavj+asoeaJk+W8gOWbnuiwg++8iVxyXG4gKiA3LiDnlYzpnaLmiZPlvIDliqjnlLvmkq3mlL7nu5PmnZ/lm57osIPvvIjliqjnlLvmkq3mlL7lrozlm57osIPvvIlcclxuICogOC4g55WM6Z2i5YWz6Zet5Zue6LCDXHJcbiAqIDkuIOeVjOmdoue9rumhtuWbnuiwg1xyXG4gKiBcclxuICogMjAxOC04LTI4IGJ5IOWuneeIt1xyXG4gKi9cclxuXHJcbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG4vKiog55WM6Z2i5bGV56S657G75Z6LICovXHJcbmV4cG9ydCBlbnVtIFVJU2hvd1R5cGVzIHtcclxuICAgIFVJRnVsbFNjcmVlbiwgICAgICAgLy8g5YWo5bGP5pi+56S677yM5YWo5bGP55WM6Z2i5L2/55So6K+l6YCJ6aG55Y+v6I635b6X5pu06auY5oCn6IO9XHJcbiAgICBVSUFkZGl0aW9uLCAgICAgICAgIC8vIOWPoOWKoOaYvuekuu+8jOaAp+iDvei+g+W3rlxyXG4gICAgVUlTaW5nbGUsICAgICAgICAgICAvLyDljZXnlYzpnaLmmL7npLrvvIzlj6rmmL7npLrlvZPliY3nlYzpnaLlkozog4zmma/nlYzpnaLvvIzmgKfog73ovoPlpb1cclxufTtcclxuXHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBjbGFzcyBVSVZpZXcgZXh0ZW5kcyBSZXNLZWVwZXIge1xyXG5cclxuICAgIC8qKiDlv6vpgJ/lhbPpl60gKi9cclxuICAgIEBwcm9wZXJ0eVxyXG4gICAgcXVpY2tDbG9zZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoqIOWxj+iUveeCueWHu+mAiemhuSDlnKhVSUNvbmborr7nva7lsY/olL3ngrnlh7sqL1xyXG4gICAgLy8gQHByb3BlcnR5XHJcbiAgICAvLyBwcmV2ZW50VG91Y2g6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgLyoqIOe8k+WtmOmAiemhuSAqL1xyXG4gICAgQHByb3BlcnR5XHJcbiAgICBjYWNoZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoqIOeVjOmdouaYvuekuuexu+WeiyAqL1xyXG4gICAgQHByb3BlcnR5KHsgdHlwZTogY2MuRW51bShVSVNob3dUeXBlcykgfSlcclxuICAgIHNob3dUeXBlOiBVSVNob3dUeXBlcyA9IFVJU2hvd1R5cGVzLlVJU2luZ2xlO1xyXG5cclxuICAgIC8qKiDnlYzpnaJpZCAqL1xyXG4gICAgcHVibGljIFVJaWQ6IG51bWJlciA9IDA7XHJcbiAgICAvKiogIOmdmeaAgeWPmOmHj++8jOeUqOS6juWMuuWIhuebuOWQjOeVjOmdoueahOS4jeWQjOWunuS+iyAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdWlJbmRleDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKiBVSeeahOWbnuiwgyAqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIC8qKlxyXG4gICAgICog5b2T55WM6Z2i6KKr5Yib5bu65pe25Zue6LCD77yM55Sf5ZG95ZGo5pyf5YaF5Y+q6LCD55SoXHJcbiAgICAgKiBAcGFyYW0gYXJncyDlj6/lj5jlj4LmlbBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXQoLi4uYXJncyk6IHZvaWQge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+eVjOmdouiiq+aJk+W8gOaXtuWbnuiwg++8jOavj+asoeiwg+eUqE9wZW7ml7blm57osINcclxuICAgICAqIEBwYXJhbSBmcm9tVUkg5LuO5ZOq5LiqVUnmiZPlvIDnmoRcclxuICAgICAqIEBwYXJhbSBhcmdzIOWPr+WPmOWPguaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25PcGVuKGZyb21VSTogbnVtYmVyLCAuLi5hcmdzKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q+P5qyh55WM6Z2iT3BlbuWKqOeUu+aSreaUvuWujOavleaXtuWbnuiwg1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25PcGVuQW5pT3ZlcigpOiB2b2lkIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+eVjOmdouiiq+WFs+mXreaXtuWbnuiwg++8jOavj+asoeiwg+eUqENsb3Nl5pe25Zue6LCDXHJcbiAgICAgKiDov5Tlm57lgLzkvJrkvKDpgJLnu5nkuIvkuIDkuKrnlYzpnaJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uQ2xvc2UoKTogYW55IHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPnlYzpnaLooqvnva7pobbml7blm57osIPvvIxPcGVu5pe25bm25LiN5Lya5Zue6LCD6K+l5Ye95pWwXHJcbiAgICAgKiBAcGFyYW0gcHJlSUQg5YmN5LiA5LiqdWlcclxuICAgICAqIEBwYXJhbSBhcmdzIOWPr+WPmOWPguaVsO+8jFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25Ub3AocHJlSUQ6IG51bWJlciwgLi4uYXJncyk6IHZvaWQge1xyXG5cclxuICAgIH1cclxufVxyXG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/res/NodePool.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '79670Jcz25EHbpPz2sbGO5H', 'NodePool');
// Script/res/NodePool.ts

// import { resLoader } from "./ResLoader";
// /**
//  * Prefab的实例对象管理，目标为减少instantiate的次数，复用Node
//  * 
//  * 2020-1-19 by 宝爷
//  */
// export type NodePoolCallback = (error: Error, nodePool: NodePool) => void;
// export class NodePool {
//     private _isReady: boolean = false;
//     private _createCount: number = 0;
//     private _warterMark: number = 10;
//     private _useKey: string = "@NodePool";
//     private _res: cc.Prefab = null;
//     private _nodes: Array<cc.Node> = new Array<cc.Node>();
//     public isReady() { return this._isReady; }
//     /**
//      * 初始化NodePool，可以传入使用resloader加载的prefab，或者传入url异步加载
//      * 如果使用url来初始化，需要检查isReady，否则获取node会返回null
//      * @param prefab 
//      * @param url
//      */
//     public init(prefab: cc.Prefab)
//     public init(url: string, finishCallback: NodePoolCallback)
//     public init() {
//         let urlOrPrefab = arguments[0];
//         var finishCallback = null;
//         if (arguments.length == 2 && typeof arguments[1] == "function") {
//             finishCallback = arguments[1];
//         }
//         if (urlOrPrefab instanceof cc.Prefab) {
//             this._res = urlOrPrefab;
//             let url = resLoader.getResKeyByAsset(this._res);
//             if (url) {
//                 if (resLoader.addUse(url, this._useKey)) {
//                     this._isReady = true;
//                     if (finishCallback) {
//                         finishCallback(null, this);
//                     }
//                     return;
//                 }
//             }
//         } else if (typeof arguments[0] == "string") {
//             resLoader.loadRes(arguments[0], cc.Prefab, (error: Error, prefab: cc.Prefab) => {
//                 if (!error) {
//                     this._res = prefab;
//                     this._isReady = true;
//                 }
//                 if (finishCallback) {
//                     finishCallback(error, this);
//                 }
//             }, this._useKey);
//             return;
//         }
//         console.error(`NodePool init error ${arguments[0]}`);
//     }
//     /**
//      * 获取或创建一个Prefab实例Node
//      */
//     public getNode(): cc.Node {
//         if (!this.isReady) {
//             return null;
//         }
//         if (this._nodes.length > 0) {
//             return this._nodes.pop();
//         } else {
//             this._createCount++;
//             return cc.instantiate(this._res);
//         }
//     }
//     /**
//      * 回收Node实例
//      * @param node 要回收的Prefab实例
//      */
//     public freeNode(node: cc.Node) {
//         if (!(node && cc.isValid(node))) {
//             cc.error('[ERROR] PrefabPool: freePrefab: isValid node');
//             this._createCount--;
//             return;
//         }
//         if (this._warterMark < this._nodes.length) {
//             this._createCount--;
//             node.destroy();
//         } else {
//             node.removeFromParent(true);
//             node.cleanup();
//             this._nodes.push(node);
//         }
//     }
//     /**
//      * 设置回收水位
//      * @param waterMakr 水位
//      */
//     public setWaterMark(waterMakr: number) {
//         this._warterMark = waterMakr;
//     }
//     /**
//      * 池子里的prefab是否都没有使用
//      */
//     public isUnuse() {
//         if (this._nodes.length > this._createCount) {
//             cc.error('PrefabPool: _nodes.length > _createCount');
//         }
//         return this._nodes.length == this._createCount;
//     }
//     /**
//      * 清空prefab
//      */
//     public destory() {
//         // 清空节点、回收资源
//         for (let node of this._nodes) {
//             node.destroy();
//         }
//         this._createCount -= this._nodes.length;
//         this._nodes.length = 0;
//         resLoader.releaseAsset(this._res, this._useKey);
//     }
// }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvcmVzL05vZGVQb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUEyQztBQUUzQyxNQUFNO0FBQ04sOENBQThDO0FBQzlDLE1BQU07QUFDTixxQkFBcUI7QUFDckIsTUFBTTtBQUVOLDZFQUE2RTtBQUU3RSwwQkFBMEI7QUFDMUIseUNBQXlDO0FBQ3pDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsNkNBQTZDO0FBQzdDLHNDQUFzQztBQUN0Qyw2REFBNkQ7QUFFN0QsaURBQWlEO0FBRWpELFVBQVU7QUFDViwwREFBMEQ7QUFDMUQsaURBQWlEO0FBQ2pELHdCQUF3QjtBQUN4QixvQkFBb0I7QUFDcEIsVUFBVTtBQUNWLHFDQUFxQztBQUNyQyxpRUFBaUU7QUFDakUsc0JBQXNCO0FBQ3RCLDBDQUEwQztBQUMxQyxxQ0FBcUM7QUFDckMsNEVBQTRFO0FBQzVFLDZDQUE2QztBQUM3QyxZQUFZO0FBRVosa0RBQWtEO0FBQ2xELHVDQUF1QztBQUN2QywrREFBK0Q7QUFDL0QseUJBQXlCO0FBQ3pCLDZEQUE2RDtBQUM3RCw0Q0FBNEM7QUFDNUMsNENBQTRDO0FBQzVDLHNEQUFzRDtBQUN0RCx3QkFBd0I7QUFDeEIsOEJBQThCO0FBQzlCLG9CQUFvQjtBQUNwQixnQkFBZ0I7QUFDaEIsd0RBQXdEO0FBQ3hELGdHQUFnRztBQUNoRyxnQ0FBZ0M7QUFDaEMsMENBQTBDO0FBQzFDLDRDQUE0QztBQUM1QyxvQkFBb0I7QUFDcEIsd0NBQXdDO0FBQ3hDLG1EQUFtRDtBQUNuRCxvQkFBb0I7QUFDcEIsZ0NBQWdDO0FBQ2hDLHNCQUFzQjtBQUN0QixZQUFZO0FBQ1osZ0VBQWdFO0FBQ2hFLFFBQVE7QUFFUixVQUFVO0FBQ1YsNkJBQTZCO0FBQzdCLFVBQVU7QUFDVixrQ0FBa0M7QUFDbEMsK0JBQStCO0FBQy9CLDJCQUEyQjtBQUMzQixZQUFZO0FBRVosd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4QyxtQkFBbUI7QUFDbkIsbUNBQW1DO0FBQ25DLGdEQUFnRDtBQUNoRCxZQUFZO0FBQ1osUUFBUTtBQUVSLFVBQVU7QUFDVixrQkFBa0I7QUFDbEIsa0NBQWtDO0FBQ2xDLFVBQVU7QUFDVix1Q0FBdUM7QUFDdkMsNkNBQTZDO0FBQzdDLHdFQUF3RTtBQUN4RSxtQ0FBbUM7QUFDbkMsc0JBQXNCO0FBQ3RCLFlBQVk7QUFDWix1REFBdUQ7QUFDdkQsbUNBQW1DO0FBQ25DLDhCQUE4QjtBQUM5QixtQkFBbUI7QUFDbkIsMkNBQTJDO0FBQzNDLDhCQUE4QjtBQUM5QixzQ0FBc0M7QUFDdEMsWUFBWTtBQUNaLFFBQVE7QUFFUixVQUFVO0FBQ1YsZ0JBQWdCO0FBQ2hCLDZCQUE2QjtBQUM3QixVQUFVO0FBQ1YsK0NBQStDO0FBQy9DLHdDQUF3QztBQUN4QyxRQUFRO0FBRVIsVUFBVTtBQUNWLDJCQUEyQjtBQUMzQixVQUFVO0FBQ1YseUJBQXlCO0FBQ3pCLHdEQUF3RDtBQUN4RCxvRUFBb0U7QUFDcEUsWUFBWTtBQUNaLDBEQUEwRDtBQUMxRCxRQUFRO0FBRVIsVUFBVTtBQUNWLGtCQUFrQjtBQUNsQixVQUFVO0FBQ1YseUJBQXlCO0FBQ3pCLHVCQUF1QjtBQUN2QiwwQ0FBMEM7QUFDMUMsOEJBQThCO0FBQzlCLFlBQVk7QUFDWixtREFBbUQ7QUFDbkQsa0NBQWtDO0FBQ2xDLDJEQUEyRDtBQUMzRCxRQUFRO0FBQ1IsSUFBSSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IHJlc0xvYWRlciB9IGZyb20gXCIuL1Jlc0xvYWRlclwiO1xyXG5cclxuLy8gLyoqXHJcbi8vICAqIFByZWZhYueahOWunuS+i+WvueixoeeuoeeQhu+8jOebruagh+S4uuWHj+WwkWluc3RhbnRpYXRl55qE5qyh5pWw77yM5aSN55SoTm9kZVxyXG4vLyAgKiBcclxuLy8gICogMjAyMC0xLTE5IGJ5IOWuneeIt1xyXG4vLyAgKi9cclxuXHJcbi8vIGV4cG9ydCB0eXBlIE5vZGVQb29sQ2FsbGJhY2sgPSAoZXJyb3I6IEVycm9yLCBub2RlUG9vbDogTm9kZVBvb2wpID0+IHZvaWQ7XHJcbiBcclxuLy8gZXhwb3J0IGNsYXNzIE5vZGVQb29sIHtcclxuLy8gICAgIHByaXZhdGUgX2lzUmVhZHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuLy8gICAgIHByaXZhdGUgX2NyZWF0ZUNvdW50OiBudW1iZXIgPSAwO1xyXG4vLyAgICAgcHJpdmF0ZSBfd2FydGVyTWFyazogbnVtYmVyID0gMTA7XHJcbi8vICAgICBwcml2YXRlIF91c2VLZXk6IHN0cmluZyA9IFwiQE5vZGVQb29sXCI7XHJcbi8vICAgICBwcml2YXRlIF9yZXM6IGNjLlByZWZhYiA9IG51bGw7XHJcbi8vICAgICBwcml2YXRlIF9ub2RlczogQXJyYXk8Y2MuTm9kZT4gPSBuZXcgQXJyYXk8Y2MuTm9kZT4oKTtcclxuXHJcbi8vICAgICBwdWJsaWMgaXNSZWFkeSgpIHsgcmV0dXJuIHRoaXMuX2lzUmVhZHk7IH1cclxuXHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOWIneWni+WMlk5vZGVQb29s77yM5Y+v5Lul5Lyg5YWl5L2/55SocmVzbG9hZGVy5Yqg6L2955qEcHJlZmFi77yM5oiW6ICF5Lyg5YWldXJs5byC5q2l5Yqg6L29XHJcbi8vICAgICAgKiDlpoLmnpzkvb/nlKh1cmzmnaXliJ3lp4vljJbvvIzpnIDopoHmo4Dmn6Vpc1JlYWR577yM5ZCm5YiZ6I635Y+Wbm9kZeS8mui/lOWbnm51bGxcclxuLy8gICAgICAqIEBwYXJhbSBwcmVmYWIgXHJcbi8vICAgICAgKiBAcGFyYW0gdXJsXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBpbml0KHByZWZhYjogY2MuUHJlZmFiKVxyXG4vLyAgICAgcHVibGljIGluaXQodXJsOiBzdHJpbmcsIGZpbmlzaENhbGxiYWNrOiBOb2RlUG9vbENhbGxiYWNrKVxyXG4vLyAgICAgcHVibGljIGluaXQoKSB7XHJcbi8vICAgICAgICAgbGV0IHVybE9yUHJlZmFiID0gYXJndW1lbnRzWzBdO1xyXG4vLyAgICAgICAgIHZhciBmaW5pc2hDYWxsYmFjayA9IG51bGw7XHJcbi8vICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMiAmJiB0eXBlb2YgYXJndW1lbnRzWzFdID09IFwiZnVuY3Rpb25cIikge1xyXG4vLyAgICAgICAgICAgICBmaW5pc2hDYWxsYmFjayA9IGFyZ3VtZW50c1sxXTtcclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgIGlmICh1cmxPclByZWZhYiBpbnN0YW5jZW9mIGNjLlByZWZhYikge1xyXG4vLyAgICAgICAgICAgICB0aGlzLl9yZXMgPSB1cmxPclByZWZhYjtcclxuLy8gICAgICAgICAgICAgbGV0IHVybCA9IHJlc0xvYWRlci5nZXRSZXNLZXlCeUFzc2V0KHRoaXMuX3Jlcyk7XHJcbi8vICAgICAgICAgICAgIGlmICh1cmwpIHtcclxuLy8gICAgICAgICAgICAgICAgIGlmIChyZXNMb2FkZXIuYWRkVXNlKHVybCwgdGhpcy5fdXNlS2V5KSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzUmVhZHkgPSB0cnVlO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGlmIChmaW5pc2hDYWxsYmFjaykge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2hDYWxsYmFjayhudWxsLCB0aGlzKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4vLyAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09IFwic3RyaW5nXCIpIHtcclxuLy8gICAgICAgICAgICAgcmVzTG9hZGVyLmxvYWRSZXMoYXJndW1lbnRzWzBdLCBjYy5QcmVmYWIsIChlcnJvcjogRXJyb3IsIHByZWZhYjogY2MuUHJlZmFiKSA9PiB7XHJcbi8vICAgICAgICAgICAgICAgICBpZiAoIWVycm9yKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzID0gcHJlZmFiO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzUmVhZHkgPSB0cnVlO1xyXG4vLyAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgaWYgKGZpbmlzaENhbGxiYWNrKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgZmluaXNoQ2FsbGJhY2soZXJyb3IsIHRoaXMpO1xyXG4vLyAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICB9LCB0aGlzLl91c2VLZXkpO1xyXG4vLyAgICAgICAgICAgICByZXR1cm47XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGNvbnNvbGUuZXJyb3IoYE5vZGVQb29sIGluaXQgZXJyb3IgJHthcmd1bWVudHNbMF19YCk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDojrflj5bmiJbliJvlu7rkuIDkuKpQcmVmYWLlrp7kvotOb2RlXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBnZXROb2RlKCk6IGNjLk5vZGUge1xyXG4vLyAgICAgICAgIGlmICghdGhpcy5pc1JlYWR5KSB7XHJcbi8vICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgaWYgKHRoaXMuX25vZGVzLmxlbmd0aCA+IDApIHtcclxuLy8gICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vZGVzLnBvcCgpO1xyXG4vLyAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUNvdW50Kys7XHJcbi8vICAgICAgICAgICAgIHJldHVybiBjYy5pbnN0YW50aWF0ZSh0aGlzLl9yZXMpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOWbnuaUtk5vZGXlrp7kvotcclxuLy8gICAgICAqIEBwYXJhbSBub2RlIOimgeWbnuaUtueahFByZWZhYuWunuS+i1xyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgZnJlZU5vZGUobm9kZTogY2MuTm9kZSkge1xyXG4vLyAgICAgICAgIGlmICghKG5vZGUgJiYgY2MuaXNWYWxpZChub2RlKSkpIHtcclxuLy8gICAgICAgICAgICAgY2MuZXJyb3IoJ1tFUlJPUl0gUHJlZmFiUG9vbDogZnJlZVByZWZhYjogaXNWYWxpZCBub2RlJyk7XHJcbi8vICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUNvdW50LS07XHJcbi8vICAgICAgICAgICAgIHJldHVybjtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgaWYgKHRoaXMuX3dhcnRlck1hcmsgPCB0aGlzLl9ub2Rlcy5sZW5ndGgpIHtcclxuLy8gICAgICAgICAgICAgdGhpcy5fY3JlYXRlQ291bnQtLTtcclxuLy8gICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XHJcbi8vICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgbm9kZS5yZW1vdmVGcm9tUGFyZW50KHRydWUpO1xyXG4vLyAgICAgICAgICAgICBub2RlLmNsZWFudXAoKTtcclxuLy8gICAgICAgICAgICAgdGhpcy5fbm9kZXMucHVzaChub2RlKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDorr7nva7lm57mlLbmsLTkvY1cclxuLy8gICAgICAqIEBwYXJhbSB3YXRlck1ha3Ig5rC05L2NXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBzZXRXYXRlck1hcmsod2F0ZXJNYWtyOiBudW1iZXIpIHtcclxuLy8gICAgICAgICB0aGlzLl93YXJ0ZXJNYXJrID0gd2F0ZXJNYWtyO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog5rGg5a2Q6YeM55qEcHJlZmFi5piv5ZCm6YO95rKh5pyJ5L2/55SoXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBpc1VudXNlKCkge1xyXG4vLyAgICAgICAgIGlmICh0aGlzLl9ub2Rlcy5sZW5ndGggPiB0aGlzLl9jcmVhdGVDb3VudCkge1xyXG4vLyAgICAgICAgICAgICBjYy5lcnJvcignUHJlZmFiUG9vbDogX25vZGVzLmxlbmd0aCA+IF9jcmVhdGVDb3VudCcpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICByZXR1cm4gdGhpcy5fbm9kZXMubGVuZ3RoID09IHRoaXMuX2NyZWF0ZUNvdW50O1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog5riF56m6cHJlZmFiXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBkZXN0b3J5KCkge1xyXG4vLyAgICAgICAgIC8vIOa4heepuuiKgueCueOAgeWbnuaUtui1hOa6kFxyXG4vLyAgICAgICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5fbm9kZXMpIHtcclxuLy8gICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIHRoaXMuX2NyZWF0ZUNvdW50IC09IHRoaXMuX25vZGVzLmxlbmd0aDtcclxuLy8gICAgICAgICB0aGlzLl9ub2Rlcy5sZW5ndGggPSAwO1xyXG4vLyAgICAgICAgIHJlc0xvYWRlci5yZWxlYXNlQXNzZXQodGhpcy5fcmVzLCB0aGlzLl91c2VLZXkpO1xyXG4vLyAgICAgfVxyXG4vLyB9Il19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/uiviews/UINotice.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'db881TdTLhM0Z/O2XQ/E9mc', 'UINotice');
// Script/example/uiviews/UINotice.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var UIView_1 = require("../../ui/UIView");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UINotice = /** @class */ (function (_super) {
    __extends(UINotice, _super);
    function UINotice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UINotice.prototype.init = function () {
    };
    UINotice = __decorate([
        ccclass
    ], UINotice);
    return UINotice;
}(UIView_1.UIView));
exports.default = UINotice;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS91aXZpZXdzL1VJTm90aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUF5QztBQUVuQyxJQUFBLGtCQUFtQyxFQUFsQyxvQkFBTyxFQUFFLHNCQUF5QixDQUFDO0FBRzFDO0lBQXNDLDRCQUFNO0lBQTVDOztJQUtBLENBQUM7SUFIVSx1QkFBSSxHQUFYO0lBRUEsQ0FBQztJQUpnQixRQUFRO1FBRDVCLE9BQU87T0FDYSxRQUFRLENBSzVCO0lBQUQsZUFBQztDQUxELEFBS0MsQ0FMcUMsZUFBTSxHQUszQztrQkFMb0IsUUFBUSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVJVmlldyB9IGZyb20gXCIuLi8uLi91aS9VSVZpZXdcIjtcblxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XG5cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVSU5vdGljZSBleHRlbmRzIFVJVmlldyB7XG4gICAgXG4gICAgcHVibGljIGluaXQoKSB7XG5cbiAgICB9XG59XG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/common/EventManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'e1b5ewyNbRHAaWWNlvuupwY', 'EventManager');
// Script/common/EventManager.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventManager = /** @class */ (function () {
    function EventManager() {
        this._eventListeners = {};
    }
    EventManager.getInstance = function () {
        if (!this.instance) {
            this.instance = new EventManager();
        }
        return this.instance;
    };
    EventManager.destroy = function () {
        if (this.instance) {
            this.instance = null;
        }
    };
    EventManager.prototype.getEventListenersIndex = function (eventName, callBack, target) {
        var index = -1;
        for (var i = 0; i < this._eventListeners[eventName].length; i++) {
            var iterator = this._eventListeners[eventName][i];
            if (iterator.callBack == callBack && (!target || iterator.target == target)) {
                index = i;
                break;
            }
        }
        return index;
    };
    EventManager.prototype.addEventListener = function (eventName, callBack, target) {
        if (!eventName) {
            cc.warn("eventName is empty" + eventName);
            return;
        }
        if (null == callBack) {
            cc.log('addEventListener callBack is nil');
            return false;
        }
        var callTarget = { callBack: callBack, target: target };
        if (null == this._eventListeners[eventName]) {
            this._eventListeners[eventName] = [callTarget];
        }
        else {
            var index = this.getEventListenersIndex(eventName, callBack, target);
            if (-1 == index) {
                this._eventListeners[eventName].push(callTarget);
            }
        }
        return true;
    };
    EventManager.prototype.setEventListener = function (eventName, callBack, target) {
        if (!eventName) {
            cc.warn("eventName is empty" + eventName);
            return;
        }
        if (null == callBack) {
            cc.log('setEventListener callBack is nil');
            return false;
        }
        var callTarget = { callBack: callBack, target: target };
        this._eventListeners[eventName] = [callTarget];
        return true;
    };
    EventManager.prototype.removeEventListener = function (eventName, callBack, target) {
        if (null != this._eventListeners[eventName]) {
            var index = this.getEventListenersIndex(eventName, callBack, target);
            if (-1 != index) {
                this._eventListeners[eventName].splice(index, 1);
            }
        }
    };
    EventManager.prototype.raiseEvent = function (eventName, eventData) {
        console.log("==================== raiseEvent " + eventName + " begin | " + JSON.stringify(eventData));
        if (null != this._eventListeners[eventName]) {
            // 将所有回调提取出来，再调用，避免调用回调的时候操作了事件的删除
            var callbackList = [];
            for (var _i = 0, _a = this._eventListeners[eventName]; _i < _a.length; _i++) {
                var iterator = _a[_i];
                callbackList.push({ callBack: iterator.callBack, target: iterator.target });
            }
            for (var _b = 0, callbackList_1 = callbackList; _b < callbackList_1.length; _b++) {
                var iterator = callbackList_1[_b];
                iterator.callBack.call(iterator.target, eventName, eventData);
            }
        }
        console.log("==================== raiseEvent " + eventName + " end");
    };
    EventManager.instance = null;
    return EventManager;
}());
exports.EventManager = EventManager;
exports.EventMgr = EventManager.getInstance();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvY29tbW9uL0V2ZW50TWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQVlBO0lBZUk7UUFHUSxvQkFBZSxHQUF3QyxFQUFFLENBQUM7SUFGbEUsQ0FBQztJQWRhLHdCQUFXLEdBQXpCO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1NBQ3RDO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFYSxvQkFBTyxHQUFyQjtRQUNJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO0lBQ0wsQ0FBQztJQU9PLDZDQUFzQixHQUE5QixVQUErQixTQUFpQixFQUFFLFFBQThCLEVBQUUsTUFBWTtRQUMxRixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNmLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3RCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQUksUUFBUSxDQUFDLFFBQVEsSUFBSSxRQUFRLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxFQUFFO2dCQUN6RSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLE1BQU07YUFDVDtTQUNKO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELHVDQUFnQixHQUFoQixVQUFpQixTQUFpQixFQUFFLFFBQThCLEVBQUUsTUFBWTtRQUM1RSxJQUFJLENBQUMs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WSxFQUFaLElBQVksRUFBRTtnQkFBaEMsSUFBTSxRQUFRLHFCQUFBO2dCQUNmLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ2pFO1NBQ0o7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFtQyxTQUFTLFNBQU0sQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUE1RmMscUJBQVEsR0FBaUIsSUFBSSxDQUFDO0lBNkZqRCxtQkFBQztDQTlGRCxBQThGQyxJQUFBO0FBOUZZLG9DQUFZO0FBZ0dkLFFBQUEsUUFBUSxHQUFHLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4qICAg5LqL5Lu2566h55CG5Zmo77yM5LqL5Lu255qE55uR5ZCs44CB6Kem5Y+R44CB56e76ZmkXG4qICAgXG4qICAgMjAxOC05LTIwIGJ5IOWuneeIt1xuKi9cbmV4cG9ydCB0eXBlIEV2ZW50TWFuYWdlckNhbGxGdW5jID0gKGV2ZW50TmFtZTogc3RyaW5nLCBldmVudERhdGE6IGFueSkgPT4gdm9pZDtcblxuaW50ZXJmYWNlIENhbGxCYWNrVGFyZ2V0IHtcbiAgICBjYWxsQmFjazogRXZlbnRNYW5hZ2VyQ2FsbEZ1bmMsXG4gICAgdGFyZ2V0OiBhbnksXG59XG5cbmV4cG9ydCBjbGFzcyBFdmVudE1hbmFnZXIge1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBFdmVudE1hbmFnZXIgPSBudWxsO1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogRXZlbnRNYW5hZ2VyIHtcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlID0gbmV3IEV2ZW50TWFuYWdlcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9ldmVudExpc3RlbmVyczogeyBba2V5OiBzdHJpbmddOiBDYWxsQmFja1RhcmdldFtdIH0gPSB7fTtcblxuICAgIHByaXZhdGUgZ2V0RXZlbnRMaXN0ZW5lcnNJbmRleChldmVudE5hbWU6IHN0cmluZywgY2FsbEJhY2s6IEV2ZW50TWFuYWdlckNhbGxGdW5jLCB0YXJnZXQ/OiBhbnkpOiBudW1iZXIge1xuICAgICAgICBsZXQgaW5kZXggPSAtMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9ldmVudExpc3RlbmVyc1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgaXRlcmF0b3IgPSB0aGlzLl9ldmVudExpc3RlbmVyc1tldmVudE5hbWVdW2ldO1xuICAgICAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGxCYWNrID09IGNhbGxCYWNrICYmICghdGFyZ2V0IHx8IGl0ZXJhdG9yLnRhcmdldCA9PSB0YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG5cbiAgICBhZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsQmFjazogRXZlbnRNYW5hZ2VyQ2FsbEZ1bmMsIHRhcmdldD86IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIWV2ZW50TmFtZSkge1xuICAgICAgICAgICAgY2Mud2FybihcImV2ZW50TmFtZSBpcyBlbXB0eVwiICsgZXZlbnROYW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChudWxsID09IGNhbGxCYWNrKSB7XG4gICAgICAgICAgICBjYy5sb2coJ2FkZEV2ZW50TGlzdGVuZXIgY2FsbEJhY2sgaXMgbmlsJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNhbGxUYXJnZXQ6IENhbGxCYWNrVGFyZ2V0ID0geyBjYWxsQmFjazogY2FsbEJhY2ssIHRhcmdldDogdGFyZ2V0IH07XG4gICAgICAgIGlmIChudWxsID09IHRoaXMuX2V2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbY2FsbFRhcmdldF07XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuZ2V0RXZlbnRMaXN0ZW5lcnNJbmRleChldmVudE5hbWUsIGNhbGxCYWNrLCB0YXJnZXQpO1xuICAgICAgICAgICAgaWYgKC0xID09IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnNbZXZlbnROYW1lXS5wdXNoKGNhbGxUYXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc2V0RXZlbnRMaXN0ZW5lcihldmVudE5hbWU6IHN0cmluZywgY2FsbEJhY2s6IEV2ZW50TWFuYWdlckNhbGxGdW5jLCB0YXJnZXQ/OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFldmVudE5hbWUpIHtcbiAgICAgICAgICAgIGNjLndhcm4oXCJldmVudE5hbWUgaXMgZW1wdHlcIiArIGV2ZW50TmFtZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobnVsbCA9PSBjYWxsQmFjaykge1xuICAgICAgICAgICAgY2MubG9nKCdzZXRFdmVudExpc3RlbmVyIGNhbGxCYWNrIGlzIG5pbCcpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjYWxsVGFyZ2V0OiBDYWxsQmFja1RhcmdldCA9IHsgY2FsbEJhY2s6IGNhbGxCYWNrLCB0YXJnZXQ6IHRhcmdldCB9O1xuICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVyc1tldmVudE5hbWVdID0gW2NhbGxUYXJnZXRdO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsQmFjazogRXZlbnRNYW5hZ2VyQ2FsbEZ1bmMsIHRhcmdldD86IGFueSkge1xuICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9ldmVudExpc3RlbmVyc1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmdldEV2ZW50TGlzdGVuZXJzSW5kZXgoZXZlbnROYW1lLCBjYWxsQmFjaywgdGFyZ2V0KTtcbiAgICAgICAgICAgIGlmICgtMSAhPSBpbmRleCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJhaXNlRXZlbnQoZXZlbnROYW1lOiBzdHJpbmcsIGV2ZW50RGF0YT86IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZyhgPT09PT09PT09PT09PT09PT09PT0gcmFpc2VFdmVudCAke2V2ZW50TmFtZX0gYmVnaW4gfCAke0pTT04uc3RyaW5naWZ5KGV2ZW50RGF0YSl9YCk7XG4gICAgICAgIGlmIChudWxsICE9IHRoaXMuX2V2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIC8vIOWwhuaJgOacieWbnuiwg+aPkOWPluWHuuadpe+8jOWGjeiwg+eUqO+8jOmBv+WFjeiwg+eUqOWbnuiwg+eahOaXtuWAmeaTjeS9nOS6huS6i+S7tueahOWIoOmZpFxuICAgICAgICAgICAgbGV0IGNhbGxiYWNrTGlzdDogQ2FsbEJhY2tUYXJnZXRbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVyYXRvciBvZiB0aGlzLl9ldmVudExpc3RlbmVyc1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tMaXN0LnB1c2goeyBjYWxsQmFjazogaXRlcmF0b3IuY2FsbEJhY2ssIHRhcmdldDogaXRlcmF0b3IudGFyZ2V0IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVyYXRvciBvZiBjYWxsYmFja0xpc3QpIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRvci5jYWxsQmFjay5jYWxsKGl0ZXJhdG9yLnRhcmdldCwgZXZlbnROYW1lLCBldmVudERhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGA9PT09PT09PT09PT09PT09PT09PSByYWlzZUV2ZW50ICR7ZXZlbnROYW1lfSBlbmRgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBsZXQgRXZlbnRNZ3IgPSBFdmVudE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTsiXX0=
//------QC-SOURCE-SPLIT------
