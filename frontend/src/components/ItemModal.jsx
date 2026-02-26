import React, { useEffect, useState } from 'react';

export default function ItemModal({ open, mode, initialItem, onClose, onSubmit }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        if (!open) return;
        setName(initialItem?.name ?? '');
        setCategory(initialItem?.category ?? '');
        setDescription(initialItem?.description ?? '');
        setPrice(initialItem?.price != null ? String(initialItem.price) : '');
        setStock(initialItem?.stock != null ? String(initialItem.stock) : '');
    }, [open, initialItem]);

    if (!open) return null;

    const title = mode === 'edit' ? 'Редактировать товар' : 'Добавить товар';

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedCategory = category.trim();
        const trimmedDesc = description.trim();
        const numPrice = Number(price);
        const numStock = Number(stock);

        if (!trimmedName || !trimmedCategory || !trimmedDesc) {
            alert('Заполните все текстовые поля');
            return;
        }
        if (!Number.isFinite(numPrice) || numPrice <= 0) {
            alert('Цена должна быть положительным числом');
            return;
        }
        if (!Number.isInteger(numStock) || numStock < 0) {
            alert('Количество должно быть целым неотрицательным числом');
            return;
        }

        onSubmit({
            id: initialItem?.id,
            name: trimmedName,
            category: trimmedCategory,
            description: trimmedDesc,
            price: numPrice,
            stock: numStock
        });
    };

    return (
        <div className="backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <div className="modal__title">{title}</div>
                    <button className="iconBtn" onClick={onClose}>✕</button>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">
                        Название
                        <input className="input" value={name} onChange={e => setName(e.target.value)} autoFocus />
                    </label>
                    <label className="label">
                        Категория
                        <input className="input" value={category} onChange={e => setCategory(e.target.value)} />
                    </label>
                    <label className="label">
                        Описание
                        <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} />
                    </label>
                    <label className="label">
                        Цена (₽)
                        <input className="input" type="number" min="1" value={price} onChange={e => setPrice(e.target.value)} />
                    </label>
                    <label className="label">
                        Количество на складе
                        <input className="input" type="number" min="0" step="1" value={stock} onChange={e => setStock(e.target.value)} />
                    </label>
                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>Отмена</button>
                        <button type="submit" className="btn btn--primary">
                            {mode === 'edit' ? 'Сохранить' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}