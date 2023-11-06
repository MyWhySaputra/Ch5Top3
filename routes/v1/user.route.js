const route = require('express').Router();
const { CreateUser } = require('../../controller/user_controller')

route.post('/', CreateUser)

module.exports = route