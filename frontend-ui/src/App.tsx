import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  clearError,
} from './store/slices/productSlice';
import { Product, ProductRequest } from './types/Product';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import Modal from './components/Modal';
import ConfirmDialog from './components/ConfirmDialog';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (productData: ProductRequest) => {
    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id, product: productData })).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      handleCloseModal();
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const handleOpenDeleteConfirm = (id: number) => {
    setDeletingProductId(id);
    setIsConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIsConfirmOpen(false);
    setDeletingProductId(null);
  };

  const handleConfirmDelete = async () => {
    if (deletingProductId !== null) {
      try {
        await dispatch(deleteProduct(deletingProductId)).unwrap();
        handleCloseDeleteConfirm();
      } catch (err) {
        // Error is handled by Redux
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📦 Gestão de Produtos</h1>
        <p>Sistema de cadastro e gerenciamento de produtos</p>
      </header>

      <main className="app-main">
        <div className="toolbar">
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            + Novo Produto
          </button>
        </div>

        <ProductList
          products={products}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteConfirm}
          isLoading={loading}
        />
      </main>

      <Modal
        isOpen={isModalOpen}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        onClose={handleCloseModal}
      >
        <ProductForm
          initialData={
            editingProduct
              ? {
                  name: editingProduct.name,
                  description: editingProduct.description,
                  price: editingProduct.price,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={loading}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Excluir Produto"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteConfirm}
        isLoading={loading}
      />
    </div>
  );
}

export default App;
