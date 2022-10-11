import {Schema, model} from 'mongoose'

const wordScheme = new Schema({
    _id:{type:String,trim:true},
    word: {type: String, trim: true},
    translate: {type: String, trim: true},
    description: {type: String, trim: true},
    added:{type: String, trim: true},
})

const authSchema = new Schema({
    created: {type: String, required: true, trim: true},
    verify: {type: Number, default: 0, trim: true},
    auth: {type: Number, default: 0, trim: true},
    email: {type: String, required: true, trim: true},
    password: {type: String, required: true, trim: true},
    profile: {
        firstName: {type: String, required: true, trim: true},
        lastName: {type: String, required: true, trim: true},
        words: {
            a: [wordScheme],
            b: {type: Array, trim: true},
            c: {type: Array, trim: true},
            d: {type: Array, trim: true},
            e: {type: Array, trim: true},
            f: {type: Array, trim: true},
            g: {type: Array, trim: true},
            i: {type: Array, trim: true},
            j: {type: Array, trim: true},
            k: {type: Array, trim: true},
            l: {type: Array, trim: true},
            m: {type: Array, trim: true},
            n: {type: Array, trim: true},
            o: {type: Array, trim: true},
            p: {type: Array, trim: true},
            q: {type: Array, trim: true},
            r: {type: Array, trim: true},
            s: {type: Array, trim: true},
            t: {type: Array, trim: true},
            u: {type: Array, trim: true},
            v: {type: Array, trim: true},
            w: {type: Array, trim: true},
            x: {type: Array, trim: true},
            y: {type: Array, trim: true},
            z: {type: Array, trim: true},
            total: 0,
        },
    },
})
export const authModel = model('accounts', authSchema)
