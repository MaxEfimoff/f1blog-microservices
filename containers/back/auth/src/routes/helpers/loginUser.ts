import jsonwebtoken from 'jsonwebtoken';

interface Payload {
  id: string;
  name: string;
}

const loginUser = () => {
  const payload: Payload = {
    id: '5dd96782fd4aeb0a2444fab1',
    name: 'Max',
  };

  const token =
    'Bearer ' +
    // jsonwebtoken.sign(payload, keys.secretOrKey, { expiresIn: 604800 });
    jsonwebtoken.sign(payload, "secret", { expiresIn: 604800 });

  return token;
};

export { loginUser };
