const express = require('express');
require('dotenv').config();
const sequelize = require('./sequelize');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const bcrypt = require('bcrypt');
const userTable = require('./userModel')
sequelize.sync({ force: true });

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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    userTable.create({
      email,
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).send();
  }
});


// update user
app.put('/v1/user/self', checkDatabaseConnection, validateUserInput, async (request, res) => {
  const authHeader = request.headers.authorization || '';
  const base64Credentials = authHeader.split(' ')[1] || '';
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');

  try {
    const user = await userTable.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send();
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).send();
    }

    const { firstName, lastName, newPassword } = request.body;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (newPassword) user.password = await bcrypt.hash(newPassword, 10); 
    
    await user.save();

    res.status(204).send();
  } catch (error) {
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
    res.status(400).send();
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running server on port ${PORT}.`);
});
