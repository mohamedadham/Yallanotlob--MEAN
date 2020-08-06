const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email required"]
    },
    password: {
        type: String,
        minlength: 8,
        required: [true, "Password is required"]
    },
    image: {
        type: String,
        required: true,
    },
    friends: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            unique: true,
            required: true,
            ref:'User'
        },
        name: {
            type: String,
            required: true
        }
    }],
    notifications:[
        {
            type: {type: String},
            read: { type: Boolean, default: false },
            order: { type: mongoose.Schema.Types.ObjectId, ref:'Order'},
            createdAt: { type: Date, default: Date.now() }
        }
    ],
})

userSchema.pre('save', function (next) {
    const salt = bcrypt.genSaltSync();
    const user = this;
    user.password = bcrypt.hashSync(user.password, salt)
    next()
})

module.exports = mongoose.model("User", userSchema)