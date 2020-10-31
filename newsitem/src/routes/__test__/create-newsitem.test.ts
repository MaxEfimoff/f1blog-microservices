import request from 'supertest';
import { app } from '../../app';
import { login } from './helpers/login';
import { natsWrapper } from '../../nats-wrapper';

it('returns 201 if newsitem created', async () => {
  const token = await login();

  return request(app)
    .post('/api/v1/newsitems/')
    .set('Authorization', token)
    .send({
      title: 'bfgbdfgnbdfbgdfgndfngdfgndfgndfgnd',
      text:
        'hsrthrjtbjhbrstkjhbgsjrbtgjblhtbhlsbhgltbhglrsbtlhjbsrlthgsrhjtbhgldrbtlhjbdrtlbhdltrjhbljkdrtbhljbdltybhhsrthrjtbjhbrstkjhbgsjrbtgjblhtbhlsbhgltbhglrsbtlhjbsrlthgsrhjtbhgldrbtlhjbdrtlbhdltrjhbljkdrtbhljbdltybhjdljkbyhldkjbhlkdjbtjdljkbyhldkjbhlkdjbt',
    })
    .expect(201);
});

it('publishes an event', async () => {
  const token = await login();

  await request(app)
    .post('/api/v1/newsitems/')
    .set('Authorization', token)
    .send({
      title: '1bfgbdfgnbdfbgdfgndfngdfgndfgndfgnd',
      text:
        '2hsrthrjtbjhbrstkjhbgsjrbtgjblhtbhlsbhgltbhglrsbtlhjbsrlthgsrhjtbhgldrbtlhjbdrtlbhdltrjhbljkdrtbhljbdltybhhsrthrjtbjhbrstkjhbgsjrbtgjblhtbhlsbhgltbhglrsbtlhjbsrlthgsrhjtbhgldrbtlhjbdrtlbhdltrjhbljkdrtbhljbdltybhjdljkbyhldkjbhlkdjbtjdljkbyhldkjbhlkdjbt',
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
