"use strict";
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