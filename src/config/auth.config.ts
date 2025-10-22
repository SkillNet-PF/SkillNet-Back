// src/config/auth.config.ts
import { auth, ConfigParams } from 'express-openid-connect';

export function createAuth0Middleware() {
  const config: ConfigParams = {
    authRequired: false,
    auth0Logout: true,
    baseURL: process.env.BASE_URL, // p.ej. http://localhost:3002
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    issuerBaseURL: process.env.ISSUER_BASE_URL, // https://dev-qz3y2u01jd2ul3ok.us.auth0.com
    secret: process.env.SECRET, // string larga compartida por el equipo
    routes: { callback: '/auth/auth0/callback' },
    authorizationParams: {
      response_type: 'code',
      response_mode: 'query',
      scope: 'openid profile email',
    },
  };

  return auth(config);
}
