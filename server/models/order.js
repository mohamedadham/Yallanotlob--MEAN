
const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    restaurantName: { type: String, required: true },
    menuImage: { type: String, required: true },
    status: { type: String, enum: ['waiting', 'finished', 'cancelled'], default: "waiting", required: true },
    mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner'], required: true },
    orderOwner: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'User'},
    for: [{
        member: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'User' },
        status: { type: String, enum: ['pending', 'joined', 'rejected'], default: "pending" },
    }],
    membersJoined: { type: Number, default:0 },
    items: [
        {
            item: { type: String, required: true },
            amount: { type: Number, required: true },
            price: { type: Number, required: true },
            comment: { type: String },
            user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
        }
    ],
    createdAt: { type: Date, default: Date.now() }

})

module.exports = mongoose.model('Order', orderSchema)