const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const date_regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/

exports.validateEmail = (email) => {

    return (regex.test(String(email).toLowerCase()))

}

exports.validateTime = (date) => {

    return (date_regex.test(date))

}
