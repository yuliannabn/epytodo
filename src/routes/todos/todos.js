const router              = require('express').Router()
const { db }              = require('../../config/db.js')
const { verifyToken }     = require('../user/user.query.js')
const { internalServerError, invalidCredentials, recordDeleted } = require('../../middleware/auth.js')
const { todoShowFromUserID, singleTodoShowFromID }  = require('./todos.query.js')
const { notFound }        = require('../../middleware/notFound.js')
const { todoCreate, todoDataFill }      = require('./todos.query.js')

router.post('/', verifyToken, (req, res) => {
    const { title, description, due_time, user_id, status } = req.body

    todoCreate(req, res, title, description, due_time, user_id, status)
})

router.put('/:id', verifyToken, (req, res) => {
    const { title, description, due_time, user_id, status } = req.body
    const targetID  = parseInt(req.params.id, 10)

    if (!title || !description || !due_time || !targetID)
        return (invalidCredentials(res))

    // todo update query
    return (todoDataFill(targetID, title, description, due_time, user_id, status, res, req))
})

router.get('/', verifyToken, (req, res) => {

    return (todoShowFromUserID(req, res))

})

router.get('/:id', verifyToken, (req, res) => {

    return (singleTodoShowFromID(req, res, req.params.id))

})

router.delete('/:id', verifyToken, (req, res) => {
    const targetID  = parseInt(req.params.id, 10)
    const userIntID = parseInt(req.user.id, 10)

    if (!targetID || !userIntID)
        return (invalidCredentials(res))

    db.execute('DELETE FROM `todo` WHERE user_id = ? AND id = ?',
    [userIntID, targetID], (err, result) => {
        if (err)                        return (internalServerError(res))
        if (result.affectedRows == 0)   return (notFound(res))

        return (recordDeleted(res, req, targetID))
    })
})

module.exports = router