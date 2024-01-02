const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const cors = require('cors')
const app = express();
app.use(cors())
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
app.get('', async (req, res) => {
    res.sendFile(join(__dirname, 'index.html'))
    io.on('connection', (socket) => {
        console.log(`New user is connected ${socket.id}`)
    })

})


io.on('connection', (socket) => {
    console.log(`New user is connected ${socket.id}`)
})




app.listen(3300, () => {
    console.log('Server is running on PORT 3300')
})