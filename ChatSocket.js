const socket = require('socket.io')
const express = require('express')
const { join } = require('node:path');
const {createServer} = require('node:http')
const {Server} = require('socket.io')
const Router = express()
const server = createServer(Router)
const io = new Server(server)
Router.get('/',async(req,res)=>{
    res.sendFile(join(__dirname,'index.html'))
})

io.on('connection',(socket)=>{
    console.log("New User is connected")
})

Router.listen(3300,()=>{
    console.log('Server is running on PORT 3300')
})
// module.exports = Router;