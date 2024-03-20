const express = require('express');
require('dotenv').config();
const sequelize = require('./sequelize');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const bcrypt = require('bcrypt');
const userTable = require('./userModel')
sequelize.sync({ force: true });
const logger = require('./logger'); 

async function checkDatabaseConnection(req, res, next) {
  try {
    await sequelize.authenticate();
    next();
  } catch (error) {
    res.status(503).send();
  }
}

function validateUserInput(req, res, next) {
  const { email, password } = req.body;
  // email example 'abc@efg.com'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
  // password example 'Abcd@123 lowercase letter, uppercase letter, digit, special character, minimum 8 characters'
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  if (!email || !emailRegex.test(email)) {
    return res.status(400).send();
  }
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).send();
  }
  next(); 
}


app.all('/healthz', async (request, response) => {
    if (request.method !== 'GET') {
        response.status(405).send();
        return;
    }
    if (Object.keys(request.body).length > 0 ) {
        response.status(400).send();
        return;
    }
    try {
        await sequelize.authenticate();
        response.setHeader('Cache-Control', 'no-cache');
        logger.info("healthz successfull")
        response.status(200).send();
    } catch (error) {
        response.setHeader('Cache-Control', 'no-cache');
        response.status(503).send();
    }
});

// create user
app.post('/v1/user', checkDatabaseConnection, validateUserInput, async (request, res) => {
  const { email, password, firstName, lastName } = request.body;
  
  try {
    const existingUser = await userTable.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send();
    }

    const newUser = await userTable.create({
      email,
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName
    });

    const { password: _, ...userDetails } = newUser.toJSON();
    res.status(201).json(userDetails);
  } catch (error) {
    res.status(400).send();
  }
});


// update user
app.put('/v1/user/self', checkDatabaseConnection, validateUserInput, async (request, res) => {
  const { firstName, lastName, password } = request.body;
  const authHeader = request.headers.authorization || '';
  const base64Credentials = authHeader.split(' ')[1] || '';
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, Authpassword] = credentials.split(':');

  try {
    const user = await userTable.findOne({ where: { email } });
    if (!user) {
      logger.error("username not found");
      return res.status(400).send();
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(Authpassword, user.password);
    if (!passwordMatch) {
      logger.error("password not matching");
      return res.status(400).send();
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();

    const { password: _, ...userDetails } = user.toJSON();
      res.status(200).json(userDetails);
  } catch (error) {
    logger.error("other errors");
    res.status(400).send();
  }
});

// get user
app.get('/v1/user/self', checkDatabaseConnection, async (request, res) => {
    const authHeader = request.headers.authorization || '';
    const base64Credentials = authHeader.split(' ')[1] || '';
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
  
    try {
      const user = await userTable.findOne({ where: { email } });
      if (!user) {
        return res.status(400).send();
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).send();
      }
  
      const { password: _, ...userDetails } = user.toJSON();
      res.status(200).json(userDetails);
    } catch (error) {
        res.status(400).send();
    }
  });
  

app.use('*', (request, res) => {
    logger.info("ultimate error");
    res.status(400).send();
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Running server on port ${PORT}.`);
});

module.exports = app; 
