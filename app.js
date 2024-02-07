const express = require('express');
require('dotenv').config();
const sequelize = require('./sequelize');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const bcrypt = require('bcrypt');
const userTable = require('./userModel')
sequelize.sync({ force: true });

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
app.post('/v1/user', async (request, res) => {
  const { email, password, firstName, lastName } = request.body;

  try {
    const existingUser = await userTable.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with the email address already exists.' });
    }

    const newUser = await userTable.create({
      email,
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName
    });

    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error creating the user.', error: error.message });
  }
});


// update user
app.put('/v1/user/self', async (request, res) => {
  const authHeader = request.headers.authorization || '';
  const base64Credentials = authHeader.split(' ')[1] || '';
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');

  try {
    const user = await userTable.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    console.log("user value in" + user)

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed.' });
    }
    console.log("password matching done")

    const { firstName, lastName, newPassword } = request.body;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (newPassword) user.password = await bcrypt.hash(newPassword, 10); 
    
    await user.save();

    const { password: _, ...updatedUserDetails } = user.toJSON();
    res.json(updatedUserDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user information.', error: error.message });
  }
});

// get user
app.get('/v1/user/self', async (request, res) => {
    const authHeader = request.headers.authorization || '';
    const base64Credentials = authHeader.split(' ')[1] || '';
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
  
    try {
      const user = await userTable.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Authentication failed.' });
      }
      console.log("password match is happening")
  
      const { password: _, ...userDetails } = user.toJSON();
      res.json(userDetails);
    } catch (error) {
        console.log("came to catch")
      res.status(500).json({ message: 'Error getting user information.', error: error.message });
    }
  });
  

app.use('*', (request, res) => {
    res.status(400).send();
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running server on port ${PORT}.`);
});
