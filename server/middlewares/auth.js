const UserModel= require('../models/user')

exports.isAuthorized= async (req, res,next)=>{
    try{
        const user= await UserModel.findById(req.session.userId).exec();
        if(!user) return res.status(400).json({message:"Not Authorized!", status: false})
        next()
    }catch(err){
        console.log(err)
        res.status(400).json({message:'Not Authorized!'})
    }
}