import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getUserId } from '../utils'
import { generateUploadUrl } from '../../businessLogic/todos'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

const XAWS = AWSXRay.captureAWS(AWS)


const docClient = new XAWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const validTodo = await todoExists(userId, todoId)

  if (!validTodo) {
    logger.info('todo does not exist')
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'todo does not exist'
      })
    }
  }

  let url = await generateUploadUrl(userId, todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}


export async function todoExists(userId: string, todoId: string) {
  const result = await docClient
    .get({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    })
    .promise()
  return !!result.Item
}
