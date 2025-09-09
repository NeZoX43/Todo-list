import ApiService from './framework/view/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class TasksApiService extends ApiService {

  get tasks() {
    return this._load({ url: 'tasks' })
      .then(ApiService.parseResponse);
  }

  async addTask(task) {
    const response = await this._load({
      url: 'tasks',
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });

    return ApiService.parseResponse(response);
  }

  // Новый метод для обновления задачи
  async updateTask(task) {
    const response = await this._load({
      url: `tasks/${task.id}`,  // Вставляем ID задачи в URL
      method: Method.PUT,
      body: JSON.stringify(task),  // Отправляем обновленную задачу
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });

    const parsedResponse = await ApiService.parseResponse(response); // Разбираем ответ от сервера
    return parsedResponse;
  }
    
    async deleteTask(taskId) {
        await this._load({
          url: `tasks/${taskId}`,
          method: Method.DELETE,
        });
      }
    }


 
