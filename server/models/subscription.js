const mongoose = require('mongoose')

const subscriptionSchema = mongoose.Schema({
    endpoint: String,
    expirationTime: String,
    keys: {
        p256dh: String,
        auth: String
    },
    user:{type: mongoose.Schema.Types.ObjectId, ref:'User'}
})

module.exports = mongoose.model('Subscription', subscriptionSchema)