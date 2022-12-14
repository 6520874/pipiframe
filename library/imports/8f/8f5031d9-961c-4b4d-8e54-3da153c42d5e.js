"use strict";
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