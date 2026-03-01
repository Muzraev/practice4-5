const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('Body:', req.body);
    }
  });
  next();
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API интернет-магазина (товары)',
      version: '1.0.0',
      description: 'Управление товарами: создание, чтение, обновление, удаление',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Локальный сервер',
      },
    ],
  },
  apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный идентификатор товара (генерируется автоматически)
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена в рублях
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *       example:
 *         id: "abc123"
 *         name: "Ноутбук"
 *         category: "Электроника"
 *         description: "Мощный игровой ноутбук"
 *         price: 75000
 *         stock: 5
 */

let items = [
  { id: nanoid(6), name: 'Ноутбук', category: 'Электроника', description: 'Мощный игровой ноутбук', price: 75000, stock: 5 },
  { id: nanoid(6), name: 'Мышь', category: 'Электроника', description: 'Беспроводная мышь', price: 1500, stock: 20 },
  { id: nanoid(6), name: 'Клавиатура', category: 'Электроника', description: 'Механическая клавиатура', price: 3000, stock: 7 },
  { id: nanoid(6), name: 'Монитор', category: 'Электроника', description: '27 дюймов, 4K', price: 25000, stock: 3 },
  { id: nanoid(6), name: 'Наушники', category: 'Аудио', description: 'Беспроводные с шумоподавлением', price: 8000, stock: 12 },
  { id: nanoid(6), name: 'Колонка', category: 'Аудио', description: 'Портативная колонка', price: 3500, stock: 8 },
  { id: nanoid(6), name: 'Смартфон', category: 'Электроника', description: 'Android, 128GB', price: 40000, stock: 6 },
  { id: nanoid(6), name: 'Чехол', category: 'Аксессуары', description: 'Силиконовый чехол', price: 500, stock: 30 },
  { id: nanoid(6), name: 'Зарядное устройство', category: 'Аксессуары', description: 'Быстрая зарядка 30W', price: 1200, stock: 15 },
  { id: nanoid(6), name: 'Внешний диск', category: 'Хранение', description: '1TB внешний SSD', price: 7000, stock: 4 }
];

function findItemOr404(id, res) {
  const item = items.find(i => i.id === id);
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return null;
  }
  return item;
}


/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
app.get('/api/items', (req, res) => {
  res.json(items);
});

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Товар не найден
 */
app.get('/api/items/:id', (req, res) => {
  const id = req.params.id;
  const item = findItemOr404(id, res);
  if (!item) return;
  res.json(item);
});

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Создаёт новый товар
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *             example:
 *               name: "Монитор"
 *               category: "Электроника"
 *               description: "27 дюймов, 4K"
 *               price: 25000
 *               stock: 3
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Не все обязательные поля заполнены
 */
app.post('/api/items', (req, res) => {
  const { name, category, description, price, stock } = req.body;
  if (!name || !category || !description || price === undefined || stock === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newItem = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock)
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

/**
 * @swagger
 * /api/items/{id}:
 *   patch:
 *     summary: Обновляет существующий товар (частично)
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *             example:
 *               price: 23000
 *               stock: 5
 *     responses:
 *       200:
 *         description: Обновлённый товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Товар не найден
 *       400:
 *         description: Нет данных для обновления
 */
app.patch('/api/items/:id', (req, res) => {
  const id = req.params.id;
  const item = findItemOr404(id, res);
  if (!item) return;

  if (req.body.name === undefined && req.body.category === undefined && req.body.description === undefined && req.body.price === undefined && req.body.stock === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const { name, category, description, price, stock } = req.body;
  if (name !== undefined) item.name = name.trim();
  if (category !== undefined) item.category = category.trim();
  if (description !== undefined) item.description = description.trim();
  if (price !== undefined) item.price = Number(price);
  if (stock !== undefined) item.stock = Number(stock);

  res.json(item);
});

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удалён (нет тела ответа)
 *       404:
 *         description: Товар не найден
 */
app.delete('/api/items/:id', (req, res) => {
  const id = req.params.id;
  const exists = items.some(i => i.id === id);
  if (!exists) return res.status(404).json({ error: "Item not found" });
  items = items.filter(i => i.id !== id);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});