import { AbstractComponent } from '../framework/view/abstract-component.js';


function createAddTaskFormComponentTemplate() {
    return (
        `<form class="add-task__form">
            <div class="add-task__input-wrapper">
                <label for="add-task">Новая задача</label>
                <input type="text" name="task-name" id="add-task" placeholder="Название задачи..." required>
            </div>
            <button class="add-task__button button" type="submit">
                <span>+ Добавить</span>
            </button>
        </form>`
    );
}


export default class AddTaskFormComponent extends AbstractComponent {
    get template() {
        return createAddTaskFormComponentTemplate();
    }
}