const bcrypt = require('bcrypt');
const UserModel = require('../models/user');

exports.login = async (req, res, next) => {
    if (!req.body.email) return res.status(400).json({ error: "Email is required" })
    if (!req.body.password) return res.status(400).json({ error: "Password is required" })
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }).exec();
        if (!user) return res.status(401).json({ error: "User Not Exist" })
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Incorrect Password' })
        req.session.userId = user._id
        user.password = null
        res.status(200).json({ user, message: "loggedIn Successfully" })
    } catch (err) {
        console.log(err)
        res.status(401).json({ error: err.message })
    }

}

exports.logout = function (req, res) {
    req.session.destroy();
    res.status(200).json("logout");
};

exports.register = async (req, res, next) => {
    if (!req.body.email) return res.status(400).json({ error: "Email is Required" })
    if (!req.body.name) return res.status(400).json({ error: "Name is Required" })
    if (!req.body.password) return res.status(400).json({ error: "Password is Required" })
    try {
        const { name, email, password, image } = req.body;
        console.log(image)
        const user = await UserModel.create({
            email,
            password,
            name,
            image
        })
        res.status(200).json("Registered Successfully")
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

exports.addFriend = async (req, res) => {

    try {
        const { userId } = req.session
        const { friendEmail } = req.body

        const user= await UserModel.findOne({ _id: userId }).exec()

        if(user.email=== friendEmail) return res.status(400).json({ message: "This is your Email" });

        const friend = await UserModel.findOne({ email: friendEmail }).exec()

        if (!friend) return res.status(400).json({ message: "Email does not exit" });

        const alreadyFriend= await UserModel.findOne({ _id: userId, 'friends.id': friend._id }).exec()

        if(alreadyFriend) return res.status(400).json({ message: "You are already friends" });

        const result = await UserModel.updateOne({ _id: userId }, { $push: { friends: { id: friend._id, name: friend.name } } })
        if (result.nModified != 1) return res.status(400).json({ message: "Could not add friend" });
        res.status(200).json({ message: "Friend added" })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

exports.unFriend = async (req, res) => {

    try {
        const { userId } = req.session
        const { friendId } = req.params
        console.log(friendId)

        const result = await UserModel.updateOne({ _id: userId }, { "$pull": { "friends": { _id: friendId } } })

        console.log(result)
        if (result.nModified != 1) return res.status(400).json({ message: "Could not remove the friend" });

        return res.status(200).json({ message: "Friend is removed" });

    } catch (err) {
        console.log(err.message)
        res.status(404).json({ error: err.message })

    }
}

exports.getUserFriends = async (req, res) => {

    try {
        const name = req.query.name;
        const { userId } = req.session
        let condition = name ? { 'friends.name': { $regex: new RegExp(name), $options: "i" }, _id: userId } : { _id: userId };

        const user = await UserModel.findOne(condition).select({ '_id': '0', 'friends': '1' }).populate('friends.id','image')

        if (user) return res.status(200).json(user.friends)
        return res.status(200).json([])

    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message })

    }
}

exports.isLoggedIn = async (req, res) => {
    res.status(200).json({ status: true })
}

exports.getNotifications = async (req, res) => {
    try {
        const { userId } = req.session
        let user = await UserModel.findOne({ _id: userId }).populate( 'notifications.order').populate({
            path: 'notifications.order',
            populate: { path: 'orderOwner', select:'name' }
        }).exec()

        
        user.notifications.forEach((notification)=>{ notification.order.for= notification.order.for.filter(member=> String(member.member)=== String(userId))})
        res.status(200).json(user.notifications)

    } catch (err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
    }
}

exports.getFriendsActivity = async (req, res) => {
    try {
        const { userId } = req.session
        let user = await UserModel.findOne({ _id: userId }).populate( 'notifications.order').populate({
            path: 'notifications.order',
            populate: { path: 'orderOwner', select:'name' }
        }).exec()

        
        user.notifications.forEach((notification)=>{ notification.order.for= notification.order.for.filter(member=> String(member.member)=== String(userId))})
        res.status(200).json(user.notifications)

    } catch (err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
    }
}