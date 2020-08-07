const OrderModel = require('../models/order')
const GroupModel = require('../models/group')
const subscriptionsModel = require('../models/subscription')
const userModel = require('../models/user')
const webpush = require('web-push');


const paginate = require('jw-paginate');

const sendNotification = async (user, order, notificationPayload) => {


    const allSubscriptions = await subscriptionsModel.find({ user }).exec()
    console.log('Total subscriptions', allSubscriptions.length);


    const orderOwner = await userModel.findOne({ _id: order.orderOwner }).select('name').exec()
    Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
        sub, JSON.stringify(notificationPayload))
    ))
        .then(() => console.log('Notification sent successfully.'))
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
        });
}

exports.getOrders = async (req, res) => {
    try {
        const { userId } = req.session
        const totalItems = await OrderModel.find({ $or: [{ orderOwner: userId }, { "for.member": userId }] }).countDocuments().exec()

        // get page from query params or default to first page
        const page = parseInt(req.query.page) || 1;

        // get pager object for specified page
        const pageSize = 8;
        const pager = paginate(totalItems, page, pageSize);
        // pageSize * (page - 1)
        const orders = await OrderModel.find({ $or: [{ orderOwner: userId }, { "for.member": userId, "for.status": { "$ne": "rejected" } }] }, null, {sort: { 'createdAt' : -1 }, skip: pager.startIndex, limit: pageSize })

        // return pager object and current page of items
        return res.json({ pager, orders });

    } catch (err) {
        res.status(400).json({ message: err.message })

    }
}

exports.getLatestOrder= async(req,res)=>{

    try{
        const {userId} = req.session
        const orders = await OrderModel.find({ $or: [{ orderOwner: userId }, { "for.member": userId, "for.status": { "$ne": "rejected" } }] }, null, { limit: 5 })
        return res.json(orders);
    }catch(err){
        res.status(400).json({ message: err.message })
    }

}

exports.makeOrder = async (req, res) => {
    const { restaurantName, menuImage, mealType, friends, groupId } = req.body;
    const { userId } = req.session;

    try {
        let order
        if (friends || !groupId) {
            order = await OrderModel.create({
                restaurantName,
                menuImage,
                mealType,
                orderOwner: userId,
                for: friends,
            })
        }
        else if (groupId) {

            const group = await GroupModel.findById(groupId).exec()
            const friendsIds = group.members.map(member => { return { member: member._id } }) || []
            order = await OrderModel.create({
                restaurantName,
                menuImage,
                mealType,
                orderOwner: userId,
                for: friendsIds,
            })
        }
        await order.save();

        console.log(userId)
        const orderOwner= await userModel.findOne({ _id: userId }).select('name').exec()
        console.log(orderOwner)
        const notificationPayload = {
            "notification": {
                "title": "New order",
                "body": `${orderOwner.name} Invited you to his order`,
                "vibrate": [100, 50, 100],
                "data": {
                    "dateOfArrival": Date.now(),
                    "primaryKey": 1
                },
                "actions": [{
                    "action": "explore",
                    "title": "Go to the site"
                }]
            }
        };

        order.for.forEach(async (user) => {
            await userModel.updateOne({ _id: user.member }, { "$push": { notifications: { type: "invitation", order: order._id } } })
            sendNotification(user.member, order, notificationPayload)
        })

        res.status(200).json({ message: 'Order placed Successfully' })


    } catch (err) {
        res.status(404).json({ message: err.message })
    }


}

exports.getOrder = async (req, res) => {
    const { orderId } = req.params
    const { userId } = req.session
    try {
        let order = await OrderModel.findOne({ $or: [{ _id: orderId, orderOwner: userId }, { _id: orderId, "for.member": userId }] })
            .populate('items.user', 'name').exec()
        if (order) return res.status(200).json({ order })
        return res.status(404).json({ error: "Order Not Found" })

    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

exports.cancelOrder = async (req, res) => {
    const { orderId } = req.params;
    const { userId } = req.session
    try {
        let order = await OrderModel.findById(orderId).exec();
        if (order.status === "waiting") {
            order = await OrderModel.updateOne({ _id: orderId, orderOwner: userId }, { status: "cancelled" }, { new: true }).exec();
            if (order.nModified > 0) return res.status(200).json({ message: "Order Cancelled" })
        }
        res.status(404).json({ error: "Could not cancel the order" })

    } catch (err) {
        res.status(404).json({ message: err.message })

    }
}

exports.finishOrder = async (req, res) => {
    const { orderId } = req.params;
    const { userId } = req.session

    try {
        let order = await OrderModel.findById(orderId).exec();
        if (order.status === "waiting") {
            order = await OrderModel.updateOne({ _id: orderId, orderOwner: userId }, { status: "finished" }, { new: true }).exec();
            if (order.nModified > 0) return res.status(200).json({ message: "Order finished" })
        }
        res.status(400).json({ message: "Could not finish the order" })

    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message })

    }
}

exports.addItem = async (req, res) => {
    const { item, amount, price, comment } = req.body;
    const { userId } = req.session
    const { orderId } = req.params
    console.log(item, amount, price)
    try {

        const order = await OrderModel.findOne({ $or: [{ _id: orderId, orderOwner: userId }, { _id: orderId, 'for.member': userId }] })

        console.log(order)
        if (!order) return res.status(404).json({ error: "Could not find the order" });
        if (order.status === "cancelled" || order.status === "finished") return res.status(400).json({ message: "Order is not available" });

        //check if the user joined the order or not
        if (!String(order.orderOwner) !== String(orderId)) {
            for (let i = 0; i < order.for.length; i++) {
                if (String(order.for[i].member) === String(userId) && order.for[i].status !== "joined")
                    return res.status(404).json({ message: "Please Join the order first" });
            }
        }

        await OrderModel.updateOne({
            $or: [{ _id: orderId, orderOwner: userId }, { _id: orderId, 'for.member': userId }]
        },
            {
                $push: { items: { item, amount, price, comment, user: userId } }
            }
        )
        return res.status(200).json({ message: "Item is added" });


    } catch (err) {
        res.status(400).json({ message: err.message })
    }

}

exports.removeItem = async (req, res) => {
    const { userId } = req.session;
    const { orderId, itemId } = req.params

    try {
        const result = await OrderModel.updateOne({ _id: orderId, 'items._id': itemId, 'items.user': userId },
            { "$pull": { "items": { _id: itemId } } })
        if (result.nModified != 1) return res.status(400).json({ message: "Could not remove the Item" });

        return res.status(200).json({ message: "Item is removed" });

    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message })
    }
}

exports.acceptOrder = async (req, res) => {
    const { userId } = req.session;
    const { orderId } = req.params
    try {
        const result = await OrderModel.updateOne({ _id: orderId, 'for.member': userId }, { '$set': { 'for.$.status': 'joined' } })
        if (result.nModified != 1) return res.status(400).json({ message: "Could not accept the order" });

        const order=  await OrderModel.findOne({ _id: orderId, 'for.member': userId }).exec()

        await userModel.updateOne({ _id: order.orderOwner }, { "$push": { notifications: { type: "acceptInvitation", order: order._id } } })
        

        const member= await userModel.findOne({ _id: userId }).select('name').exec()

        const notificationPayload = {
            "notification": {
                "title": "New Memeber",
                "body": `${member.name} accepted your order`,
                "vibrate": [100, 50, 100],
                "data": {
                    "dateOfArrival": Date.now(),
                    "primaryKey": 1
                },
                "actions": [{
                    "action": "explore",
                    "title": "Go to the site"
                }]
            }
        };
        sendNotification(userId, order, notificationPayload)

        await OrderModel.updateOne({ _id: orderId, 'for.member': userId }, { '$inc': { membersJoined: 1 } })
        return res.status(200).json({ message: "Order is accepted" });

    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message })
    }
}

exports.rejectOrder = async (req, res) => {
    const { userId } = req.session;
    const { orderId } = req.params

    try {
        const result = await OrderModel.updateOne({ _id: orderId, 'for.member': userId }, { '$set': { 'for.$.status': 'rejected' } })
        if (result.nModified != 1) return res.status(400).json({ message: "Could not reject the request" });

        return res.status(200).json({ message: "request is rejected" });

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}
