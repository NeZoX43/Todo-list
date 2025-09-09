import { AbstractComponent } from '../framework/view/abstract-component.js';


function createDeleteButtonComponentTemplate() {
    return (
        `<button class="delate-btn" type="submit">
            <span>✖ Очистить</span>
        </button>`
    );
}

export default class DeleteButtonComponent extends AbstractComponent{
    get template(){
        return createDeleteButtonComponentTemplate();
    }
}



