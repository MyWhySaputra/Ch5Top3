const { ComparePassword, HashPassword } = require('../helper/hash_password_helper')

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var jwt = require('jsonwebtoken');

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

async function Login(req, res) {


    try {
        const { email, password } = req.body

        const checkUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        // if (checkUser) {
        //     res.status(400).json({
        //         data: null,
        //         status: 400,
        //         message: "email is not found or incorrect"
        //     })
        // }

        const checkPassword = await ComparePassword(password, checkUser.password)

        if (!checkPassword) {
            res.status(400).json({
                data: null,
                status: 400,
                message: "password is not correct"
            })
            return
        }

        const token = jwt.sign({
            email: checkUser.email,
            user_id: checkUser.id
        }, process.env.SECRET_KEY);

        res.status(200).json({
            status: 200,
            message: 'success',
            data: {
                token,
            }
        })
        return


    } catch (error) {
        res.status(500).json({
            data: error.message,
            status: 500,
            message: "internal server error"
        })
    }
}


module.exports = {
    CreateUser,
    Login
}