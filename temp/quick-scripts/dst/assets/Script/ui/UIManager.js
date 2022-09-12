
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvdWkvVUlNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQStDO0FBQy9DLDhDQUE4RDtBQWdDOUQ7SUFBQTtRQUNJLDZCQUE2QjtRQUNyQixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLGtDQUFrQztRQUMxQixpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUN6QixlQUFlO1FBQ1AsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUMxQixlQUFlO1FBQ1AsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUUxQixxQ0FBcUM7UUFDN0IsWUFBTyxHQUErQixFQUFFLENBQUM7UUFDakQsdUNBQXVDO1FBQy9CLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDL0IsY0FBYztRQUNOLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBQ25DLGNBQWM7UUFDTixpQkFBWSxHQUFhLEVBQUUsQ0FBQztRQUNwQyxXQUFXO1FBQ0gsV0FBTSxHQUE4QixFQUFFLENBQUM7UUFFL0MsY0FBYztRQUNQLHlCQUFvQixHQUE0QyxJQUFJLENBQUM7UUFDNUUsYUFBYTtRQUNOLG1CQUFjLEdBQTRDLElBQUksQ0FBQztRQUN0RSxhQUFhO1FBQ04sb0JBQWUsR0FBMkIsSUFBSSxDQUFDO0lBeWQxRCxDQUFDO0lBdmRHOzs7T0FHRztJQUNJLDhCQUFVLEdBQWpCLFVBQWtCLElBQStCO1FBQzdDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksNkJBQVMsR0FBaEIsVUFBaUIsSUFBWSxFQUFFLElBQVk7UUFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVELGlFQUFpRTtJQUVqRTs7O09BR0c7SUFDSyxnQ0FBWSxHQUFwQixVQUFxQixNQUFjO1FBQy9CLElBQUksSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksRUFB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T0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7U0FDdkQ7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sOEJBQVUsR0FBakIsVUFBa0IsSUFBWTtRQUMxQixLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDdEQsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO2dCQUN0QixPQUFPLEtBQUssQ0FBQzthQUNoQjtTQUNKO1FBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNkLENBQUM7SUFDTCxnQkFBQztBQUFELENBbmZBLEFBbWZDLElBQUE7QUFuZlksOEJBQVM7QUFxZlgsUUFBQSxTQUFTLEdBQWMsSUFBSSxTQUFTLEVBQUUsQ0FBQyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVJVmlldywgVUlTaG93VHlwZXMgfSBmcm9tIFwiLi9VSVZpZXdcIjtcclxuaW1wb3J0IHsgcmVzTG9hZGVyLCBQcm9jZXNzQ2FsbGJhY2sgfSBmcm9tIFwiLi4vcmVzL1Jlc0xvYWRlclwiO1xyXG5cclxuLyoqXHJcbiAqIFVJTWFuYWdlcueVjOmdoueuoeeQhuexu1xyXG4gKiBcclxuICogMS7miZPlvIDnlYzpnaLvvIzmoLnmja7phY3nva7oh6rliqjliqDovb3nlYzpnaLjgIHosIPnlKjliJ3lp4vljJbjgIHmkq3mlL7miZPlvIDliqjnlLvjgIHpmpDol4/lhbbku5bnlYzpnaLjgIHlsY/olL3kuIvmlrnnlYzpnaLngrnlh7tcclxuICogMi7lhbPpl63nlYzpnaLvvIzmoLnmja7phY3nva7oh6rliqjlhbPpl63nlYzpnaLjgIHmkq3mlL7lhbPpl63liqjnlLvjgIHmgaLlpI3lhbbku5bnlYzpnaJcclxuICogMy7liIfmjaLnlYzpnaLvvIzkuI7miZPlvIDnlYzpnaLnsbvkvLzvvIzkvYbmmK/mmK/lsIblvZPliY3moIjpobbnmoTnlYzpnaLliIfmjaLmiJDmlrDnmoTnlYzpnaLvvIjlhYjlhbPpl63lho3miZPlvIDvvIlcclxuICogNC7mj5DkvpvnlYzpnaLnvJPlrZjlip/og71cclxuICogXHJcbiAqIDIwMTgtOC0yOCBieSDlrp3niLdcclxuICovXHJcblxyXG4vKiogVUnmoIjnu5PmnoTkvZMgKi9cclxuZXhwb3J0IGludGVyZmFjZSBVSUluZm8ge1xyXG4gICAgdWlJZDogbnVtYmVyO1xyXG4gICAgdWlWaWV3OiBVSVZpZXc7XHJcbiAgICB1aUFyZ3M6IGFueTtcclxuICAgIHByZXZlbnROb2RlPzogY2MuTm9kZTtcclxuICAgIHpPcmRlcj86IG51bWJlcjtcclxuICAgIG9wZW5UeXBlPzogJ3F1aWV0JyB8ICdvdGhlcic7XHJcbiAgICBpc0Nsb3NlPzogYm9vbGVhbjtcclxuICAgIHJlc1RvQ2xlYXI/OiBzdHJpbmdbXTtcclxuICAgIHJlc0NhY2hlPzogc3RyaW5nW107XHJcbn1cclxuXHJcbi8qKiBVSemFjee9rue7k+aehOS9kyAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFVJQ29uZiB7XHJcbiAgICBwcmVmYWI6IHN0cmluZztcclxuICAgIHByZXZlbnRUb3VjaD86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVSU1hbmFnZXIge1xyXG4gICAgLyoqIOi1hOa6kOWKoOi9veiuoeaVsOWZqO+8jOeUqOS6jueUn+aIkOWUr+S4gOeahOi1hOa6kOWNoOeUqGtleSAqL1xyXG4gICAgcHJpdmF0ZSB1c2VDb3VudCA9IDA7XHJcbiAgICAvKiog6IOM5pmvVUnvvIjmnInoi6XlubLlsYJVSeaYr+S9nOS4uuiDjOaZr1VJ77yM6ICM5LiN5Y+X5YiH5o2i562J5b2x5ZON77yJKi9cclxuICAgIHByaXZhdGUgQmFja0dyb3VuZFVJID0gMDtcclxuICAgIC8qKiDmmK/lkKbmraPlnKjlhbPpl61VSSAqL1xyXG4gICAgcHJpdmF0ZSBpc0Nsb3NpbmcgPSBmYWxzZTtcclxuICAgIC8qKiDmmK/lkKbmraPlnKjmiZPlvIBVSSAqL1xyXG4gICAgcHJpdmF0ZSBpc09wZW5pbmcgPSBmYWxzZTtcclxuXHJcbiAgICAvKiogVUnnlYzpnaLnvJPlrZjvvIhrZXnkuLpVSUlk77yMdmFsdWXkuLpVSVZpZXfoioLngrnvvIkqL1xyXG4gICAgcHJpdmF0ZSBVSUNhY2hlOiB7IFtVSUlkOiBudW1iZXJdOiBVSVZpZXcgfSA9IHt9O1xyXG4gICAgLyoqIFVJ55WM6Z2i5qCI77yIe1VJSUQgKyBVSVZpZXcgKyBVSUFyZ3N95pWw57uE77yJKi9cclxuICAgIHByaXZhdGUgVUlTdGFjazogVUlJbmZvW10gPSBbXTtcclxuICAgIC8qKiBVSeW+heaJk+W8gOWIl+ihqCAqL1xyXG4gICAgcHJpdmF0ZSBVSU9wZW5RdWV1ZTogVUlJbmZvW10gPSBbXTtcclxuICAgIC8qKiBVSeW+heWFs+mXreWIl+ihqCAqL1xyXG4gICAgcHJpdmF0ZSBVSUNsb3NlUXVldWU6IFVJVmlld1tdID0gW107XHJcbiAgICAvKiogVUnphY3nva4gKi9cclxuICAgIHByaXZhdGUgVUlDb25mOiB7IFtrZXk6IG51bWJlcl06IFVJQ29uZiB9ID0ge307XHJcblxyXG4gICAgLyoqIFVJ5omT5byA5YmN5Zue6LCDICovXHJcbiAgICBwdWJsaWMgdWlPcGVuQmVmb3JlRGVsZWdhdGU6ICh1aUlkOiBudW1iZXIsIHByZVVJSWQ6IG51bWJlcikgPT4gdm9pZCA9IG51bGw7XHJcbiAgICAvKiogVUnmiZPlvIDlm57osIMgKi9cclxuICAgIHB1YmxpYyB1aU9wZW5EZWxlZ2F0ZTogKHVpSWQ6IG51bWJlciwgcHJlVUlJZDogbnVtYmVyKSA9PiB2b2lkID0gbnVsbDtcclxuICAgIC8qKiBVSeWFs+mXreWbnuiwgyAqL1xyXG4gICAgcHVibGljIHVpQ2xvc2VEZWxlZ2F0ZTogKHVpSWQ6IG51bWJlcikgPT4gdm9pZCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbmiYDmnIlVSeeahOmFjee9ruWvueixoVxyXG4gICAgICogQHBhcmFtIGNvbmYg6YWN572u5a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbml0VUlDb25mKGNvbmY6IHsgW2tleTogbnVtYmVyXTogVUlDb25mIH0pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLlVJQ29uZiA9IGNvbmY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7miJbopobnm5bmn5B1aUlk55qE6YWN572uXHJcbiAgICAgKiBAcGFyYW0gdWlJZCDopoHorr7nva7nmoTnlYzpnaJpZFxyXG4gICAgICogQHBhcmFtIGNvbmYg6KaB6K6+572u55qE6YWN572uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRVSUNvbmYodWlJZDogbnVtYmVyLCBjb25mOiBVSUNvbmYpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLlVJQ29uZlt1aUlkXSA9IGNvbmY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqKiDnp4HmnInmlrnms5XvvIxVSU1hbmFnZXLlhoXpg6jnmoTlip/og73lkozln7rnoYDop4TliJkgKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOmYsuinpuaRuOWxglxyXG4gICAgICogQHBhcmFtIHpPcmRlciDlsY/olL3lsYLnmoTlsYLnuqdcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBwcmV2ZW50VG91Y2goek9yZGVyOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgbm9kZSA9IG5ldyBjYy5Ob2RlKClcclxuICAgICAgICBub2RlLm5hbWUgPSAncHJldmVudFRvdWNoJztcclxuICAgICAgICBub2RlLnNldENvbnRlbnRTaXplKGNjLndpblNpemUpO1xyXG4gICAgICAgIG5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIGZ1bmN0aW9uIChldmVudDogY2MuRXZlbnQuRXZlbnRDdXN0b20pIHtcclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfSwgbm9kZSk7XHJcbiAgICAgICAgbGV0IGNoaWxkID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZSgnQ2FudmFzJyk7XHJcbiAgICAgICAgY2hpbGQuYWRkQ2hpbGQobm9kZSwgek9yZGVyKTtcclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog6Ieq5Yqo5omn6KGM5LiL5LiA5Liq5b6F5YWz6Zet5oiW5b6F5omT5byA55qE55WM6Z2iICovXHJcbiAgICBwcml2YXRlIGF1dG9FeGVjTmV4dFVJKCkge1xyXG4gICAgICAgIC8vIOmAu+i+keS4iuaYr+WFiOWFs+WQjuW8gFxyXG4gICAgICAgIGlmICh0aGlzLlVJQ2xvc2VRdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCB1aVF1ZXVlSW5mbyA9IHRoaXMuVUlDbG9zZVF1ZXVlWzBdO1xyXG4gICAgICAgICAgICB0aGlzLlVJQ2xvc2VRdWV1ZS5zcGxpY2UoMCwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UodWlRdWV1ZUluZm8pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5VSU9wZW5RdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCB1aVF1ZXVlSW5mbyA9IHRoaXMuVUlPcGVuUXVldWVbMF07XHJcbiAgICAgICAgICAgIHRoaXMuVUlPcGVuUXVldWUuc3BsaWNlKDAsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLm9wZW4odWlRdWV1ZUluZm8udWlJZCwgdWlRdWV1ZUluZm8udWlBcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoh6rliqjmo4DmtYvliqjnlLvnu4Tku7bku6Xlj4rnibnlrprliqjnlLvvvIzlpoLlrZjlnKjliJnmkq3mlL7liqjnlLvvvIzml6DorrrliqjnlLvmmK/lkKbmkq3mlL7vvIzpg73miafooYzlm57osINcclxuICAgICAqIEBwYXJhbSBhbmlOYW1lIOWKqOeUu+WQjVxyXG4gICAgICogQHBhcmFtIGFuaU92ZXJDYWxsYmFjayDliqjnlLvmkq3mlL7lrozmiJDlm57osINcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhdXRvRXhlY0FuaW1hdGlvbih1aVZpZXc6IFVJVmlldywgYW5pTmFtZTogc3RyaW5nLCBhbmlPdmVyQ2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcclxuICAgICAgICAvLyDmmoLml7blhYjnnIHnlaXliqjnlLvmkq3mlL7nmoTpgLvovpFcclxuICAgICAgICBhbmlPdmVyQ2FsbGJhY2soKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiHquWKqOajgOa1i+i1hOa6kOmihOWKoOi9vee7hOS7tu+8jOWmguaenOWtmOWcqOWImeWKoOi9veWujOaIkOWQjuiwg+eUqGNvbXBsZXRlQ2FsbGJhY2vvvIzlkKbliJnnm7TmjqXosIPnlKhcclxuICAgICAqIEBwYXJhbSBjb21wbGV0ZUNhbGxiYWNrIOi1hOa6kOWKoOi9veWujOaIkOWbnuiwg1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGF1dG9Mb2FkUmVzKHVpVmlldzogVUlWaWV3LCBjb21wbGV0ZUNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgLy8g5pqC5pe25YWI55yB55WlXHJcbiAgICAgICAgY29tcGxldGVDYWxsYmFjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDnlJ/miJDllK/kuIDnmoTotYTmupDljaDnlKhrZXkgKi9cclxuICAgIHByaXZhdGUgbWFrZVVzZUtleSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgVUlNZ3JfJHsrK3RoaXMudXNlQ291bnR9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKiog5qC55o2u55WM6Z2i5pi+56S657G75Z6L5Yi35paw5pi+56S6ICovXHJcbiAgICBwcml2YXRlIHVwZGF0ZVVJKCkge1xyXG4gICAgICAgIGxldCBoaWRlSW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IHNob3dJbmRleDogbnVtYmVyID0gdGhpcy5VSVN0YWNrLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgZm9yICg7IHNob3dJbmRleCA+PSAwOyAtLXNob3dJbmRleCkge1xyXG4gICAgICAgICAgICBsZXQgbW9kZSA9IHRoaXMuVUlTdGFja1tzaG93SW5kZXhdLnVpVmlldy5zaG93VHlwZTtcclxuICAgICAgICAgICAgLy8g5peg6K665L2V56eN5qih5byP77yM5pyA6aG26YOo55qEVUnpg73mmK/lupTor6XmmL7npLrnmoRcclxuICAgICAgICAgICAgdGhpcy5VSVN0YWNrW3Nob3dJbmRleF0udWlWaWV3Lm5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKFVJU2hvd1R5cGVzLlVJRnVsbFNjcmVlbiA9PSBtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChVSVNob3dUeXBlcy5VSVNpbmdsZSA9PSBtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuQmFja0dyb3VuZFVJOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5VSVN0YWNrW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVUlTdGFja1tpXS51aVZpZXcubm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhpZGVJbmRleCA9IHRoaXMuQmFja0dyb3VuZFVJO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g6ZqQ6JeP5LiN5bqU6K+l5pi+56S655qE6YOo5YiGVUlcclxuICAgICAgICBmb3IgKGxldCBoaWRlOiBudW1iZXIgPSBoaWRlSW5kZXg7IGhpZGUgPCBzaG93SW5kZXg7ICsraGlkZSkge1xyXG4gICAgICAgICAgICB0aGlzLlVJU3RhY2tbaGlkZV0udWlWaWV3Lm5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5byC5q2l5Yqg6L295LiA5LiqVUnnmoRwcmVmYWLvvIzmiJDlip/liqDovb3kuobkuIDkuKpwcmVmYWLkuYvlkI5cclxuICAgICAqIEBwYXJhbSB1aUlkIOeVjOmdomlkXHJcbiAgICAgKiBAcGFyYW0gcHJvY2Vzc0NhbGxiYWNrIOWKoOi9vei/m+W6puWbnuiwg1xyXG4gICAgICogQHBhcmFtIGNvbXBsZXRlQ2FsbGJhY2sg5Yqg6L295a6M5oiQ5Zue6LCDXHJcbiAgICAgKiBAcGFyYW0gdWlBcmdzIOWIneWni+WMluWPguaVsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldE9yQ3JlYXRlVUkodWlJZDogbnVtYmVyLCBwcm9jZXNzQ2FsbGJhY2s6IFByb2Nlc3NDYWxsYmFjaywgY29tcGxldGVDYWxsYmFjazogKHVpVmlldzogVUlWaWV3KSA9PiB2b2lkLCB1aUFyZ3M6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIC8vIOWmguaenOaJvuWIsOe8k+WtmOWvueixoe+8jOWImeebtOaOpei/lOWbnlxyXG4gICAgICAgIGxldCB1aVZpZXc6IFVJVmlldyA9IHRoaXMuVUlDYWNoZVt1aUlkXTtcclxuICAgICAgICBpZiAodWlWaWV3KSB7XHJcbiAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sodWlWaWV3KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5om+5YiwVUnphY3nva5cclxuICAgICAgICBsZXQgdWlQYXRoID0gdGhpcy5VSUNvbmZbdWlJZF0ucHJlZmFiO1xyXG4gICAgICAgIGlmIChudWxsID09IHVpUGF0aCkge1xyXG4gICAgICAgICAgICBjYy5sb2coYGdldE9yQ3JlYXRlVUkgJHt1aUlkfSBmYWlsZSwgcHJlZmFiIGNvbmYgbm90IGZvdW5kIWApO1xyXG4gICAgICAgICAgICBjb21wbGV0ZUNhbGxiYWNrKG51bGwpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdXNlS2V5ID0gdGhpcy5tYWtlVXNlS2V5KCk7XHJcbiAgICAgICAgcmVzTG9hZGVyLmxvYWQodWlQYXRoLCBwcm9jZXNzQ2FsbGJhY2ssIChlcnI6IEVycm9yLCBwcmVmYWI6IGNjLlByZWZhYikgPT4ge1xyXG4gICAgICAgICAgICAvLyDmo4Dmn6XliqDovb3otYTmupDplJnor69cclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY2MubG9nKGBnZXRPckNyZWF0ZVVJIGxvYWRSZXMgJHt1aUlkfSBmYWlsZSwgcGF0aDogJHt1aVBhdGh9IGVycm9yOiAke2Vycn1gKTtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sobnVsbCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g5qOA5p+l5a6e5L6L5YyW6ZSZ6K+vXHJcbiAgICAgICAgICAgIGxldCB1aU5vZGU6IGNjLk5vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSB1aU5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNjLmxvZyhgZ2V0T3JDcmVhdGVVSSBpbnN0YW50aWF0ZSAke3VpSWR9IGZhaWxlLCBwYXRoOiAke3VpUGF0aH1gKTtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sobnVsbCk7XHJcbiAgICAgICAgICAgICAgICByZXNMb2FkZXIucmVsZWFzZShwcmVmYWIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIOajgOafpee7hOS7tuiOt+WPlumUmeivr1xyXG4gICAgICAgICAgICB1aVZpZXcgPSB1aU5vZGUuZ2V0Q29tcG9uZW50KFVJVmlldyk7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHVpVmlldykge1xyXG4gICAgICAgICAgICAgICAgY2MubG9nKGBnZXRPckNyZWF0ZVVJIGdldENvbXBvbmVudCAke3VpSWR9IGZhaWxlLCBwYXRoOiAke3VpUGF0aH1gKTtcclxuICAgICAgICAgICAgICAgIHVpTm9kZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZUNhbGxiYWNrKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgcmVzTG9hZGVyLnJlbGVhc2UocHJlZmFiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDlvILmraXliqDovb1VSemihOWKoOi9veeahOi1hOa6kFxyXG4gICAgICAgICAgICB0aGlzLmF1dG9Mb2FkUmVzKHVpVmlldywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdWlWaWV3LmluaXQodWlBcmdzKTtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sodWlWaWV3KTtcclxuICAgICAgICAgICAgICAgIHVpVmlldy5jYWNoZUFzc2V0KHByZWZhYik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVSeiiq+aJk+W8gOaXtuWbnuiwg++8jOWvuVVJ6L+b6KGM5Yid5aeL5YyW6K6+572u77yM5Yi35paw5YW25LuW55WM6Z2i55qE5pi+56S677yM5bm25qC55o2uXHJcbiAgICAgKiBAcGFyYW0gdWlJZCDlk6rkuKrnlYzpnaLooqvmiZPlvIDkuoZcclxuICAgICAqIEBwYXJhbSB1aVZpZXcg55WM6Z2i5a+56LGhXHJcbiAgICAgKiBAcGFyYW0gdWlJbmZvIOeVjOmdouagiOWvueW6lOeahOS/oeaBr+e7k+aehFxyXG4gICAgICogQHBhcmFtIHVpQXJncyDnlYzpnaLliJ3lp4vljJblj4LmlbBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBvblVJT3Blbih1aUlkOiBudW1iZXIsIHVpVmlldzogVUlWaWV3LCB1aUluZm86IFVJSW5mbywgdWlBcmdzOiBhbnkpIHtcclxuICAgICAgICBpZiAobnVsbCA9PSB1aVZpZXcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDmv4DmtLvnlYzpnaJcclxuICAgICAgICB1aUluZm8udWlWaWV3ID0gdWlWaWV3O1xyXG4gICAgICAgIHVpVmlldy5ub2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdWlWaWV3Lm5vZGUuekluZGV4ID0gdWlJbmZvLnpPcmRlciB8fCB0aGlzLlVJU3RhY2subGVuZ3RoXHJcblxyXG4gICAgICAgIC8vIOW/q+mAn+WFs+mXreeVjOmdoueahOiuvue9ru+8jOe7keWumueVjOmdouS4reeahGJhY2tncm91bmTvvIzlrp7njrDlv6vpgJ/lhbPpl61cclxuICAgICAgICBpZiAodWlWaWV3LnF1aWNrQ2xvc2UpIHtcclxuICAgICAgICAgICAgbGV0IGJhY2tHcm91bmQgPSB1aVZpZXcubm9kZS5nZXRDaGlsZEJ5TmFtZSgnYmFja2dyb3VuZCcpO1xyXG4gICAgICAgICAgICBpZiAoIWJhY2tHcm91bmQpIHtcclxuICAgICAgICAgICAgICAgIGJhY2tHcm91bmQgPSBuZXcgY2MuTm9kZSgpXHJcbiAgICAgICAgICAgICAgICBiYWNrR3JvdW5kLm5hbWUgPSAnYmFja2dyb3VuZCc7XHJcbiAgICAgICAgICAgICAgICBiYWNrR3JvdW5kLnNldENvbnRlbnRTaXplKGNjLndpblNpemUpO1xyXG4gICAgICAgICAgICAgICAgdWlWaWV3Lm5vZGUuYWRkQ2hpbGQoYmFja0dyb3VuZCwgLTEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJhY2tHcm91bmQudGFyZ2V0T2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJUKTtcclxuICAgICAgICAgICAgYmFja0dyb3VuZC5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgKGV2ZW50OiBjYy5FdmVudC5FdmVudEN1c3RvbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKHVpVmlldyk7XHJcbiAgICAgICAgICAgIH0sIGJhY2tHcm91bmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5re75Yqg5Yiw5Zy65pmv5LitXHJcbiAgICAgICAgbGV0IGNoaWxkID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZSgnQ2FudmFzJyk7XHJcbiAgICAgICAgY2hpbGQuYWRkQ2hpbGQodWlWaWV3Lm5vZGUpO1xyXG5cclxuICAgICAgICAvLyDliLfmlrDlhbbku5ZVSVxyXG4gICAgICAgIHRoaXMudXBkYXRlVUkoKTtcclxuXHJcbiAgICAgICAgLy8g5LuO6YKj5Liq55WM6Z2i5omT5byA55qEXHJcbiAgICAgICAgbGV0IGZyb21VSUlEID0gMDtcclxuICAgICAgICBpZiAodGhpcy5VSVN0YWNrLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgZnJvbVVJSUQgPSB0aGlzLlVJU3RhY2tbdGhpcy5VSVN0YWNrLmxlbmd0aCAtIDJdLnVpSWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOaJk+W8gOeVjOmdouS5i+WJjeWbnuiwg1xyXG4gICAgICAgIGlmICh0aGlzLnVpT3BlbkJlZm9yZURlbGVnYXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudWlPcGVuQmVmb3JlRGVsZWdhdGUodWlJZCwgZnJvbVVJSUQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5omn6KGMb25PcGVu5Zue6LCDXHJcbiAgICAgICAgdWlWaWV3Lm9uT3Blbihmcm9tVUlJRCwgdWlBcmdzKTtcclxuICAgICAgICB0aGlzLmF1dG9FeGVjQW5pbWF0aW9uKHVpVmlldywgXCJ1aU9wZW5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB1aVZpZXcub25PcGVuQW5pT3ZlcigpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy51aU9wZW5EZWxlZ2F0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51aU9wZW5EZWxlZ2F0ZSh1aUlkLCBmcm9tVUlJRCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog5omT5byA55WM6Z2i5bm25re75Yqg5Yiw55WM6Z2i5qCI5LitICovXHJcbiAgICBwdWJsaWMgb3Blbih1aUlkOiBudW1iZXIsIHVpQXJnczogYW55ID0gbnVsbCwgcHJvZ3Jlc3NDYWxsYmFjazogUHJvY2Vzc0NhbGxiYWNrID0gbnVsbCk6IHZvaWQge1xyXG4gICAgICAgIGxldCB1aUluZm86IFVJSW5mbyA9IHtcclxuICAgICAgICAgICAgdWlJZDogdWlJZCxcclxuICAgICAgICAgICAgdWlBcmdzOiB1aUFyZ3MsXHJcbiAgICAgICAgICAgIHVpVmlldzogbnVsbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzT3BlbmluZyB8fCB0aGlzLmlzQ2xvc2luZykge1xyXG4gICAgICAgICAgICAvLyDmj5LlhaXlvoXmiZPlvIDpmJ/liJdcclxuICAgICAgICAgICAgdGhpcy5VSU9wZW5RdWV1ZS5wdXNoKHVpSW5mbyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB1aUluZGV4ID0gdGhpcy5nZXRVSUluZGV4KHVpSWQpO1xyXG4gICAgICAgIGlmICgtMSAhPSB1aUluZGV4KSB7XHJcbiAgICAgICAgICAgIC8vIOmHjeWkjeaJk+W8gOS6huWQjOS4gOS4queVjOmdou+8jOebtOaOpeWbnuWIsOivpeeVjOmdolxyXG4gICAgICAgICAgICB0aGlzLmNsb3NlVG9VSSh1aUlkLCB1aUFyZ3MpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDorr7nva5VSeeahHpPcmRlclxyXG4gICAgICAgIHVpSW5mby56T3JkZXIgPSB0aGlzLlVJU3RhY2subGVuZ3RoICsgMTtcclxuICAgICAgICB0aGlzLlVJU3RhY2sucHVzaCh1aUluZm8pO1xyXG5cclxuICAgICAgICAvLyDlhYjlsY/olL3ngrnlh7tcclxuICAgICAgICBpZiAodGhpcy5VSUNvbmZbdWlJZF0ucHJldmVudFRvdWNoKSB7XHJcbiAgICAgICAgICAgIHVpSW5mby5wcmV2ZW50Tm9kZSA9IHRoaXMucHJldmVudFRvdWNoKHVpSW5mby56T3JkZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pc09wZW5pbmcgPSB0cnVlO1xyXG4gICAgICAgIC8vIOmihOWKoOi9vei1hOa6kO+8jOW5tuWcqOi1hOa6kOWKoOi9veWujOaIkOWQjuiHquWKqOaJk+W8gOeVjOmdolxyXG4gICAgICAgIHRoaXMuZ2V0T3JDcmVhdGVVSSh1aUlkLCBwcm9ncmVzc0NhbGxiYWNrLCAodWlWaWV3OiBVSVZpZXcpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgLy8g5aaC5p6c55WM6Z2i5bey57uP6KKr5YWz6Zet5oiW5Yib5bu65aSx6LSlXHJcbiAgICAgICAgICAgIGlmICh1aUluZm8uaXNDbG9zZSB8fCBudWxsID09IHVpVmlldykge1xyXG4gICAgICAgICAgICAgICAgY2MubG9nKGBnZXRPckNyZWF0ZVVJICR7dWlJZH0gZmFpbGUhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlIHN0YXRlIDogJHt1aUluZm8uaXNDbG9zZX0gLCB1aVZpZXcgOiAke3VpVmlld31gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNPcGVuaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAodWlJbmZvLnByZXZlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdWlJbmZvLnByZXZlbnROb2RlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICB1aUluZm8ucHJldmVudE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDmiZPlvIBVSe+8jOaJp+ihjOmFjee9rlxyXG4gICAgICAgICAgICB0aGlzLm9uVUlPcGVuKHVpSWQsIHVpVmlldywgdWlJbmZvLCB1aUFyZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLmlzT3BlbmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmF1dG9FeGVjTmV4dFVJKCk7XHJcbiAgICAgICAgfSwgdWlBcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog5pu/5o2i5qCI6aG255WM6Z2iICovXHJcbiAgICBwdWJsaWMgcmVwbGFjZSh1aUlkOiBudW1iZXIsIHVpQXJnczogYW55ID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMuY2xvc2UodGhpcy5VSVN0YWNrW3RoaXMuVUlTdGFjay5sZW5ndGggLSAxXS51aVZpZXcpO1xyXG4gICAgICAgIHRoaXMub3Blbih1aUlkLCB1aUFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWz6Zet5b2T5YmN55WM6Z2iXHJcbiAgICAgKiBAcGFyYW0gY2xvc2VVSSDopoHlhbPpl63nmoTnlYzpnaJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsb3NlKGNsb3NlVUk/OiBVSVZpZXcpIHtcclxuICAgICAgICBsZXQgdWlDb3VudCA9IHRoaXMuVUlTdGFjay5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHVpQ291bnQgPCAxIHx8IHRoaXMuaXNDbG9zaW5nIHx8IHRoaXMuaXNPcGVuaW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChjbG9zZVVJKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDmj5LlhaXlvoXlhbPpl63pmJ/liJdcclxuICAgICAgICAgICAgICAgIHRoaXMuVUlDbG9zZVF1ZXVlLnB1c2goY2xvc2VVSSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHVpSW5mbzogVUlJbmZvO1xyXG4gICAgICAgIGlmIChjbG9zZVVJKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gdGhpcy5VSVN0YWNrLmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcclxuICAgICAgICAgICAgICAgIGxldCB1aSA9IHRoaXMuVUlTdGFja1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICBpZiAodWkudWlWaWV3ID09PSBjbG9zZVVJKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdWlJbmZvID0gdWk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5VSVN0YWNrLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g5om+5LiN5Yiw6L+Z5LiqVUlcclxuICAgICAgICAgICAgaWYgKHVpSW5mbyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1aUluZm8gPSB0aGlzLlVJU3RhY2sucG9wKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDlhbPpl63lvZPliY3nlYzpnaJcclxuICAgICAgICBsZXQgdWlJZCA9IHVpSW5mby51aUlkO1xyXG4gICAgICAgIGxldCB1aVZpZXcgPSB1aUluZm8udWlWaWV3O1xyXG4gICAgICAgIHVpSW5mby5pc0Nsb3NlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8g5Zue5pS26YGu572p5bGCXHJcbiAgICAgICAgaWYgKHVpSW5mby5wcmV2ZW50Tm9kZSkge1xyXG4gICAgICAgICAgICB1aUluZm8ucHJldmVudE5vZGUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB1aUluZm8ucHJldmVudE5vZGUgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG51bGwgPT0gdWlWaWV3KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBwcmVVSUluZm8gPSB0aGlzLlVJU3RhY2tbdWlDb3VudCAtIDJdO1xyXG4gICAgICAgIC8vIOWkhOeQhuaYvuekuuaooeW8j1xyXG4gICAgICAgIHRoaXMudXBkYXRlVUkoKTtcclxuICAgICAgICBsZXQgY2xvc2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNDbG9zaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vIOaYvuekuuS5i+WJjeeahOeVjOmdolxyXG4gICAgICAgICAgICBpZiAocHJlVUlJbmZvICYmIHByZVVJSW5mby51aVZpZXcgJiYgdGhpcy5pc1RvcFVJKHByZVVJSW5mby51aUlkKSkge1xyXG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5LmL5YmN55qE55WM6Z2i5by55Yiw5LqG5pyA5LiK5pa577yI5Lit6Ze05pyJ6IKv6IO95omT5byA5LqG5YW25LuW55WM6Z2i77yJXHJcbiAgICAgICAgICAgICAgICBwcmVVSUluZm8udWlWaWV3Lm5vZGUuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgLy8g5Zue6LCDb25Ub3BcclxuICAgICAgICAgICAgICAgIHByZVVJSW5mby51aVZpZXcub25Ub3AodWlJZCwgdWlWaWV3Lm9uQ2xvc2UoKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1aVZpZXcub25DbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy51aUNsb3NlRGVsZWdhdGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudWlDbG9zZURlbGVnYXRlKHVpSWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh1aVZpZXcuY2FjaGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuVUlDYWNoZVt1aUlkXSA9IHVpVmlldztcclxuICAgICAgICAgICAgICAgIHVpVmlldy5ub2RlLnJlbW92ZUZyb21QYXJlbnQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgY2MubG9nKGB1aVZpZXcgcmVtb3ZlRnJvbVBhcmVudCAke3VpSW5mby51aUlkfWApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdWlWaWV3LnJlbGVhc2VBc3NldHMoKTtcclxuICAgICAgICAgICAgICAgIHVpVmlldy5ub2RlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIGNjLmxvZyhgdWlWaWV3IGRlc3Ryb3kgJHt1aUluZm8udWlJZH1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmF1dG9FeGVjTmV4dFVJKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOaJp+ihjOWFs+mXreWKqOeUu1xyXG4gICAgICAgIHRoaXMuYXV0b0V4ZWNBbmltYXRpb24odWlWaWV3LCBcInVpQ2xvc2VcIiwgY2xvc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDlhbPpl63miYDmnInnlYzpnaIgKi9cclxuICAgIHB1YmxpYyBjbG9zZUFsbCgpIHtcclxuICAgICAgICAvLyDkuI3mkq3mlL7liqjnlLvvvIzkuZ/kuI3muIXnkIbnvJPlrZhcclxuICAgICAgICBmb3IgKGNvbnN0IHVpSW5mbyBvZiB0aGlzLlVJU3RhY2spIHtcclxuICAgICAgICAgICAgdWlJbmZvLmlzQ2xvc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAodWlJbmZvLnByZXZlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1aUluZm8ucHJldmVudE5vZGUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgdWlJbmZvLnByZXZlbnROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodWlJbmZvLnVpVmlldykge1xyXG4gICAgICAgICAgICAgICAgdWlJbmZvLnVpVmlldy5vbkNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB1aUluZm8udWlWaWV3LnJlbGVhc2VBc3NldHMoKTtcclxuICAgICAgICAgICAgICAgIHVpSW5mby51aVZpZXcubm9kZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5VSU9wZW5RdWV1ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMuVUlDbG9zZVF1ZXVlID0gW107XHJcbiAgICAgICAgdGhpcy5VSVN0YWNrID0gW107XHJcbiAgICAgICAgdGhpcy5pc09wZW5pbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmlzQ2xvc2luZyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWz6Zet55WM6Z2i77yM5LiA55u05YWz6Zet5Yiw6aG26YOo5Li6dWlJZOeahOeVjOmdou+8jOS4uumBv+WFjeW+queOr+aJk+W8gFVJ5a+86Ie0VUnmoIjmuqLlh7pcclxuICAgICAqIEBwYXJhbSB1aUlkIOimgeWFs+mXreWIsOeahHVpSWTvvIjlhbPpl63lhbbpobbpg6jnmoR1ae+8iVxyXG4gICAgICogQHBhcmFtIHVpQXJncyDmiZPlvIDnmoTlj4LmlbBcclxuICAgICAqIEBwYXJhbSBiT3BlblNlbGYgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbG9zZVRvVUkodWlJZDogbnVtYmVyLCB1aUFyZ3M6IGFueSwgYk9wZW5TZWxmID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgICAgIGxldCBpZHggPSB0aGlzLmdldFVJSW5kZXgodWlJZCk7XHJcbiAgICAgICAgaWYgKC0xID09IGlkeCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZHggPSBiT3BlblNlbGYgPyBpZHggOiBpZHggKyAxO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLlVJU3RhY2subGVuZ3RoIC0gMTsgaSA+PSBpZHg7IC0taSkge1xyXG4gICAgICAgICAgICBsZXQgdWlJbmZvID0gdGhpcy5VSVN0YWNrLnBvcCgpO1xyXG4gICAgICAgICAgICBsZXQgdWlJZCA9IHVpSW5mby51aUlkO1xyXG4gICAgICAgICAgICBsZXQgdWlWaWV3ID0gdWlJbmZvLnVpVmlldztcclxuICAgICAgICAgICAgdWlJbmZvLmlzQ2xvc2UgPSB0cnVlXHJcblxyXG4gICAgICAgICAgICAvLyDlm57mlLblsY/olL3lsYJcclxuICAgICAgICAgICAgaWYgKHVpSW5mby5wcmV2ZW50Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdWlJbmZvLnByZXZlbnROb2RlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHVpSW5mby5wcmV2ZW50Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVpQ2xvc2VEZWxlZ2F0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51aUNsb3NlRGVsZWdhdGUodWlJZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh1aVZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHVpVmlldy5vbkNsb3NlKClcclxuICAgICAgICAgICAgICAgIGlmICh1aVZpZXcuY2FjaGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlVJQ2FjaGVbdWlJZF0gPSB1aVZpZXc7XHJcbiAgICAgICAgICAgICAgICAgICAgdWlWaWV3Lm5vZGUucmVtb3ZlRnJvbVBhcmVudChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHVpVmlldy5yZWxlYXNlQXNzZXRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdWlWaWV3Lm5vZGUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVVJKCk7XHJcbiAgICAgICAgdGhpcy5VSU9wZW5RdWV1ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMuVUlDbG9zZVF1ZXVlID0gW107XHJcbiAgICAgICAgYk9wZW5TZWxmICYmIHRoaXMub3Blbih1aUlkLCB1aUFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDmuIXnkIbnlYzpnaLnvJPlrZggKi9cclxuICAgIHB1YmxpYyBjbGVhckNhY2hlKCk6IHZvaWQge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuVUlDYWNoZSkge1xyXG4gICAgICAgICAgICBsZXQgdWkgPSB0aGlzLlVJQ2FjaGVba2V5XTtcclxuICAgICAgICAgICAgaWYgKGNjLmlzVmFsaWQodWkubm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYy5pc1ZhbGlkKHVpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVpLnJlbGVhc2VBc3NldHMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHVpLm5vZGUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuVUlDYWNoZSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqKioqKiBVSeeahOS+v+aNt+aOpeWPoyAqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgcHVibGljIGlzVG9wVUkodWlJZCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLlVJU3RhY2subGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5VSVN0YWNrW3RoaXMuVUlTdGFjay5sZW5ndGggLSAxXS51aUlkID09IHVpSWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFVJKHVpSWQ6IG51bWJlcik6IFVJVmlldyB7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuVUlTdGFjay5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuVUlTdGFja1tpbmRleF07XHJcbiAgICAgICAgICAgIGlmICh1aUlkID09IGVsZW1lbnQudWlJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudWlWaWV3O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRUb3BVSSgpOiBVSVZpZXcge1xyXG4gICAgICAgIGlmICh0aGlzLlVJU3RhY2subGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5VSVN0YWNrW3RoaXMuVUlTdGFjay5sZW5ndGggLSAxXS51aVZpZXc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRVSUluZGV4KHVpSWQ6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuVUlTdGFjay5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuVUlTdGFja1tpbmRleF07XHJcbiAgICAgICAgICAgIGlmICh1aUlkID09IGVsZW1lbnQudWlJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGxldCB1aU1hbmFnZXI6IFVJTWFuYWdlciA9IG5ldyBVSU1hbmFnZXIoKTsiXX0=