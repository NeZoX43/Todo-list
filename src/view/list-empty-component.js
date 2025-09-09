import { AbstractComponent } from '../framework/view/abstract-component.js';


const createListEmptyComponent = (status, label) => {
    return `
      <div class="task-section task-section--empty ${status}">
        <h3>${label}</h3>
        <p class="empty-text">Пустой Список</p>
      </div>
    `;
};
export default class TaskListComponent extends AbstractComponent {
  constructor({ status, label, onTaskDrop }) {
    super();
    this.status = status;
    this.label = label;
    this.#setDropHandler(onTaskDrop);
  }

  get template() {
    return createTaskListComponentTemplate(this.status, this.label);
  }

  #setDropHandler(onTaskDrop) {
    const container = this.element;

    container.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    container.addEventListener('drop', (event) => {
      event.preventDefault();
      const taskId = event.dataTransfer.getData('text/plain');
      onTaskDrop(taskId, this.status);
    });
  }
}