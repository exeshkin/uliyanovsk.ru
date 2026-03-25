const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const DATA_DIR = process.env.DATA_DIR
  ? require('path').resolve(process.env.DATA_DIR)
  : require('path').join(__dirname, '..', '..', 'uliyanovsk.ru', 'data')

const readJson = (filename) => {
  const filePath = path.join(DATA_DIR, filename)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}

const writeJson = (filename, data) => {
  const filePath = path.join(DATA_DIR, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, '\t'), 'utf8')
}

// --- STREAM ---
router.get('/stream', (req, res) => {
  try { res.json(readJson('stream.json')) } catch (e) { res.status(500).json({ error: 'Ошибка чтения файла' }) }
})
router.post('/stream', (req, res) => {
  try {
    const data = readJson('stream.json')
    data.stream.onOff = req.body.onOff
    if (req.body.next_stream) data.next_stream = req.body.next_stream
    writeJson('stream.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})

// --- NOTIFY ---
router.get('/notify', (req, res) => {
  try { res.json(readJson('notify.json')) } catch (e) { res.status(500).json({ error: 'Ошибка чтения файла' }) }
})
router.post('/notify', (req, res) => {
  try {
    const data = readJson('notify.json')
    data.on = req.body.on
    if (req.body.date) data.date = req.body.date
    if (req.body.img) data.img = req.body.img
    writeJson('notify.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})

// --- SERVICES ---
router.get('/services', (req, res) => {
  try { res.json(readJson('services.json')) } catch (e) { res.status(500).json({ error: 'Ошибка чтения файла' }) }
})
router.post('/services', (req, res) => {
  try {
    const data = readJson('services.json')
    const { date, minister, name, fileName } = req.body
    if (!date || !minister || !name || !fileName) {
      return res.status(400).json({ error: 'Заполните все поля' })
    }
    const existing = Object.keys(data).filter(k => k.startsWith(date + '-'))
    const nextIndex = existing.length + 1
    const id = `${date}-${nextIndex}`
    if (data[id]) return res.status(400).json({ error: 'Запись с таким ID уже существует' })
    data[id] = { date, minister, name, fileName }
    writeJson('services.json', data)
    res.json({ success: true, id })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})
router.delete('/services/:id', (req, res) => {
  try {
    const data = readJson('services.json')
    const id = decodeURIComponent(req.params.id)
    if (!data[id]) return res.status(404).json({ error: 'Запись не найдена' })
    delete data[id]
    writeJson('services.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})

// --- MINISTERS ---
router.get('/ministers', (req, res) => {
  try { res.json(readJson('ministers.json')) } catch (e) { res.status(500).json({ error: 'Ошибка чтения файла' }) }
})
router.post('/ministers', (req, res) => {
  try {
    const data = readJson('ministers.json')
    const { name, link, pathMp3, pathMp4 } = req.body
    if (!name || !link || !pathMp3 || !pathMp4) return res.status(400).json({ error: 'Заполните все поля' })
    data[name] = { link, pathMp3, pathMp4 }
    writeJson('ministers.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})
router.delete('/ministers/:name', (req, res) => {
  try {
    const data = readJson('ministers.json')
    const name = decodeURIComponent(req.params.name)
    if (!data[name]) return res.status(404).json({ error: 'Служитель не найден' })
    delete data[name]
    writeJson('ministers.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})

// --- MESSAGES ---
router.get('/messages', (req, res) => {
  try { res.json(readJson('message.json')) } catch (e) { res.status(500).json({ error: 'Ошибка чтения файла' }) }
})
router.post('/messages', (req, res) => {
  try {
    const data = readJson('message.json')
    const { date, name, fileName } = req.body
    if (!date || !name || !fileName) return res.status(400).json({ error: 'Заполните все поля' })
    const existing = Object.keys(data).filter(k => k.startsWith(date + '-'))
    const nextIndex = existing.length + 1
    const id = `${date}-${nextIndex}`
    if (data[id]) return res.status(400).json({ error: 'Запись с таким ID уже существует' })
    data[id] = { name, fileName }
    writeJson('message.json', data)
    res.json({ success: true, id })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})
router.delete('/messages/:id', (req, res) => {
  try {
    const data = readJson('message.json')
    const id = decodeURIComponent(req.params.id)
    if (!data[id]) return res.status(404).json({ error: 'Запись не найдена' })
    delete data[id]
    writeJson('message.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})

// --- PSALMS ---
router.get('/psalms', (req, res) => {
  try { res.json(readJson('psalms.json')) } catch (e) { res.status(500).json({ error: 'Ошибка чтения файла' }) }
})
router.post('/psalms', (req, res) => {
  try {
    const data = readJson('psalms.json')
    const { year, name, fileName, hasVideo } = req.body
    if (!year || !name || !fileName) return res.status(400).json({ error: 'Заполните все поля' })
    if (!data.psalms[year]) data.psalms[year] = {}
    const nums = Object.keys(data.psalms[year]).map(Number)
    const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1
    data.psalms[year][String(nextNum)] = {
      name,
      fileName,
      hasVideo: hasVideo === true || hasVideo === 'true'
    }
    writeJson('psalms.json', data)
    res.json({ success: true, num: nextNum })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})
router.delete('/psalms/:year/:num', (req, res) => {
  try {
    const data = readJson('psalms.json')
    const { year, num } = req.params
    if (!data.psalms[year] || !data.psalms[year][num]) return res.status(404).json({ error: 'Запись не найдена' })
    delete data.psalms[year][num]
    if (Object.keys(data.psalms[year]).length === 0) delete data.psalms[year]
    writeJson('psalms.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})
router.delete('/psalms/:year', (req, res) => {
  try {
    const data = readJson('psalms.json')
    const { year } = req.params
    if (!data.psalms[year]) return res.status(404).json({ error: 'Год не найден' })
    delete data.psalms[year]
    writeJson('psalms.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})

// --- MUSIC ---
router.get('/music', (req, res) => {
  try { res.json(readJson('music.json')) } catch (e) { res.status(500).json({ error: 'Ошибка чтения файла' }) }
})
router.post('/music', (req, res) => {
  try {
    const data = readJson('music.json')
    const { date } = req.body
    if (!date) return res.status(400).json({ error: 'Укажите дату' })
    const existing = Object.keys(data).filter(k => k.startsWith(date + '-'))
    const nextIndex = existing.length + 1
    const id = `${date}-${nextIndex}`
    if (data[id] !== undefined) return res.status(400).json({ error: 'Запись уже существует' })
    data[id] = ''
    writeJson('music.json', data)
    res.json({ success: true, id })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})
router.delete('/music/:id', (req, res) => {
  try {
    const data = readJson('music.json')
    const id = decodeURIComponent(req.params.id)
    if (data[id] === undefined) return res.status(404).json({ error: 'Запись не найдена' })
    delete data[id]
    writeJson('music.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})

// --- GALLERY ---
router.get('/gallery', (req, res) => {
  try { res.json(readJson('gallery.json')) } catch (e) { res.status(500).json({ error: 'Ошибка чтения файла' }) }
})
router.post('/gallery', (req, res) => {
  try {
    const data = readJson('gallery.json')
    const { date, category, name, nameOptional, whenWasThat, urlScreen, urlGallery, numberOfPhotos } = req.body
    if (!date || !category || !name || !whenWasThat || !urlScreen) return res.status(400).json({ error: 'Заполните обязательные поля' })
    const existing = Object.keys(data).filter(k => k.startsWith(date + '-'))
    const nextIndex = existing.length + 1
    const id = `${date}-${nextIndex}`
    const entry = { category, name, nameOptional: nameOptional || '', whenWasThat, urlScreen }
    if (category === 'Фотоальбом') {
      entry.urlGallery = urlGallery || ''
      entry.numberOfPhotos = numberOfPhotos ? parseInt(numberOfPhotos) : 0
    }
    data[id] = entry
    writeJson('gallery.json', data)
    res.json({ success: true, id })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})
router.put('/gallery/:id', (req, res) => {
  try {
    const data = readJson('gallery.json')
    const id = decodeURIComponent(req.params.id)
    const { category, name, nameOptional, whenWasThat, urlScreen, urlGallery, numberOfPhotos } = req.body
    if (!category || !name || !whenWasThat || !urlScreen) return res.status(400).json({ error: 'Заполните обязательные поля' })
    const entry = { category, name, nameOptional: nameOptional || '', whenWasThat, urlScreen }
    if (category === 'Фотоальбом') {
      entry.urlGallery = urlGallery || ''
      entry.numberOfPhotos = numberOfPhotos ? parseInt(numberOfPhotos) : 0
    }
    data[id] = entry
    writeJson('gallery.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})
router.delete('/gallery/:id', (req, res) => {
  try {
    const data = readJson('gallery.json')
    const id = decodeURIComponent(req.params.id)
    if (!data[id]) return res.status(404).json({ error: 'Запись не найдена' })
    delete data[id]
    writeJson('gallery.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})

// --- PUT роуты для редактирования ---

router.put('/messages/:id', (req, res) => {
  try {
    const data = readJson('message.json')
    const id = decodeURIComponent(req.params.id)
    const { name, fileName } = req.body
    if (!name || !fileName) return res.status(400).json({ error: 'Заполните все поля' })
    data[id] = { name, fileName }
    writeJson('message.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})

router.put('/services/:id', (req, res) => {
  try {
    const data = readJson('services.json')
    const id = decodeURIComponent(req.params.id)
    const { minister, name, fileName } = req.body
    if (!minister || !name || !fileName) return res.status(400).json({ error: 'Заполните все поля' })
    const existing = data[id] || {}
    data[id] = { date: existing.date || id.slice(0, 10), minister, name, fileName }
    writeJson('services.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})

router.put('/ministers/:name', (req, res) => {
  try {
    const data = readJson('ministers.json')
    const name = decodeURIComponent(req.params.name)
    if (!data[name]) return res.status(404).json({ error: 'Служитель не найден' })
    const { link, pathMp3, pathMp4 } = req.body
    if (!link || !pathMp3 || !pathMp4) return res.status(400).json({ error: 'Заполните все поля' })
    data[name] = { link, pathMp3, pathMp4 }
    writeJson('ministers.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})

router.put('/psalms/:year/:num', (req, res) => {
  try {
    const data = readJson('psalms.json')
    const { year, num } = req.params
    const { name, fileName, hasVideo } = req.body
    if (!name || !fileName) return res.status(400).json({ error: 'Заполните все поля' })
    if (!data.psalms[year]) data.psalms[year] = {}
    data.psalms[year][num] = {
      name,
      fileName,
      hasVideo: hasVideo === true || hasVideo === 'true'
    }
    writeJson('psalms.json', data)
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Ошибка записи файла' }) }
})

module.exports = router
