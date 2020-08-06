const express = require('express');
const router = express.Router();
const { isAuthorized } = require('../middlewares/auth');
const { 
    login, register, addFriend, isLoggedIn, getUserFriends, unFriend, logout, getNotifications, getFriendsActivity
} = require('../controllers/user');



router.post('/signup', register)

router.get('/logout',isAuthorized, logout)

router.post('/login', login)

router.get('/friends',isAuthorized, getUserFriends)

router.get('/isloggedin',isAuthorized, isLoggedIn)

router.post('/friend',isAuthorized, addFriend)

router.delete('/:friendId/friends',isAuthorized, unFriend)

router.get('/notifications',isAuthorized, getNotifications)

router.get('/friendsactivity',isAuthorized, getFriendsActivity)


router.get('/test', (req,res)=>{
    console.log(req.session.userId)
})

module.exports = router;
