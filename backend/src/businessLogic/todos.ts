import * as uuid from 'uuid'
import 'source-map-support/register'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()


/**
 * get all todos created by a user
 *
 * @export
 * @param {string} userId
 * @returns {Promise<TodoItem[]>}
 */
export async function getTodos(userId: string): Promise<TodoItem[]> {
    return todoAccess.getUserTodos(userId)
}


/**
 * create a new Todo
 *
 * @export
 * @param {CreateTodoRequest} createTodoRequest
 * @param {string} jwtToken
 * @returns {Promise<TodoItem>}
 */
export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {

    const todoId = uuid.v4()

    return await todoAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false
    })
}


/**
 * update an existing todo
 *
 * @export
 * @param {string} userId
 * @param {string} todoId
 * @param {UpdateTodoRequest} updateTodoRequest
 * @returns {Promise<TodoUpdate>}
 */
export async function updateTodo(
    userId: string,
    todoId: string,
    updateTodoRequest: UpdateTodoRequest
): Promise<TodoUpdate> {

    const updatedTodo: TodoUpdate = {
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done
    }

    return await todoAccess.updateTodo(userId, todoId, updatedTodo)
}


/**
 * delete a todo
 *
 * @export
 * @param {string} userId
 * @param {string} todoId
 * @returns {Promise<String>}
 */
export async function deleteTodo(userId: string, todoId: string): Promise<String>  {
    return todoAccess.deleteTodo(userId, todoId)
}


/**
 * generate a link to upload a todo image
 *
 * @export
 * @param {string} userId
 * @param {string} todoId
 * @returns {Promise < String >}
 */
export async function generateUploadUrl(userId: string, todoId: string):  Promise < String >{
    return todoAccess.generateUploadUrl(userId, todoId)
}
