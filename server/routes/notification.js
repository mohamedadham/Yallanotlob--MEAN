const express = require('express');
const router = express.Router();
const { isAuthorized } = require('../middlewares/auth');
const { addPushSubscriber } = require('../controllers/subscription');



router.post('/', isAuthorized, addPushSubscriber)


module.exports = router;
