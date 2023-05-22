require('dotenv').config()
const app = require('express')()
const port = process.env.PORT
const { notFound } = require('./middleware/notFound.js')

app.use(require('express').json())

app.use('', require('./routes/auth/auth.js'))
app.use('', require('./routes/user/user.js'))
app.use('/todos', require('./routes/todos/todos.js'))

app.use((err, res) => {
    console.error(err.stack)
    notFound(res)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
