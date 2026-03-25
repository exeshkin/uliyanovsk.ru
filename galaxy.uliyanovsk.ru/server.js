require('dotenv').config()

const express = require('express')
const session = require('express-session')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// Сессия
app.use(session({
  secret: process.env.SESSION_SECRET || (() => { throw new Error('SESSION_SECRET не задан в .env') })(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 8, // 8 часов
    httpOnly: true,              // недоступен из JS на клиенте (защита от XSS)
    sameSite: 'strict'           // защита от CSRF
    // secure: true — раскомментировать на сервере с HTTPS (через nginx)
  }
}))

// Проверка авторизации
const requireAuth = (req, res, next) => {
  if (req.session && req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login.html')
  }
}

// Маршруты
app.use('/api/auth', require('./routes/auth'))
app.use('/api/data', requireAuth, require('./routes/data'))

// Главная страница → редирект на логин если не авторизован
app.get('/', (req, res) => {
  if (req.session && req.session.loggedIn) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  } else {
    res.redirect('/login.html')
  }
})

app.listen(PORT, () => {
  console.log(`Админка запущена: http://localhost:${PORT}`)
})