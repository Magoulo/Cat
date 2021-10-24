
const bodyParser = require('body-parser')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const { ExpressHandlebars } = require('express-handlebars')
const expressSession = require('express-session')
const fileUpload = require('express-fileupload')

const faqRouter = require('./routers/faq-router')
const donationalternativeRouter = require('./routers/donationalternative-router')
const indexRouter = require('./routers/index-router')
const authRouter = require('./routers/auth-router')
const catownerinfoRouter = require('./routers/catownerinfo-router')
const myadsRouter = require('./routers/myads-router')

const csrf = require('csurf')
const csrfProtection = csrf()

const connectSqlite3 = require('connect-sqlite3')
const SQLiteStore = connectSqlite3(expressSession)


const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('catDB.db')

const app = express()


app.use(bodyParser.urlencoded({
	extended: false
}))

app.engine("hbs", expressHandlebars({
	defaultLayout: 'main.hbs'
}))


app.use(expressSession({

	secret: "blehblehebleh",
	store: new SQLiteStore({ db: "session-db.db" }),
	saveUninitialized: false,
	resave: false,
}))
app.use(express.static(__dirname + '/static/public/'))

app.use(function (request, response, next) {
	response.locals.session = request.session
	next()
})

app.use(fileUpload())
//------------------------------------------------------------------------------------------------

app.use('/faq',faqRouter) //redirectar till faq-router.js
app.use('/donationalternative',donationalternativeRouter) //redirectar till donation-router.js
app.use('/index',indexRouter) //redirectar till index-router.js
app.use('/auth', authRouter) //redirectar till auth-router.js
app.use('/catownerinfo', catownerinfoRouter)//redirectar till catownerinfo-router.js
app.use('/myads', myadsRouter)//redirectar till myads-router.js

app.get('/',function(request, response){
	response.redirect('/index')
})
//------------------About pages--------------------------------------------------------------------------
app.get('/about', function (request, response) {
	response.render('about.hbs')
})
//---------------------------Contact page------------------------------------------------------------------
app.get('/contact', function (request, response) {
	response.render('contact.hbs')
})

app.get('/upload', function (request, response) {
	response.render('uploadpic.hbs')
})

app.get('*', function(request,response){
	response.send('Page not found', 404)
})

app.listen(8080)