const GroupModel = require('../models/group')

exports.createGroup = async (req, res) => {
    const { name } = req.body
    const { userId } = req.session

    try {
        const group = await GroupModel.create({
            name,
            admin: userId
        })
        group.save()
        res.status(200).json({ message: " Group created successfully" })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }

}

exports.addMemberToGroup = async (req, res) => {
    const { member } = req.body
    const { userId } = req.session
    const { groupId } = req.params
    try {

        if (!member) return res.status(400).json({ message: " Member is required" })

        const group = await GroupModel.findOne({
            _id: groupId,
            admin: userId
        }).exec()


        if (group.members.length > 0) {
            for(let i=0; i<group.members.length; i++){
                if (String(group.members[i]._id) === String(member)) return res.status(400).json({ message: " Member aleardy in the group" })
            }
        }

        const result = await GroupModel.updateOne({
            _id: groupId,
            admin: userId
        }, {
            $push: {
                members: member
            }
        })

        if (result.nModified > 0) return res.status(200).json({ message: " Member added successfully" })
        res.status(400).json({ message: " Could not add member to group" })

    } catch (err) {
        res.status(400).json({ message: err.message })
    }

}

exports.getUserGroups = async (req, res) => {
    try {
        const { userId } = req.session
        const name = req.query.name;

        console.log(req.query)
        let condition = name ? {
            $and:[ 
                {'name': { $regex: new RegExp(name), $options: "i"}},
                { $or: [{ admin: userId }, { members: userId }] }
             ]
            } 
            : { $or: [{ admin: userId }, { members: userId }] };

        const groups = await GroupModel.find(condition).populate('members','name image').exec()
        if (groups) return res.status(200).json(groups)
        res.status(404).json({ message: "Could not find any group" })

    } catch (err) {
        res.status(400).json({ message: err.message })

    }
}

exports.getGroupMembers = async (req, res) => {
    try {
        const { userId } = req.session
        const { groupId } = req.params
        const group = await GroupModel.findOne({ $or: [{ _id: groupId, admin: userId }, { _id: groupId, members: userId }] }).select('members name admin').populate('members', 'name').exec()
        if (group) return res.status(200).json(group)
        res.status(404).json({ error: "Could not find any group" })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

exports.removeMemberFromGroup = async (req, res) => {
    try {
        const { userId } = req.session
        const { groupId, memberId } = req.params

        const result = await GroupModel.updateOne({ _id: groupId, admin: userId }, { $pull: { members: memberId } })
        if (result.nModified != 1) return res.status(400).json({ message: "Could not remove the member from the group" });
        res.status(200).json({ message: "Member Removed" })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

exports.deleteGroup = async (req, res) => {
    try {
        const { userId } = req.session
        const { groupId } = req.params

        const result = await GroupModel.deleteOne({ _id: groupId, admin: userId })
        if (result.deletedCount != 1) return res.status(400).json({ message: "Could not delete the group" });
        res.status(200).json({ message: "Group deleted" })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

