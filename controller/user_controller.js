const { ComparePassword, HashPassword } = require('../helper/hash_password_helper')

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
// var jwt = require('jsonwebtoken');

async function CreateUser(req, res) {

    try {
        const hashPass = await HashPassword(req.body.password)

        const payload = {
            name: req.body.name,
            password: hashPass,
            email: req.body.email
        }

        const check = await prisma.user.findFirst({
            where: {
                email: req.body.email
            }
        })
        if (check) {
            req.flash('error', 'user already used')
            res.status(400).json({
                message: 'user already registered',
                status: 400,
                data: null
            })

            res.redirect('/register')
            return
        }

        await prisma.user.create({ data: payload })

        res.status(200).json({
            message: 'success',
            status: 200,
            data: null
        })
        return

    } catch (error) {
        res.status(500).json({
            message: 'internal server error',
            status: 500,
            data: error
        })
        return

    }

}


module.exports = {
    CreateUser,

}