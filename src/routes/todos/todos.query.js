const { db }        = require('../../config/db.js')
const { validateTime } = require('../../config/regex.js')
const { internalServerError, invalidCredentials }
                    = require('../../middleware/auth.js')
const { notFound }  = require('../../middleware/notFound.js')
const { formatDate } = require ('../user/user.query.js')

exports.validateStatus = (status) => {
    const statuses = ['not started', 'todo', 'in progress', 'done']

    return (status && statuses.includes(status))
}

exports.todosShow = (user) => {
    const todos = Array.isArray(user)
    ? user.map ((todo) =>
    ({
        "id":           todo.id.toString(),
        "title":        todo.title,
        "description":  todo.description,
        "created_at":   formatDate(todo.created_at),
        "due_time":     formatDate(todo.due_time),
        "user_id":      todo.user_id.toString(),
        "status":       todo.status
    }))
    : {
        "id":           user.id.toString(),
        "title":        user.title,
        "description":  user.description,
        "created_at":   formatDate(user.created_at),
        "due_time":     formatDate(user.due_time),
        "user_id":      user.user_id.toString(),
        "status":       user.status
    }
    return (todos)
}

exports.todoCreatedShow = (user, res) => {

    res.status(201).json(this.todosShow(user))

}

exports.todoSimpleDataShow = (user, res) => {

    res.status(200).json
    ({
        "title":        user.title,
        "description":  user.description,
        "due_time":     formatDate(user.due_time),
        "user_id":      user.user_id.toString(),
        "status":       user.status
    })
}

exports.todoDataShow = (user, res) => {

    res.status(200).json(this.todosShow(user))

}

exports.todoShowFromUserID = (req, res) => {
    if (!req.user.id)
        return (invalidCredentials(res))

    db.execute('SELECT * FROM `todo` WHERE user_id = ?', [req.user.id], (err, result) => {
        if (err)                    return (internalServerError(res))
        if (result.length == 0)     return (notFound(res))

        this.todoDataShow(result, res)
    })
}

exports.simpleSingleTodoShowFromID = (req, res, target) => {
    const targetID  = parseInt(target, 10)
    const userIntID = parseInt(req.user.id, 10)

    if (!targetID || !userIntID)
        return (invalidCredentials(res))

    db.execute('SELECT * FROM `todo` WHERE user_id = ? AND id = ?',
    [userIntID, targetID], (err, result) => {
        if (err)                        return (internalServerError(res))
        if (result.length == 0)         return (notFound(res))

        return (this.todoSimpleDataShow(result[0], res))
    })
}

exports.singleTodoShowFromID = (req, res, target) => {
    const targetID  = parseInt(target, 10)
    const userIntID = parseInt(req.user.id, 10)

    if (!targetID || !userIntID)
        return (invalidCredentials(res))

    db.execute('SELECT * FROM `todo` WHERE user_id = ? AND id = ?',
    [userIntID, targetID], (err, result) => {
        if (err)                        return (internalServerError(res))
        if (result.length == 0)         return (notFound(res))

        return (this.todoDataShow(result[0], res))
    })
}

exports.todoDataFill = (targetID, title, description, due_time, user_id, status, res, req) => {
    const userIntID = parseInt(req.user.id, 10)
    const reqIntID  = parseInt(user_id, 10)

    if (!targetID || !due_time || validateTime(due_time) || !status ||  !this.validateStatus(status)
        || !title || !description || !userIntID || !user_id || userIntID != reqIntID)
        return (invalidCredentials(res))

    db.execute('UPDATE `todo` SET title = ?, description = ?, due_time = ?, user_id = ?, status = ? WHERE user_id = ? AND id = ?',
    [title, description, due_time, user_id, status, userIntID, targetID], (err, result) => {
        if (err)                            return (internalServerError(res))
        if (result.affectedRows == 0)       return (notFound(res))

        return (this.simpleSingleTodoShowFromID(req, res, targetID))
    })
}

exports.todoCreate = (req, res, title, description, due_time, user_id, status) => {
    const userIntID = parseInt(req.user.id, 10)
    const reqIntID  = parseInt(user_id, 10)

    if (!due_time || validateTime(due_time) || !status ||  !this.validateStatus(status) || !title
        || !description || !userIntID || !user_id || userIntID != reqIntID)
        return (invalidCredentials(res))

    db.execute('INSERT INTO `todo` (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)',
    [title, description, due_time, user_id, status], (err, result) => {
        if (err)                        return (internalServerError(res))
        if (result.affectedRows == 0)   return (notFound(res))

        return (this.singleTodoShowFromID(req, res, result.insertId))
    })
}
