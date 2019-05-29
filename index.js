const express = require('express');

const router = require('./serverRouter.js')

const server = express();

server.use(express.json());

server.use('/api/posts', router)

server.listen(6000, () => {
    console.log('Listening On Port 6000')
})