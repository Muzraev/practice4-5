const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

function findItemOr404(id, res) {
    const item = items.find(i => i.id === id);
    if (!item) {
        res.status(404).json({ error: "Item not found" });
        return null;
    }
    return item;
}


app.get('/api/items', (req, res) => {
    res.json(items);
});

app.get('/api/items/:id', (req, res) => {
    const id = req.params.id;
    const item = findItemOr404(id, res);
    if (!item) return;
    res.json(item);
});

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

app.patch('/api/items/:id', (req, res) => {
    const id = req.params.id;
    const item = findItemOr404(id, res);
    if (!item) return;

    const { name, category, description, price, stock } = req.body;
    if (name !== undefined) item.name = name.trim();
    if (category !== undefined) item.category = category.trim();
    if (description !== undefined) item.description = description.trim();
    if (price !== undefined) item.price = Number(price);
    if (stock !== undefined) item.stock = Number(stock);

    res.json(item);
});

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
    console.log(`Backend запущен на http://localhost:${port}`);
});