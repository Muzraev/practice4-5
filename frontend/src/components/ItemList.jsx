import React from 'react';
import ItemCard from './ItemCard';

export default function ItemList({ items, onEdit, onDelete }) {
    if (!items.length) {
        return <div className="empty">Товаров пока нет</div>;
    }
    return (
        <div className="item-list">
            {items.map(item => (
                <ItemCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}