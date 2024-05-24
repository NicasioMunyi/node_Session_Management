const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const app = express();

const secretKey = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());

function isAuthenticated(req, res, next) {
    if (req.session.isLoggedIn) {
        return next();
    } else {
        return res.status(401).send("You need to log in first");
    }
}

app.post('/login', (req, res) => {
    const { user, pass } = req.body;
    if (!user || !pass) {
        return res.status(400).send({ message: 'All fields are required' });
    }
    if (user === 'nick' && pass === "12345") {
        req.session.isLoggedIn = true;
        return res.send("Logged In");
    } else {
        return res.status(401).send("Wrong login credentials");
    }
});

app.get('/', (req, res) => {
    res.send("Welcome to my session API");
});

app.get("/protected", isAuthenticated, (req, res) => {
    res.send('This is a protected resource');
});

app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
