import HeaderComponent from './view/header-component.js';
import AddTaskFormComponent from './view/add-task-form-component.js';
import TaskBoardPresenter from './presenter/tasks-board-presenter.js';
import { render, RenderPosition } from './framework/render.js';
import TasksModel from './model/tasks-model.js';
import TasksApiService from './tasks-api-service.js';

const bodyContainer = document.querySelector('.board-app');
const END_POINT ='https://680bb8342ea307e081d216ff.mockapi.io';
const tasksModel =new TasksModel({
    tasksApiService:new TasksApiService(END_POINT)
});

const tasksBoardPresenter = new TaskBoardPresenter({ 
    boardContainer: bodyContainer, tasksModel
 });

const formContainer = document.querySelector('.add-task');
const taskBoardContainer = document.querySelector('.taskboard');


render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(new AddTaskFormComponent(), bodyContainer, RenderPosition.BEFOREEND);

tasksBoardPresenter.init();

const addTaskFormElement = document.querySelector('.add-task__form');
const inputElement = addTaskFormElement.querySelector('#add-task');

addTaskFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const taskTitle = inputElement.value.trim();

    if (taskTitle === '') return;

    tasksBoardPresenter.createTask(taskTitle); // вызываем метод добавления
    inputElement.value = ''; // очищаем поле ввода
});


