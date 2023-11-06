const route = require('express').Router();
const { CreateUser, Login } = require('../../controller/user_controller')
const restrict = require('../../middleware/restrict')

route.post('/', CreateUser)
route.post('/login', Login)
route.post('/whoami', restrict, (req, res) => {
    return res.status(200).json({
        status: 200,
        message: 'success',
        data: {
            user: req.user
        }
    })
})

module.exports = route