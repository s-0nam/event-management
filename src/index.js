const express = require('express')
require('./db/mongoose') 
const userRouter = require('./routers/users')
//const taskRouter = require('./routers/tasks')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     if (req.method == 'GET') {
//         res.send('Get requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Service is on maintenance')
// })
const multer = require('multer')
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    }
})
app.post('/uploads', upload.single('upload'), (req, res) => {
    res.send()
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
 

app.listen(port , () => {
    console.log('Server is up on port ' + port)
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('6234bbc85b17f0c47a5d3686')
//     // await task.populate('owner')
//     // console.log(task.owner)
//     const user = await User.findById('6234b70c4a2b9c9e559f866d')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }

// main()

 