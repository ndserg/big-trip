# Проект «Большое путешествие»

**_современный сервис для настоящих путешественников._**

---

**[Проект On-Line](https://bigtrip.dendev.ru)**

#### Используемые технологии

- Синтаксис ES6
- Модули JS
- Работа с DOM
- REST API
- Сборка Webpack

### Описание проекта

Сервис помогает детально спланировать маршрут поездки, рассчитать стоимость путешествия и получить информацию о достопримечательностях. Минималистичный интерфейс не даст повода отвлечься и сфокусирует внимание на планировании путешествия.

- Точки маршрута, после загрузки с сервера группируются по дням (по датам) и сортируются по умолчанию в порядке возрастания. Доступны сортировка по дате и цене, а также три фильтра: "Все точки", "Будущие", "Прошедшие".
- Общая стоимость маршрута автоматически пересчитывается и выводится в шапке.
- Также в шапке выводятся начальная/конечная точки и начальная/конечная даты маршрута.
- При редактировании или добавлении точки маршрута, одновременно может быть только одна форма. Остальные формы закрываются, не сохраненные данные сбрасываются. При этом фунционал кнопки Добавление/Удаление точки в "Избранное" происходит сразу, без необходимости сохранения.
- Стастика выводится с помощью библиотеки Chart.js. Доступна общая информация: о сумме по точкам маршрута, о количестве раз использованного транспорта, о времени проведенном в остановчных пунктах маршрута (рестораны, аэропорты и т.д.);

Общая информация о проекте:

- Составление маршрута путешествия: добавление точек в маршрут
- Просмотр отдельных точек
- Подсчёт стоимости маршрута
- Добавление предложений для каждой из точек маршрута
- Просмотр маршрута в разных вариантах

- Внешние библиотеки: "Chart.JS" - для вывода статистики.
- В проекте использовались: паттерны MVC, Observer, Adapter.
- В проекте настроена сборка JavaScript модулей с помощью Webpack.

### Сборка проекта

> Готовый проект формируется в папку - dist.

- Перед сборкой и запуском проекта необходимо установить зависимости командой: `npm i`
- Сборка продакшн (готовый проект для размещения на хостинге): `npm run build`
- Запуск проекта локальнов в Dev режиме: `npm start`

### Скриншоты

![Скриншот Главная](/screenshots/bigtrip-1.jpg)
![Скриншот добавление точки](/screenshots/bigtrip-2.jpg)
![Скриншот редактирование точки](/screenshots/bigtrip-3.jpg)
![Скриншот статистика](/screenshots/bigtrip-4.jpg)
