const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const connnectToDB = require("./config/db")
connnectToDB();
const cookieParser = require("cookie-parser")

const fileRouter =require("./routes/file.routes")

const userRouter = require("./routes/user.routes")
const indexRouter = require("./routes/index.routes")

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/user', userRouter)
app.use('/', indexRouter)

app.use('/files', fileRouter)

app.listen(3000)