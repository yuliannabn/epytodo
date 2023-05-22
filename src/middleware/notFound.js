
exports.notFound = (res) => {
    res.status(404).json
    ({
        "msg": "Not found"
    })
}
