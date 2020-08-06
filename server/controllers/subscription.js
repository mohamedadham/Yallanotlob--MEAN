const subscriptionModel = require('../models/subscription')


exports.addPushSubscriber= async (req, res)=> {
    try{
        const sub = req.body;
        sub.user= req.session.userId
        console.log(req.session.userID)
        console.log('Received Subscription on the server: ', sub);
        console.log(sub)
        const subsc=await subscriptionModel.create(sub)
    
        res.status(200).json({message: "Subscription added successfully."});

    }catch(err){
        res.status(400).json({message: "Error adding Subscription"});

    }
}