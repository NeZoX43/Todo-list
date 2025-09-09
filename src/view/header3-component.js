import { AbstractComponent } from '../framework/view/abstract-component.js';


function createHeader3ComponentTemplate(text) {
    return (
        `<h3>${text}</h3>`
    );
}

export default class Header3Component extends AbstractComponent{
    constructor(text){
        super();
        this.text = text;
    }
    get template(){
        return createHeader3ComponentTemplate(this.text)
    }
}