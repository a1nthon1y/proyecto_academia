const environment = {
  url_backend: 'http://localhost:4000',
  auth: {
    tokenKey: 'auth_token',
    userKey: 'auth_user',
    expirationHours: 8 // Debe coincidir con el backend
  }
};

export default environment; 