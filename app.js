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
const {PubSub} = require('@google-cloud/pubsub');
const { v4: uuidv4 } = require('uuid');

// Instantiates a client
const pubSubClient = new PubSub();

async function publishMessage(data) {
  const topicName = 'verify_email';

  const dataBuffer = Buffer.from(JSON.stringify(data));

  try {
    const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
    logger.info(`Message ${messageId} published.`);
  } catch (error) {
    logger.error(`Received error while publishing: ${error.message}`);
    throw new Error('PubSub publish error');
  }
}

async function checkDatabaseConnection(req, res, next) {
  try {
    await sequelize.authenticate();
    logger.debug("Database connection successfully verified.");
    next();
  } catch (error) {
    logger.error("Database connection failed: " + error.message);
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
    logger.warn(`Invalid email provided: ${email}`);
    return res.status(400).send();
  }
  if (!password || !passwordRegex.test(password)) {
    logger.warn("Invalid password provided.");
    return res.status(400).send();
  }
  logger.debug("User input validation passed.");
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
      logger.warn(`Attempt to create a duplicate user: ${email}`);
      return res.status(400).send();
    }
    
    const verificationToken = uuidv4();

    const newUser = await userTable.create({
      email,
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName,
      verificationToken,
      isVerified: process.env.NODE_ENV === 'test'
    });

    const { password: _, ...userDetails } = newUser.toJSON();
    const responseUserDetails = {
      id: userDetails.id,
      email: userDetails.email,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      accountCreated: userDetails.accountCreated,
      accountUpdated: userDetails.accountUpdated
    };
    logger.info(`Added new user: ${email}`);

    const environment = process.env.NODE_ENV || 'development';
    if (environment === 'development') {
      await publishMessage({
        email,
        firstName,
        lastName,
        verificationToken
      });
      logger.debug(`mailing request executed for user : ${email}`);
    }

    res.status(201).json(responseUserDetails);
  } catch (error) {
    logger.error("Failed to create user: " + error.message);
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
      logger.error(`username not found : ${email}`);
      return res.status(400).send();
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(Authpassword, user.password);
    if (!passwordMatch) {
      logger.error(`password not matching for user : ${email}`);
      return res.status(400).send();
    }

    if(!user.isVerified){
      logger.error(`email not verified : ${email}`);
      return res.status(400).send();
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();

    const { password: _, ...userDetails } = user.toJSON();
    const responseUserDetails = {
      id: userDetails.id,
      email: userDetails.email,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      accountCreated: userDetails.accountCreated,
      accountUpdated: userDetails.accountUpdated
    };

    logger.info(`User updated: ${user.email}`);
    res.status(204).json();
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);
    res.status(401).send();
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
  
      if(!user.isVerified){
        logger.error("email not verified");
        return res.status(400).send();
      }

      const { password: _, ...userDetails } = user.toJSON();
      const responseUserDetails = {
        id: userDetails.id,
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        accountCreated: userDetails.accountCreated,
        accountUpdated: userDetails.accountUpdated
      };

      logger.debug(`User data retrieved: ${user.email}`);
      res.status(200).json(responseUserDetails);
    } catch (error) {
        logger.error("Failed to retrieve user: " + error.message);
        res.status(400).send();
    }
  });

  app.get('/verify', async (req, res) => {
    const { verificationToken } = req.query;
    if (!verificationToken) {
      logger.error("invalid token");
      return res.status(400).send('invalid token');
    }
    try {
      const user = await userTable.findOne({
        where: { verificationToken: verificationToken }
      });
      if (!user) {
        logger.error("User not found.");
        return res.status(404).send('User not found.');
      }
      let message = 'Email is already verified.';
      if (!user.isVerified && new Date() < user.verificationTokenExpiration) {
        user.isVerified = true;
        message = 'Email successfully verified.';
      } else if (!user.isVerified) {
        message = 'The link has expired.';
      }
      await user.update({
        isVerified: user.isVerified,
        verificationClickCount: user.verificationClickCount + 1
      });
      logger.debug(message);
      res.status(200).send(message);
    } catch (error) {
      logger.error(`Failed to verify email: ${error.message}`);
      res.status(500).send('Failed to verify email.');
    }
  });
  

app.use('*', (request, res) => {
  logger.warn("Request to an undefined route: " + request.path);
  res.status(400).send();
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Running server on port ${PORT}.`);
});

module.exports = app; 
