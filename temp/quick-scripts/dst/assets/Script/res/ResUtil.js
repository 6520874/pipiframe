
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