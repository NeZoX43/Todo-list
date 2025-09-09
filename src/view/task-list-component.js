import { AbstractComponent } from '../framework/view/abstract-component.js';
function createTaskListComponentTemplate(status, label) {
    return `
        <div class="task-section ${status}">
            <h3>${label}</h3>
            <ul class="task-list"></ul>
        </div>
    `;
}

export default class TaskListComponent extends AbstractComponent {
    constructor({ status, label, onTaskDrop }) {
      super();
      this.status = status;
      this.label = label;
      this.#onTaskDrop = onTaskDrop;
      this.#setDropHandler();
    }
  
    get template() {
      return `
        <div class="task-section ${this.status}">
          <h3>${this.label}</h3>
          <ul class="task-list"></ul>
        </div>
      `;
    }
  
    #onTaskDrop = null;
  
    #setDropHandler() {
      const container = this.element.querySelector('.task-list');
  
      container.addEventListener('dragover', (event) => {
        event.preventDefault();
      });
  
      container.addEventListener('drop', (event) => {
        event.preventDefault();
        const taskId = event.dataTransfer.getData('text/plain');
        this.#onTaskDrop(taskId, this.status, null); // dropped into empty space — no target task
      });
    }
  }
  