const express = require('express')
const router = express.Router();
const {
    createGroup,
    addMemberToGroup,
    deleteGroup,
    removeMemberFromGroup,
    getGroupMembers,
    getUserGroups
} = require('../controllers/group')


router.get('/', getUserGroups)

router.post('/', createGroup)

router.post('/:groupId/member', addMemberToGroup)

router.get('/:groupId', getGroupMembers)

router.delete('/:groupId', deleteGroup)

router.put('/:groupId/:memberId', removeMemberFromGroup)

module.exports = router;