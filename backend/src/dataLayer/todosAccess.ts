import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('Todos')

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})


export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly bucketName = process.env.IMAGES_S3_BUCKET) {
  }

  async getUserTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todos done by a user')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    logger.info('Todo retrieved successfully!')

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    logger.info('Todo created successfully!')
    return todo
  }

  async updateTodo(userId: string, todoId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: "set name = :name, dueDate = :date, done = :done",
      ExpressionAttributeValues: {
        ":name": todoUpdate.name,
        ":date": todoUpdate.dueDate,
        ":done": todoUpdate.done
      },
      ExpressionAttributeNames: {
        "#n": "name"
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()
    logger.info('Todo updated successfully!', {
      todoId: todoId
    })
    return todoUpdate
  }

  async deleteTodo(userId: string, todoId: string): Promise<String> {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }).promise()
    logger.info('Todo deleted successfully!', {
      todoId: todoId
    })
    return ''
  }

  async generateUploadUrl(userId: string, todoId: string): Promise<String> {
    const url = getUploadUrl(todoId, this.bucketName, this.urlExpiration)

    const attachmentUrl: string = 'https://' + this.bucketName + '.s3.amazonaws.com/' + todoId

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: "set attachmentUrl = :url",
      ExpressionAttributeValues: {
        ":url": attachmentUrl
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()
    logger.info('upload url generated successfully!', url)

    return url;
  }

}

function getUploadUrl(imageId: string, bucketName: string, urlExpiration: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: Number(urlExpiration)
  })
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
