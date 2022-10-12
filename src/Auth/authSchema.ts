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
            b: [wordScheme],
            c: [wordScheme],
            d: [wordScheme],
            e: [wordScheme],
            f: [wordScheme],
            g: [wordScheme],
            i: [wordScheme],
            j: [wordScheme],
            k: [wordScheme],
            l: [wordScheme],
            m: [wordScheme],
            n: [wordScheme],
            o: [wordScheme],
            p: [wordScheme],
            q: [wordScheme],
            r: [wordScheme],
            s: [wordScheme],
            t: [wordScheme],
            u: [wordScheme],
            v: [wordScheme],
            w: [wordScheme],
            x: [wordScheme],
            y: [wordScheme],
            z: [wordScheme],
        },
        totalWords:{type:Number,trim:true,default:0}
    },
})
export const authModel = model('accounts', authSchema)
