const express = require('express');
const cookieParser = require('cookie-parser');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const client_id = process.env.CLIENT_ID;
const client = new OAuth2Client(client_id);
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());

const verify = async function (idToken) {
    const ticket = await client.verifyIdToken({ idToken });
    return ticket.getPayload();
};

app.get('/', (req, res) => {
    res.render('login', { client_id });
});

app.post('/', (req, res) => {
    let { token } = req.body;

    verify(token)
        .then(() => {
            res.cookie('session-token', token);
            res.send('Success')
        });
});

app.get('/profile', (req, res) => {
    let token = req.cookies['session-token'];
    verify(token).then((user) => {
        console.log(user);
        res.render('profile', { user });
    });
});

app.listen(port, console.log(`running on port ${port}`));