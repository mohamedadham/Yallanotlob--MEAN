const mongoose= require('mongoose')

const groupSchema= mongoose.Schema({
    admin:{type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    name:{type: String, required:true},
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        unique:true
    }]
})

module.exports= mongoose.model("Group", groupSchema)