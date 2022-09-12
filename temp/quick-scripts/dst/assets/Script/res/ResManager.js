
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