
exports.badParameters = (res) => {
    res.status(400).json
    ({
        "msg": "Bad parameter"
    })
}

exports.internalServerError = (res) => {
    res.status(500).json
    ({
        "msg": "Internal server error"
    })
}

exports.invalidToken = (res) => {
    res.status(401).json
    ({
        "msg": "Token is not valid"
    })
}

exports.noAuth = (res) => {
    res.status(401).json
    ({
        "msg": "No token, authorization denied"
    })
}

exports.accountExists = (res) => {
    res.status(409).json
    ({
        "msg": "Account already exists"
    })
}

exports.tokenSet = (res, token) => {
    res.status(201).json
    ({
        "token": token
    })
}

exports.invalidCredentials = (res) => {
    res.status(401).json
    ({
        "msg": "Invalid credentials"
    })
}

exports.recordDeleted = (res, req, record) => {
    res.status(200).json
    ({
        "msg": `Successfully deleted record number: ${record}`
    })
}
