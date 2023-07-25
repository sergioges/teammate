import jwt_decode from 'jwt-decode'

export function isAuthenticated() {
  const token = sessionStorage.getItem('chatgpt-token');

  if (token) {
      try {
          const decoded = jwt_decode(token);
          const currentTime = Date.now() / 1000;

          return decoded.exp > currentTime;
      } catch (error) {
          return false; // Si ocurre algún error al decodificar el token, se considera inválido
      }
  }

  return false;
}