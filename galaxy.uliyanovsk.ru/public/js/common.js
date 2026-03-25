// Общие функции для всех страниц админки

// Выход из системы
async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
  window.location.href = '/login.html'
}
