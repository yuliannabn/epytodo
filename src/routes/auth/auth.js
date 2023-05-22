const router                                = require('express').Router()
const { validateEmail }                     = require('../../config/regex')
const { badParameters, invalidCredentials } = require('../../middleware/auth')
const { registerUser, loginUser }           = require('../user/user.query')

router.post('/register', (req, res) => {
    const { email, name, firstname, password } = req.body

    if (!email || !validateEmail(email) || !name || !firstname || !password)
        return (badParameters(res))

    registerUser(email, name, firstname, password, res)
})

router.post('/login', (req, res, next) => {
    const { email, password } = req.body

    if (!email || !validateEmail(email) || !password)
        return (invalidCredentials(res))

    loginUser(email, password, res)
})

module.exports = router
