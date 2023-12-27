[code-badge]: https://img.shields.io/badge/source-black?logo=github

# aaio.js - В разработке

<a href="https://aaio.io/" target="_blank">
	<img alt="AAIO Badge" src="https://aaio.io/assets/svg/banners/big/dark-2.svg" title="Aaio - Сервис по приему онлайн платежей">
</a>

[![kewldan - AAIO](https://img.shields.io/static/v1?label=kewldan&message=aaio.js&color=blue&logo=github)](https://github.com/kewldan/AAIO "Go to GitHub repo")
[![GitHub release](https://img.shields.io/github/release/kewldan/aaio.js?include_prereleases=&sort=semver&color=blue)](https://github.com/kewldan/AAIO/releases/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#Лицензия)

[AAIO Официальная документация](https://wiki.aaio.io/)

Библиотека для удобной работы с API AAIO https://aaio.io/ на TypeScript.

### Ссылки
npm - https://www.npmjs.com/package/aaio.js
github - https://github.com/kewldan/aaio.js

## Установка

npm - `$ npm i aaio.js`

## Прием платежей

```js
const client = new Client('API-KEY'); // Создаем клиент
const merchant = new client.createMerchant('MERCHANT-ID', 'SECRET-KEY'); // Регистрируем магазин

const payment_url = merchant.createPayment(100, 'my-order-id'); // Создаем ссылку для оплаты

// Отправляем payment_url клиенту, ждем оплату

const payment_info = await merchant.getPaymentInfo('my-order-id');

console.log(`Текущий статус: ${payment_info.status}`);
```

```js
const client = new Client('API-KEY'); // Создаем клиент

const payoff_create_info = await client.createPayoff('qiwi', 100, '79931234567', 0, 'my-payoff-id');
console.log(payoff_create_info.amount_down) // Сколько списано
```

## Контакты

Почта - kewldanil1@gmail.com
Телеграм [@kewldan](https://t.me/kewldan)

## Лицензия

Released under [MIT](/LICENSE) by [@kewldan](https://github.com/kewldan).
