import * as jsonwebtoken from 'jsonwebtoken';

export const login = async (id: number) => {
  const payload = {
    id: id,
    name: 'max',
  };

  // Sign the jsonwebtoken token
  const authToken =
    'Bearer ' +
    jsonwebtoken.sign(payload, process.env.JWT_KEY!, {
      expiresIn: 604800,
    });

  return authToken;
};
