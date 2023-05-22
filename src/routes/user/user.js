const { validateEmail } = require('../../config/regex.js')
const { notFound }      = require('../../middleware/notFound.js')
const { db }            = require('../../config/db.js')
const router            = require('express').Router()
const { todoShowFromUserID } = require('../todos/todos.query.js')
const { internalServerError, invalidCredentials,
    recordDeleted } = require('../../middleware/auth.js')
const { validateEmailinDB, validateIDinDB, dataShowFromEmail,
    dataShowFromID, verifyToken, userDataFill } = require('./user.query.js')

router.get('/user', verifyToken, (req, res) => {

    return (dataShowFromID(req.user.id, res))

})

router.get('/user/todos', verifyToken, (req, res) => {

    return (todoShowFromUserID(req, res))

})

router.get('/users/:email_or_id', verifyToken, (req, res) => {
    const userInput = req.params.email_or_id
    const intID     = parseInt(userInput, 10)

    if (!userInput)
        return (invalidCredentials(res))

    if (validateEmailinDB(userInput, res) && req.user.email == userInput)
        return (dataShowFromEmail(userInput, res))

    if (validateIDinDB(userInput, res) && req.user.id == intID)
        return (dataShowFromID(intID, res))

    return (invalidCredentials(res))
})

router.put('/users/:id', verifyToken, (req, res) => {
    const { email, password, firstname, name } = req.body
    const userInput = req.params.id
    const intID     = parseInt(userInput, 10)

    if (!email || !validateEmail(email) || !password || !firstname || !name || req.user.id != intID)
        return (invalidCredentials(res))

    return (userDataFill(email, password, firstname, name, res, req))
})

router.delete('/users/:id', verifyToken, (req, res) => {
    const userInput = req.params.id
    const intID     = parseInt(userInput, 10)

    if (req.user.id != intID)
        return (invalidCredentials(res))

    db.execute('DELETE FROM `user` WHERE id = ?', [intID], (err, result) => {
        if (err)                        return (internalServerError(res))
        if (result.affectedRows == 0)   return (notFound(res))

        return (recordDeleted(res, req, req.user.id))
    })
})


module.exports = router
