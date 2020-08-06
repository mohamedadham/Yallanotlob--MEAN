const express = require('express')
const router = express.Router()
const { isAuthorized } = require('../middlewares/auth')
const {
    makeOrder,
    getOrder,
    cancelOrder,
    finishOrder,
    addItem,
    getOrders,
    acceptOrder,
    removeItem,
    rejectOrder,
    getLatestOrder
} = require('../controllers/order')

router.get('/', isAuthorized, getOrders)

router.get('/latest', isAuthorized, getLatestOrder)


router.patch('/:orderId/finish', isAuthorized, finishOrder)

router.patch('/:orderId/reject', isAuthorized, rejectOrder)

router.patch('/:orderId', isAuthorized, acceptOrder)


router.get('/:orderId', isAuthorized, getOrder)

router.post('/', isAuthorized, makeOrder)

router.delete('/:orderId', isAuthorized, cancelOrder)

router.post('/:orderId/item', isAuthorized, addItem)

router.delete('/:orderId/item/:itemId', isAuthorized, removeItem)

module.exports = router;