import express from "express";
import cors from "cors";
import http from "http";
import {Server} from "socket.io";
import mongoose from "mongoose";
import {chatModel} from "./chatScheme";

const socketIoServer = express()
socketIoServer.use(cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true
}))
socketIoServer.get('/', (req, res) => {
    res.send('This is Socket.io!')
})

export const server = http.createServer(socketIoServer)
const io = new Server(server, {
    cors: {
        origin: 'http://127.0.0.1:5173',
        credentials: true
    },
})
let writers = []
let onlineClients = 0

io.on('connection', (async (socket) => {
    onlineClients++
    try {
        await mongoose.connect(process.env.DB_URL)
    } catch (err) {
        io.disconnectSockets(true)
    }
    io.emit('incUsers', onlineClients)
    socket.on('writer', (writer) => {
        writers.push(writer)
        io.emit('writers', writers)
    })
    socket.on('cleanWriter', (data) => {
        writers = writers.filter(item => item.socketID !== data.socketID)
        io.emit('writers', writers)
    })
    socket.on('message', async (data) => {
        const chat = await chatModel.find()
        const newChat = new chatModel({message: data.text, clientId: data.email, writer: data.writer});
        await newChat.save();
        writers = writers.filter(item => item.socketID !== data.email)
        io.emit("clientMessages", [...chat, {message: data.text, clientId: data.email, writer: data.writer}])
        io.emit('writers', writers)
    })
    socket.on('disconnect', () => {
        onlineClients--
        io.emit('decrUsers', onlineClients)
    })
}))
