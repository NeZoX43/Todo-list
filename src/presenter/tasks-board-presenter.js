import TaskBoardComponent from "../view/task-board-component.js";
import TaskListComponent from "../view/task-list-component.js";
import TaskComponent from "../view/task-component.js";
import ListEmptyComponent from "../view/list-empty-component.js"; 
import DeleteButtonComponent from "../view/button-delete-component.js";
import { Status, StatusLabel, UserAction, UpdateType } from "../const.js";
import { render } from '../framework/render.js';
import { generateID } from '../utils.js';
import LoadingViewComponent from "../view/loading-view-component.js"; 

export default class TaskBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = null;
  #taskLists = {};
  #resetButtonComponent = null;
  #loadingComponent = new LoadingViewComponent();

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;

    this.#tasksModel.addObserver(this.#handleModelEvent);
    this.#tasksBoardComponent = new TaskBoardComponent();
  }

  async init() {
    // Показываем индикатор загрузки
    render(this.#loadingComponent, this.#boardContainer);

    // Ждём данные от модели (сервер)
    await this.#tasksModel.init();

    // Убираем индикатор загрузки
    this.#loadingComponent.element.remove();
    this.#loadingComponent = null;

    // Рендерим доску с задачами
    render(this.#tasksBoardComponent, this.#boardContainer);
    
  }
  async createTask() {
    const taskTitle = document.querySelector('#add-task').value.trim();
    if (!taskTitle) {
      return;
    }
    try {
      await this.#tasksModel.addTask(taskTitle);
      document.querySelector('#add-task').value = '';
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
    }
  }

  #renderTasksList() {
    Object.values(Status).forEach((status) => {
      const statusTasks = this.#tasksModel.tasks.filter((task) => task.status === status);

      const tasksListComponent = new TaskListComponent({
        status,
        label: StatusLabel[status],
        onTaskDrop: this.#handleTaskDrop.bind(this),
      });

      this.#taskLists[status] = tasksListComponent;
      render(tasksListComponent, this.#tasksBoardComponent.element);

      if (statusTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.classList.add('task-empty');
        emptyMessage.textContent = 'Пустой список';
        const listElement = tasksListComponent.element.querySelector('.task-list');
        listElement.appendChild(emptyMessage);
      }

      statusTasks.forEach((task) => this.#renderTask(task, tasksListComponent));

      if (status === Status.BASKET) {
        this.#renderDeleteButton(tasksListComponent);
      }
    });
  }

  #renderTask(task, listComponent) {
    const taskComponent = new TaskComponent({
      task,
      onTaskDrop: this.#handleTaskDrop.bind(this),
    });
    const listElement = listComponent.element.querySelector('.task-list');
    render(taskComponent, listElement);
  }

  #renderDeleteButton(listComponent) {
    const clearButtonComponent = new DeleteButtonComponent();
    const taskListElement = listComponent.element.querySelector('.task-list');
    render(clearButtonComponent, taskListElement, 'afterend');

    // Подключаем обновлённый метод удаления
    clearButtonComponent.element.addEventListener('click', this.#handleClearBasketClick);

    this.#resetButtonComponent = clearButtonComponent;
  }

  #clearBoard() {
    this.#tasksBoardComponent.element.innerHTML = '';
    this.#taskLists = {};
  }

  //  Обновлённый метод для синхронизации статуса задачи с сервером
  async #handleTaskDrop(taskId, newStatus) {
    try {
      await this.#tasksModel.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
    }
  }

  //  Новый метод для удаления задач из корзины + сервер
  #handleClearBasketClick = async () => {
    try {
      await this.#tasksModel.clearBasketTasks();
    } catch (err) {
      console.error('Ошибка при очистке корзины:', err);
    }
  };

  // Реакция на изменения модели
  #handleModelEvent = (event, payload) => {
    switch (event) {
      case UserAction.ADD_TASK:
      case UserAction.UPDATE_TASK:
      case UserAction.DELETE_TASK:
        this.#clearBoard();
        this.#renderTasksList();
        if (this.#resetButtonComponent) {
          this.#resetButtonComponent.toggleDisabled(!this.#tasksModel.tasks.some(task => task.status === 'basket'));
        }
        break;

      case UpdateType.INIT:
        this.#clearBoard();
        this.#renderTasksList();
        break;

      default:
        break;
    }
  };
}
