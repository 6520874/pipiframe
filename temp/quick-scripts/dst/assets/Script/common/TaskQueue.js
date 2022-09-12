
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