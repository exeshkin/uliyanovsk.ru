const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

const CONFIG_PATH = path.join(__dirname, '..', 'data', 'config.json')

function getPasswordHash() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
  return config.passwordHash
}

function savePasswordHash(hash) {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
  config.passwordHash = hash
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, '\t'), 'utf8')
}

// Защита от перебора
const loginAttempts = {}
const MAX_ATTEMPTS = 5
const BLOCK_TIME = 15 * 60 * 1000

function isBlocked(ip) {
  const attempts = loginAttempts[ip]
  if (!attempts) return false
  if (attempts.count >= MAX_ATTEMPTS) {
    const timePassed = Date.now() - attempts.lastAttempt
    if (timePassed < BLOCK_TIME) return true
    delete loginAttempts[ip]
    return false
  }
  return false
}

function recordAttempt(ip) {
  if (!loginAttempts[ip]) {
    loginAttempts[ip] = { count: 0, lastAttempt: null }
  }
  loginAttempts[ip].count++
  loginAttempts[ip].lastAttempt = Date.now()
}

function resetAttempts(ip) {
  delete loginAttempts[ip]
}

// Вход
router.post('/login', async (req, res) => {
  const ip = req.ip

  if (isBlocked(ip)) {
    const attempts = loginAttempts[ip]
    const minutesLeft = Math.ceil(
      (BLOCK_TIME - (Date.now() - attempts.lastAttempt)) / 60000
    )
    return res.json({
      success: false,
      message: `Слишком много попыток. Подождите ${minutesLeft} мин.`
    })
  }

  const { password } = req.body
  const hash = getPasswordHash()
  const isValid = await bcrypt.compare(password, hash)

  if (isValid) {
    resetAttempts(ip)
    req.session.loggedIn = true
    res.json({ success: true })
  } else {
    recordAttempt(ip)
    const attempts = loginAttempts[ip]
    const left = MAX_ATTEMPTS - attempts.count
    if (left > 0) {
      res.json({
        success: false,
        message: `Неверный пароль. Осталось попыток: ${left}`
      })
    } else {
      res.json({
        success: false,
        message: 'Слишком много попыток. Подождите 15 мин.'
      })
    }
  }
})

// Выход
router.post('/logout', (req, res) => {
  req.session.destroy()
  res.json({ success: true })
})

// Проверка сессии
router.get('/check', (req, res) => {
  res.json({ loggedIn: !!(req.session && req.session.loggedIn) })
})

// Смена пароля
router.post('/change-password', async (req, res) => {
  if (!req.session || !req.session.loggedIn) {
    return res.status(401).json({ error: 'Не авторизован' })
  }

  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.json({ success: false, message: 'Заполните все поля' })
  }

  if (newPassword.length < 8) {
    return res.json({
      success: false,
      message: 'Новый пароль должен быть не менее 8 символов'
    })
  }

  const hash = getPasswordHash()
  const isValid = await bcrypt.compare(currentPassword, hash)

  if (!isValid) {
    return res.json({ success: false, message: 'Неверный текущий пароль' })
  }

  const newHash = await bcrypt.hash(newPassword, 10)
  savePasswordHash(newHash)
  res.json({ success: true })
})

module.exports = router