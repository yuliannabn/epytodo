const mysql = require('mysql2')

exports.db = mysql.createConnection({
    host:       process.env.MYSQL_HOST,
    user:       process.env.MYSQL_USER,
    database:   process.env.MYSQL_DATABASE,
    password:   process.env.MYSQL_ROOT_PASSWORD
})

exports.db.connect((error) => {
    if (error)
        console.error('Connection impossible.')

    console.log('Connected to database.')
})
