import {Schema, model} from 'mongoose'

const chatSchema = new Schema({
    message: {type: String, trim: true},
    clientId: {type: String, trim: true},
    writer: {type: String, trim: true}
})
export const chatModel = model('chat', chatSchema)
