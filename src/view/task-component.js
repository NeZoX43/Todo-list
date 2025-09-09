
import { AbstractComponent } from '../framework/view/abstract-component.js';
function createTaskComponentTemplate(task) {
    return `<li class="task">${task.title}</li>`;
}

export default class TaskComponent extends AbstractComponent {
    constructor({ task }) {
      super();
      this.task = task;
      this.#afterCreateElement();
    }
  
    get template() {
      return createTaskComponentTemplate(this.task);
    }
  
    #afterCreateElement() {
      this.#makeTaskDraggable();
    }
  
    #makeTaskDraggable() {
      this.element.setAttribute('draggable', true);
  
      this.element.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', this.task.id);
      });
    }
    #setDropHandler(onTaskDrop) {
        this.element.addEventListener('dragover', (event) => {
          event.preventDefault();
          this.element.style.borderTop = '2px solid blue';
        });
    
        this.element.addEventListener('dragleave', () => {
          this.element.style.borderTop = '';
        });
    
        this.element.addEventListener('drop', (event) => {
          event.preventDefault();
          const draggedTaskId = event.dataTransfer.getData('text/plain');
          this.element.style.borderTop = '';
          onTaskDrop(draggedTaskId, this.task.status, this.task.id); // dragId, dropStatus, beforeThisTaskId
        });
      }
    }
  

