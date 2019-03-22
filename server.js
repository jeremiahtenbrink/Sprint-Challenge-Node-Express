const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const cors = require('cors');

const projectRouter = require('./routers/project-router');
const actionRouter = require('./routers/action-router');

const server = express();
server.use(cors());
server.use(helmet());

server.use(express.json()); // built-in, no need to yarn add

// routing
server.use('/projects', projectRouter);
server.use('/actions', actionRouter);

// route handlers ARE middleware
server.get('/', (req, res) => {
    res.send(` <h1>Yup, it works.</h1>`);
});

module.exports = server;
