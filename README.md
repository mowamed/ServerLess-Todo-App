# Serverless TODO App

This is the submission of Cloud Developer projects 04. i've implemented a Simple TODO application using AWS Lambda and Serverless framework.

# Functionality of the application

This application allow creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.


# API Endpoints
```ts
endpoints:
  GET - https://2kwp5xi2ij.execute-api.us-east-1.amazonaws.com/dev/todos
  POST - https://2kwp5xi2ij.execute-api.us-east-1.amazonaws.com/dev/todos
  PATCH - https://2kwp5xi2ij.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}
  DELETE - https://2kwp5xi2ij.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}
  POST - https://2kwp5xi2ij.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}/attachment
  ```
# Frontend credentials
```ts
const apiId = '2kwp5xi2ij'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'mowamed.auth0.com',            // Auth0 domain
  clientId: 'm9lDCKQ3DkCybvPJHakpmRGcb0vUZGfd',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
```





# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Screenshots

localhost after login with auth0:

![create Todo](images/localhost-2.png?raw=true "Creating a new task")


edit a Todo:

![Edit Todo](images/image-upload.png?raw=true "edit Todo")

sls deploy -v output:

![Alt text](images/sls-output.png?raw=true "Serveless output")

xray screenshot:

![Alt text](images/xray.png?raw=true "Xray")

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")
