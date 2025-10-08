import { auth, ConfigParams } from 'express-openid-connect';

export function createAuth0Middleware(): ReturnType<typeof auth> {
  const config: ConfigParams = {
    authRequired: false,
    auth0Logout: true,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    secret: process.env.SECRET,
    authorizationParams: {
      response_type: 'code',
      scope: 'openid profile email',
      response_mode: 'query',
    },
  };

  return auth(config);
}


