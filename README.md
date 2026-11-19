# Cyber Tetris — Synthwave World v10

Новая сборка игры с отдельными графическими и аудиоресурсами. Сама игра остаётся одностраничной: `index.html` — единственная точка входа, а тяжёлые файлы вынесены в `assets/`, чтобы браузер мог кэшировать их независимо от кода.

## Что внутри

- Единая аркадная система меню: одинаковая высота основных и вторичных кнопок во всех экранах, одинаковые поля и выравнивание; панельные кнопки больше не меняют размер между стартом, паузой, залом славы и испытаниями.
- Полноэкранный режим запускается только по нажатию кнопки ⛶. При старте и перезапуске игры браузер больше не переводится в fullscreen автоматически. Сенсорные игровые кнопки скрыты на стартовом экране и появляются только после начала партии.

- `assets/backgrounds/synthwave-valley.webp` — кинематографичная панорама. Солнце, звёзды, пролетающие корабли, атмосферные слои, перспектива и скорость окружения остаются динамическими Canvas-слоями.
- `assets/effects/energy-shockwave-atlas.png` — прозрачный атлас 4×4 с 16 кадрами энергетической волны. Он используется при очистке рядов, Perfect Clear и Game Over.
- `assets/audio/music/kalinka-synthwave-main.ogg` — основной 96-секундный synthwave-микс с мотивом «Калинки», более глубоким sub-bass, pluck/bell-линией, синт-брассом, широкими падами и расширенной перкуссией.
- `assets/audio/music/kalinka-synthwave-overdrive.ogg` — более плотная 96-секундная версия. При повышении уровня игра плавно переходит от основного микса к overdrive.
- Для браузеров без поддержки декодирования OGG оставлены MP3-файлы с теми же аранжировками.
- Музыка декодируется в Web Audio и зацикливается по точным sample-границам: 0,75-секундное вступление служит переходом, основной музыкальный цикл длится 96 секунд. На стыке хвост заранее сводится с вступлением, поэтому нет резкого перезапуска или паузы. Пауза и отключение звука сохраняют позицию композиции.
- `assets/audio/sfx/` — отдельные эффекты жёсткого падения, очистки, Тетриса, T-Spin, Perfect Clear и Game Over.
- HUD больше не вспыхивает при каждом шаге мягкого падения: анимация чисел оставлена для значимых наград и очистки рядов, а её яркость и масштаб уменьшены.
- `backend/` — готовый шаблон API для общего онлайн-рейтинга на Cloudflare Workers + D1.

Если браузер блокирует внешний аудиофайл, игра автоматически использует встроенный WebAudio-синтезатор. Для запуска музыки нужен первый клик пользователя по кнопке «Начать игру» — это стандартное ограничение браузеров.

## Публикация на бесплатном GitHub Pages

1. Распакуйте архив.
2. Загрузите **содержимое** папки проекта в корень репозитория: `index.html`, `assets/`, `backend/`, `README.md` должны находиться рядом.
3. В GitHub откройте Settings → Pages → Deploy from a branch → выберите ветку и `/ (root)`.
4. Откройте опубликованный HTTPS-адрес. Внешние библиотеки и сборщик не нужны.

Не загружайте только `index.html`: ему нужны соседние папки `assets/`.

## Подключение общего онлайн-рейтинга (необязательно)

Локальные рекорды и ежедневные испытания работают сразу, без аккаунтов и серверов. GitHub Pages не выполняет серверный код и не предоставляет общую базу данных, поэтому глобальный рейтинг требует отдельного API. В архиве подготовлен вариант Cloudflare Workers + D1.

1. Установите Wrangler и войдите в Cloudflare:

   ```sh
   npm install -g wrangler
   wrangler login
   ```

2. Создайте базу D1:

   ```sh
   wrangler d1 create cyber-tetris
   ```

3. Скопируйте `backend/wrangler.toml.example` в `backend/wrangler.toml`. Впишите выданный `database_id` и точный origin сайта GitHub Pages, например `https://username.github.io`.
4. Перейдите в папку backend и примените схему:

   ```sh
   cd backend
   wrangler d1 execute cyber-tetris --file=schema.sql --remote
   ```

5. Разверните API:

   ```sh
   wrangler deploy
   ```

6. Скопируйте адрес Worker в `assets/config.js`:

   ```js
   window.CYBER_TETRIS_CONFIG = {
     apiBase: 'https://YOUR-WORKER.workers.dev'
   };
   ```

7. Вернитесь в корень проекта, загрузите изменённый `assets/config.js` в GitHub и дождитесь обновления Pages. В экране «Зал славы» появятся глобальный топ-10 и возможность отправить лучший локальный результат под никнеймом.

Для ограничения частоты отправки можно дополнительно создать KV namespace (`wrangler kv namespace create RATE_LIMITS`), затем раскомментировать блок `kv_namespaces` в `wrangler.toml` и вписать полученный ID.

**Важно:** публичный рейтинг проверяет формат и диапазоны значений, но клиентский счёт можно подделать. Для дружеского рейтинга этого достаточно; для серьёзного соревнования нужна серверная проверка партии или подписанное доказательство игрового процесса.


## Mobile performance update (v11)
- Adaptive canvas backing resolution for phones; desktop keeps the high-DPI cap.
- Cached scene backplate, starfield, ship sprites, background particle glow, block atlas and ghost tile.
- Background refresh is decoupled (45 FPS typical mobile / 36 FPS low-power phones) while gameplay and board effects continue at the display refresh rate.
- Zone CSS classes now update only on zone changes; mobile uses compositor-friendly static neon frame gradients and reduced backdrop blur.
- No gameplay effects, sound cues, scoring rules or visual event sequences were removed.
