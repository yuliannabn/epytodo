const bcryptjs                = require('bcryptjs')
const JWT                   = require('jsonwebtoken')
const { db }                = require('../../config/db.js')
const { validateEmail }     = require('../../config/regex.js')
const { notFound }          = require('../../middleware/notFound.js')
const { internalServerError, accountExists, tokenSet, invalidCredentials,
    noAuth, invalidToken }  = require('../../middleware/auth.js')

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token)
        return (noAuth(res))

    JWT.verify(token, process.env.SECRET, (err, decoded) => {
        if (err)
            return (invalidToken(res))
        if (!decoded?.email)
            return (noAuth(res))

        req.user = decoded
        next()
    })
}

exports.formatDate = (date) => {
    if (!date)
        return (null)

    const dates = ("" + date.toISOString()).split('-')
    const time = ((dates[2]).split('T')[1]).split(':')

    return (`${dates[0]}-${dates[1]}-${dates[2].split('T')[0]} ${time[0]}:${time[1]}:${time[2].substring(0, 2)}`)
}

exports.userDataShow = (user, res) => {
    res.status(200).json
    ({
        "id":           user.id.toString(),
        "email":        user.email,
        "password":     user.password,
        "created_at":   this.formatDate(user.created_at),
        "firstname":    user.firstname,
        "name":         user.name
    })
}

exports.userDataFill = (email, password, firstname, name, res, req) => {
    bcryptjs.hash(password, 10, (err, hash) => {
        if (err)
            return (internalServerError(res))


        db.execute('UPDATE `user` SET email = ?, name = ?, firstname = ?, password = ? WHERE id = ?',
        [email, name, firstname, hash, req.user.id], (err) => {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY')
                    return (accountExists(res))
                return (internalServerError(res))
            }
            this.dataShowFromID(req.user.id, res)
        })
    })
}

exports.registerUser = (email, name, firstname, password, res) => {
    bcryptjs.hash(password, 10, (err, hash) => {
        if (err)
            return (internalServerError(res))

        db.execute('INSERT INTO `user` (email, name, firstname, password) VALUES (?, ?, ?, ?)',
        [email, name, firstname, hash], (err, result) => {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY')
                    return (accountExists(res))
                return (internalServerError(res))
            }
            const token = JWT.sign(
                { id: result.insertId }, process.env.SECRET, { expiresIn: '12h' })
            tokenSet(res, token)
        })
    })
}

exports.validatePassword = (res, password, testPassword, payload) => {
    bcryptjs.compare(password, testPassword, (err, match) => {
        if (err)        return (internalServerError(res))
        if (!match)     return (invalidCredentials(res))

        const token = JWT.sign(
            payload, process.env.SECRET, { expiresIn: '12h' })
        tokenSet(res, token)
    })
}

exports.loginUser = (email, password, res) => {
    db.execute('SELECT * FROM `user` WHERE email = ?', [email], (err, result) => {
        if (err)                return (internalServerError(res))
        if (result.length != 1) return (notFound(res))

        const user = result[0]

        this.validatePassword(res, password, user.password,
            { email: user.email, id: user.id })
    })
}

exports.validateIDinDB = async (id) => {
    if (isNaN(id))
        return (false)

    try {
        db.execute('SELECT * FROM `user` WHERE id = ?', [id])
        return (result.length === 1)
    } catch (err) {
        return (false)
    }
}

exports.validateEmailinDB = async (email) => {
    if (!validateEmail(email))
        return (false)

    try {
        db.execute('SELECT * FROM `user` WHERE email = ?', [email])
        return (result.length === 1)
    } catch (err) {
        return (false)
    }
}

exports.dataShowFromEmail = (email, res) => {
    if (!email)
        return (invalidCredentials(res))

    db.execute('SELECT * FROM `user` WHERE email = ?', [email], (err, result) => {
        if (err)                return (internalServerError(res))
        if (result.length != 1) return (notFound(res))

        this.userDataShow(result[0], res)
    })
}

exports.dataShowFromID = (id, res) => {
    if (!id)
        return (invalidCredentials(res))

    db.execute('SELECT * FROM `user` WHERE id = ?', [id], (err, result) => {
        if (err)                return (internalServerError(res))
        if (result.length != 1) return (notFound(res))

        this.userDataShow(result[0], res)
    })
}
