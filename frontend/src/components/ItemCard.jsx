import React from 'react';

export default function ItemCard({ item, onEdit, onDelete }) {
    return (
        <div className="item-card">
            <div className="item-card__main">
                <div className="item-card__id">#{item.id.slice(0,4)}</div>
                <div className="item-card__name">{item.name}</div>
                <div className="item-card__category">{item.category}</div>
                <div className="item-card__price">{item.price} ₽</div>
                <div className="item-card__stock">Осталось: {item.stock}</div>
                <div className="item-card__description">{item.description}</div>
            </div>
            <div className="item-card__actions">
                <button className="btn" onClick={() => onEdit(item)}>✎</button>
                <button className="btn btn--danger" onClick={() => onDelete(item.id)}>✕</button>
            </div>
        </div>
    );
}