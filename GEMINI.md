# Правила проекта: Разлиновка (razlinovka.tochilka.app)

## Что это
Генератор разлиновки для тетрадей — пользователь настраивает тип линий (клетка, линейка, косая), размеры, поля, и скачивает PDF.

## Стек
- **Frontend:** React + Vite + Tailwind
- **PDF:** jsPDF + svg2pdf.js
- **Backend API:** Node.js (tochilka-api) → https://exams.tochilka.app/api/v2
- **Авторизация:** Cookie-based (httpOnly). PocketBase SDK **НЕ ИСПОЛЬЗУЕТСЯ**.

## КРИТИЧЕСКОЕ ПРАВИЛО
В этом проекте НЕТ PocketBase. Все запросы к серверу идут через `src/services/apiClient.js`.
Не пытайтесь импортировать `pocketbase` или использовать `pb.collection()`.

## Особенности
- Основная логика — клиентская (генерация PDF в браузере)
- Бэкенд нужен только для: авторизации, сохранения настроек пользователя, аналитики
- Старая версия (vanilla JS) лежит в корне: `index.html`, `js/app.js`, `css/` — **не трогать**, это архив

## Бэкенд
Серверная логика (когда появится) будет в `D:\tochilka-api\src\apps\razlinovka\`.
Структура: `routes/` + `services/` + `schemas/`.

## Развертывание
GitHub repo: `onlinetochilka/Razlinovka`.
При push в main → GitHub Actions → Vite build → SCP на VPS.
Статика → `/var/www/razlinovka.tochilka.app`.
