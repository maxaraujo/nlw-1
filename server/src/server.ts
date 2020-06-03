import express from 'express';

const app = express();

app.get('/user', (request, response) => {
    console.log('Listagem de usuáriso');

    response.send('Olá internet!');
})

app.listen('3333');