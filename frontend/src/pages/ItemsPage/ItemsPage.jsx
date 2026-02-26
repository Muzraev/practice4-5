import React, { useState, useEffect } from 'react';
import './ItemsPage.scss';
import ItemList from '../../components/ItemList';
import ItemModal from '../../components/ItemModal';
import { api } from '../../api';

export default function ItemsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await api.getItems();
            setItems(data);
        } catch (err) {
            console.error(err);
            alert('Ошибка загрузки товаров');
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setModalMode('create');
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setModalMode('edit');
        setEditingItem(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingItem(null);
    };

    const handleDelete = async (id) => {
        const ok = window.confirm('Удалить товар?');
        if (!ok) return;
        try {
            await api.deleteItem(id);
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error(err);
            alert('Ошибка удаления');
        }
    };

    const handleSubmitModal = async (payload) => {
        try {
            if (modalMode === 'create') {
                const newItem = await api.createItem(payload);
                setItems(prev => [...prev, newItem]);
            } else {
                const updated = await api.updateItem(payload.id, payload);
                setItems(prev => prev.map(item => item.id === payload.id ? updated : item));
            }
            closeModal();
        } catch (err) {
            console.error(err);
            alert('Ошибка сохранения');
        }
    };

    return (
        <div className="page">
            <header className="header">
                <div className="header__inner">
                    <div className="brand">Магазин товаров</div>
                    <div className="header__right">React</div>
                </div>
            </header>
            <main className="main">
                <div className="container">
                    <div className="toolbar">
                        <h1 className="title">Товары</h1>
                        <button className="btn btn--primary" onClick={openCreate}>+ Добавить</button>
                    </div>
                    {loading ? (
                        <div className="empty">Загрузка...</div>
                    ) : (
                        <ItemList items={items} onEdit={openEdit} onDelete={handleDelete} />
                    )}
                </div>
            </main>
            <footer className="footer">
                <div className="footer__inner">© {new Date().getFullYear()} Магазин</div>
            </footer>
            <ItemModal
                open={modalOpen}
                mode={modalMode}
                initialItem={editingItem}
                onClose={closeModal}
                onSubmit={handleSubmitModal}
            />
        </div>
    );
}