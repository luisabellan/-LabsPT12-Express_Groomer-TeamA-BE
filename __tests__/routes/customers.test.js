const request = require('supertest');
const express = require('express');
const Customers = require('../../api/customers/customersModel');
const customersRouter = require('../../api/customers/customersRouter');
const server = express();
server.use(express.json());

jest.mock('../../api/customers/customersModel');
// mock the auth middleware completely
jest.mock('../../api/middleware/authRequired', () =>
  jest.fn((req, res, next) => next())
);

describe('customers router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use('/customers', customersRouter);
    jest.clearAllMocks();
  });

  describe('GET /customers', () => {
    it('should return 200', async () => {
      Customers.findAll.mockResolvedValue([]);
      const res = await request(server).get('/customers');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
      expect(Customers.findAll.mock.calls.length).toBe(1);
    });
  });

  describe('GET /customers/:id', () => {
    it('should return 200 when profile found', async () => {
      Customers.findById.mockResolvedValue({
        id: 1,
        name: 'Louie',
        lastname: 'Smith',
        description: 'fdasdfasdfas fasd asdf as ',
        address: '23 Hellen Rd',
        zip: '23442552',
        phone: '3453556636',
        email: 'louie@example.com',
        city: 'Atlanta',
        state: 'Georgia',
        country: 'USA',
        photo_url: 'https://someplace.com/pic.jpg',
        walk_rate: '1200',
        day_care_rate: '14000',
        vet_visit_rate: '1200',
      });
      const res = await request(server).get('/customers/1');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Louie');
      expect(res.body.lastname).toBe('Smith');
      expect(res.body.address).toBe('23 Hellen Rd');
      expect(res.body.zip).toBe('23442552');
      expect(res.body.phone).toBe('3453556636');
      expect(res.body.city).toBe('Atlanta');
      expect(res.body.state).toBe('Georgia');
      expect(res.body.country).toBe('USA');
      expect(res.body.photo_url).toBe('https://someplace.com/pic.jpg');
      expect(res.body.walk_rate).toBe('1200');
      expect(res.body.day_care_rate).toBe('14000');
      expect(res.body.vet_visit_rate).toBe('1200');
      expect(Customers.findById.mock.calls.length).toBe(1);
    });

    it('should return 404 when no user found', async () => {
      Customers.findById.mockResolvedValue();
      const res = await request(server).get('/customers/1');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('the customer with that id does not exist');
    });
  });

  describe('POST /customers', () => {
    it('should return 201 when profile is created', async () => {
      const customer = {
        oktaId: null,
        name: 'John',
        lastname: 'Doe',
        description: 'fdasdfasdfas fasd asdf as',
        address: '2 Cassiopeia Rd',
        zip: '23485552',
        phone: '3453796636',
        email: 'john@example.com',
        city: 'Atlanta',
        state: 'Georgia',
        country: 'USA',
        photo_url: 'https://someplace.com/pic.jpg',
      };
      Customers.findById.mockResolvedValue(undefined);
      Customers.create.mockResolvedValue([
        Object.assign({ id: '1000' }, customer),
      ]);
      const res = await request(server).post('/customers').send(customer);

      expect(res.status).toBe(201);
      expect(res.body.id).toBe('1000');
      expect(Customers.create.mock.calls.length).toBe(1);
    });
  });

  describe('PUT /customers', () => {
    it('should return 200 when profile is created', async () => {
      Customers.findById.mockResolvedValue({
        id: 1,
        name: 'Louie',
        lastname: 'Smith',
        description: 'fdasdfasdfas fasd asdf as ',
        address: '23 Hellen Rd',
        zip: '23442552',
        phone: '3453556636',
        email: 'louie@example.com',
        city: 'Atlanta',
        state: 'Georgia',
        country: 'USA',
        photo_url: 'https://someplace.com/pic.jpg',
      });
      const customer = {
        name: 'OtherName',
      };
      Customers.findById.mockResolvedValue(customer);
      Customers.update.mockResolvedValue([customer]);

      const res = await request(server).put('/customers/1').send(customer);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('OtherName');
      expect(Customers.update.mock.calls.length).toBe(1);
    });
  });
});

const request = require('supertest');
const express = require('express');
const Profiles = require('../../api/customer/customerModel');
const profileRouter = require('../../api/customer/customerRouter');
const server = express();
server.use(express.json());

jest.mock('../../api/profile/profileModel');
// mock the auth middleware completely
jest.mock('../../api/middleware/authRequired', () =>
  jest.fn((req, res, next) => next())
);

describe('customers router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use(['/profile', '/customers'], profileRouter);
    jest.clearAllMocks();
  });

  describe('GET /customers', () => {
    it('should return 200', async () => {
      Profiles.findAll.mockResolvedValue([]);
      const res = await request(server).get('/customers');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
      expect(Profiles.findAll.mock.calls.length).toBe(1);
    });
  });

  describe('GET /customers/:id', () => {
    it('should return 200 when profile found', async () => {
      Profiles.findById.mockResolvedValue({
        id: '1',
        description: 'sadfasdfasdfasdf asdfasdfasd asdfasd asdfasdfsdf',
        name: 'Bob',
        lastname: 'Smith',
        address: '23 Martha Smith',
        zip: '234234',
        phone: '4355252345',
        email: 'bob@example.com',
        city: 'Atlanta',
        state: 'Georgia',
        country: 'USA',
        photo_url: 'somewhere.com/photo.jpg',
      });
      const res = await request(server).get('/customers/1');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Bob');
      expect(Profiles.findById.mock.calls.length).toBe(1);
    });

    it('should return 404 when no user found', async () => {
      Profiles.findById.mockResolvedValue();
      const res = await request(server).get('/customers/1');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('ProfileNotFound');
    });
  });

  describe('POST /profile', () => {
    it('should return 200 when profile is created', async () => {
      const profile = {
        name: 'Louie',
        lastname: 'Smith',
        email: 'louie@example.com',
        photo_url:
          'https://s3.amazonaws.com/uifaces/faces/twitter/hermanobrother/128.jpg',
      };
      Profiles.findById.mockResolvedValue(undefined);
      Profiles.create.mockResolvedValue([
        Object.assign({ id: 'd376de0577681ca93614' }, profile),
      ]);
      const res = await request(server).post('/profile').send(profile);

      expect(res.status).toBe(200);
      expect(res.body.profile.id).toBe('d376de0577681ca93614');
      expect(Profiles.create.mock.calls.length).toBe(1);
    });
  });

  describe('PUT /profile', () => {
    it('should return 200 when profile is created', async () => {
      const profile = {
        id: 'd376de0577681ca93614',
        name: 'Louie',
        lastName: 'Smith',
        email: 'louie@example.com',
        photo_url:
          'https://s3.amazonaws.com/uifaces/faces/twitter/hermanobrother/128.jpg',
      };
      Profiles.findById.mockResolvedValue(profile);
      Profiles.update.mockResolvedValue([profile]);

      const res = await request(server).put('/profile/').send(profile);
      expect(res.status).toBe(200);
      expect(res.body.profile.name).toBe('Louie');
      expect(res.body.profile.lastname).toBe('Smith');
      expect(Profiles.update.mock.calls.length).toBe(1);
    });
  });
});
