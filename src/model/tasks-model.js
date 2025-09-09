import Observable from '../framework/observable.js';
import { generateID } from '../utils.js';
import { UpdateType, UserAction } from '../const.js';

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardtasks = [];

  constructor({ tasksApiService }) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  get tasks() {
    return this.#boardtasks;
  }

  async init() {
    try {
      const tasks = await this.#tasksApiService.tasks;
      this.#boardtasks = tasks;
    } catch (err) {
      this.#boardtasks = [];
      console.error('Ошибка при загрузке задач с сервера:', err);
    }

    this._notify(UpdateType.INIT);
  }

  async addTask(title) {
    const newTask = {
      id: generateID(),
      title,
      status: 'backlog',
    };

    try {
      const createdTask = await this.#tasksApiService.addTask(newTask);
      this.#boardtasks.push(createdTask);
      this._notify(UserAction.ADD_TASK, createdTask);
      return createdTask;
    } catch (err) {
      console.error('Ошибка при добавлении задачи на сервер:', err);
      throw err;
    }
  }

  //  Удаление одной задачи
  deleteTask(taskId) {
    this.#boardtasks = this.#boardtasks.filter(task => task.id !== taskId);
    this._notify(UserAction.DELETE_TASK, { id: taskId });
  }

  //  Удаление всех задач из корзины с сервера
  async clearBasketTasks() {
    const basketTasks = this.#boardtasks.filter(task => task.status === 'basket');

    try {
      await Promise.all(basketTasks.map(task => this.#tasksApiService.deleteTask(task.id)));
      this.#boardtasks = this.#boardtasks.filter(task => task.status !== 'basket');
      this._notify(UserAction.DELETE_TASK, { status: 'basket' });
    } catch (err) {
      console.error('Ошибка при удалении задач из корзины на сервере:', err);
      throw err;
    }
  }

  //  Проверка наличия задач в корзине
  hasBasketTasks() {
    return this.#boardtasks.some(task => task.status === 'basket');
  }

  //  Перемещение задачи локально
  moveTask(taskId, newStatus, beforeTaskId = null) {
    const taskIndex = this.#boardtasks.findIndex(task => task.id === taskId);
    const task = this.#boardtasks[taskIndex];
    if (!task) return;

    this.#boardtasks.splice(taskIndex, 1);
    task.status = newStatus;

    if (beforeTaskId) {
      const targetIndex = this.#boardtasks.findIndex(t => t.id === beforeTaskId);
      if (targetIndex !== -1) {
        this.#boardtasks.splice(targetIndex, 0, task);
      } else {
        this.#boardtasks.push(task);
      }
    } else {
      this.#boardtasks.push(task);
    }

    this._notify(UpdateType.MOVE);
  }

  //  Обновление статуса задачи с синхронизацией с сервером
  async updateTaskStatus(taskId, newStatus) {
    const task = this.#boardtasks.find(task => task.id === taskId);
    if (!task) return;

    const previousStatus = task.status;
    task.status = newStatus;

    try {
      const updatedTask = await this.#tasksApiService.updateTask(task);
      Object.assign(task, updatedTask);
      this._notify(UserAction.UPDATE_TASK, task);
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи на сервер:', err);
      task.status = previousStatus;
      throw err;
    }
  }
}
