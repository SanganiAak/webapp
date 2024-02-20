const supertest = require('supertest');
const app = require('./app');
const sequelize = require('./sequelize');
const request = supertest(app);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close(); 
});

describe('User API Integration Tests', () => {
  let authHeader;
  const userData = {
    email: 'test@example.com',
    password: 'Password@123',
    firstName: 'Test',
    lastName: 'User',
  };
  authHeader = `Basic ${Buffer.from(`${userData.email}:${userData.password}`).toString('base64')}`;


  test('Test 1 - Create an account, and using the GET call, validate account exists', async () => {


    let response = await request.post('/v1/user').send(userData);
    expect(response.status).toBe(201);
    expect(response.body.email).toEqual(userData.email);

    response = await request.get('/v1/user/self')
                            .set('Authorization', authHeader);
    expect(response.status).toBe(200);
    expect(response.body.email).toEqual(userData.email);
  });

  test('Test 2 - Update the account and using the GET call, validate the account was updated', async () => {
    const updateData = {
      email: "test@example.com",
      firstName: 'Updated',
      lastName: 'User',
      password: "Password@123"
    };
    console.log(authHeader + " before put failed")
    let response = await request.put('/v1/user/self')
                                .set('Authorization', authHeader)
                                .send(updateData);
    console.log(response.status + "  put failed")
    expect(response.status).toBe(200);

    response = await request.get('/v1/user/self')
                            .set('Authorization', authHeader);
    console.log(response.status + "  puts get failed")
    expect(response.status).toBe(200);
    expect(response.body.firstName).toEqual(updateData.firstName);
    expect(response.body.lastName).toEqual(updateData.lastName);

  });
});


//  comments for review