
const express = require('express');
const auth = require('./auth');     //ferno mesa ta routes mou
const volleyball = require('volleyball');
const port = 1337;
const app = express(); //kano neo express mesa sto variable app


app.use(volleyball);
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome 👽 ');
});


app.use('/auth', auth);      //xriazome to path pou ine /auth k meta pernao to object pou ine auth

app.listen(port, () => console.log(`server listening on port ${port} 👽`));
