import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publilsher connected to NATS');

  const data = JSON.stringify({
    id: '487',
    name: 'vfvfvf',
    email: '9969',
  });

  stan.publish('user:created', data, () => {
    console.log('Event published');
  });
});
