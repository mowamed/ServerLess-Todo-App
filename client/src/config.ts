// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '2kwp5xi2ij'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'mowamed.auth0.com',            // Auth0 domain
  clientId: 'm9lDCKQ3DkCybvPJHakpmRGcb0vUZGfd',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
