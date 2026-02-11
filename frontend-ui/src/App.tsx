import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  clearError,
} from './store/slices/productSlice';
import {
  fetchRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
  clearError as clearRawMaterialError,
} from './store/slices/rawMaterialSlice';
import { Product, ProductRequest } from './types/Product';
import { RawMaterial, RawMaterialRequest } from './types/RawMaterial';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import RawMaterialList from './components/RawMaterialList';
import RawMaterialForm from './components/RawMaterialForm';
import ProducibleProducts from './components/ProducibleProducts';
import Modal from './components/Modal';
import ConfirmDialog from './components/ConfirmDialog';
import './App.css';

type ActiveTab = 'products' | 'raw-materials' | 'producible';

function App() {
  const dispatch = useAppDispatch();
  const { products, loading: productsLoading, error: productsError } = useAppSelector((state) => state.products);
  const { rawMaterials, loading: rawMaterialsLoading, error: rawMaterialsError } = useAppSelector((state) => state.rawMaterials);

  const [activeTab, setActiveTab] = useState<ActiveTab>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingRawMaterial, setEditingRawMaterial] = useState<RawMaterial | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [deletingRawMaterialId, setDeletingRawMaterialId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  useEffect(() => {
    if (productsError) {
      alert(productsError);
      dispatch(clearError());
    }
  }, [productsError, dispatch]);

  useEffect(() => {
    if (rawMaterialsError) {
      alert(rawMaterialsError);
      dispatch(clearRawMaterialError());
    }
  }, [rawMaterialsError, dispatch]);

  // Product handlers
  const handleOpenCreateProductModal = () => {
    setEditingProduct(null);
    setEditingRawMaterial(null);
    setIsModalOpen(true);
  };

  const handleOpenEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setEditingRawMaterial(null);
    setIsModalOpen(true);
  };

  const handleProductSubmit = async (productData: ProductRequest) => {
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

  const handleOpenDeleteProductConfirm = (id: number) => {
    setDeletingProductId(id);
    setDeletingRawMaterialId(null);
    setIsConfirmOpen(true);
  };

  const handleConfirmDeleteProduct = async () => {
    if (deletingProductId !== null) {
      try {
        await dispatch(deleteProduct(deletingProductId)).unwrap();
        handleCloseDeleteConfirm();
      } catch (err) {
        // Error is handled by Redux
      }
    }
  };

  // Raw Material handlers
  const handleOpenCreateRawMaterialModal = () => {
    setEditingRawMaterial(null);
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditRawMaterialModal = (rawMaterial: RawMaterial) => {
    setEditingRawMaterial(rawMaterial);
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleRawMaterialSubmit = async (rawMaterialData: RawMaterialRequest) => {
    try {
      if (editingRawMaterial) {
        await dispatch(updateRawMaterial({ id: editingRawMaterial.id, rawMaterial: rawMaterialData })).unwrap();
      } else {
        await dispatch(createRawMaterial(rawMaterialData)).unwrap();
      }
      handleCloseModal();
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const handleOpenDeleteRawMaterialConfirm = (id: number) => {
    setDeletingRawMaterialId(id);
    setDeletingProductId(null);
    setIsConfirmOpen(true);
  };

  const handleConfirmDeleteRawMaterial = async () => {
    if (deletingRawMaterialId !== null) {
      try {
        await dispatch(deleteRawMaterial(deletingRawMaterialId)).unwrap();
        handleCloseDeleteConfirm();
      } catch (err) {
        // Error is handled by Redux
      }
    }
  };

  // Common handlers
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setEditingRawMaterial(null);
  };

  const handleCloseDeleteConfirm = () => {
    setIsConfirmOpen(false);
    setDeletingProductId(null);
    setDeletingRawMaterialId(null);
  };

  const handleConfirmDelete = async () => {
    if (deletingProductId !== null) {
      await handleConfirmDeleteProduct();
    } else if (deletingRawMaterialId !== null) {
      await handleConfirmDeleteRawMaterial();
    }
  };

  const getModalTitle = () => {
    if (editingProduct) return 'Editar Produto';
    if (editingRawMaterial) return 'Editar Matéria-Prima';
    if (activeTab === 'products') return 'Novo Produto';
    return 'Nova Matéria-Prima';
  };

  const getDeleteMessage = () => {
    if (deletingProductId !== null) {
      return 'Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.';
    }
    return 'Tem certeza que deseja excluir esta matéria-prima? Esta ação não pode ser desfeita.';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <>
            <div className="toolbar">
              <button className="btn btn-primary" onClick={handleOpenCreateProductModal}>
                + Novo Produto
              </button>
            </div>
            <ProductList
              products={products}
              onEdit={handleOpenEditProductModal}
              onDelete={handleOpenDeleteProductConfirm}
              isLoading={productsLoading}
            />
          </>
        );
      case 'raw-materials':
        return (
          <>
            <div className="toolbar">
              <button className="btn btn-primary" onClick={handleOpenCreateRawMaterialModal}>
                + Nova Matéria-Prima
              </button>
            </div>
            <RawMaterialList
              rawMaterials={rawMaterials}
              onEdit={handleOpenEditRawMaterialModal}
              onDelete={handleOpenDeleteRawMaterialConfirm}
              isLoading={rawMaterialsLoading}
            />
          </>
        );
      case 'producible':
        return <ProducibleProducts onClose={() => setActiveTab('products')} />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏭 AutoFlex</h1>
        <p>Sistema de Gestão de Produtos e Matérias-Primas</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Produtos
        </button>
        <button
          className={`nav-btn ${activeTab === 'raw-materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('raw-materials')}
        >
          🏭 Matérias-Primas
        </button>
        <button
          className={`nav-btn ${activeTab === 'producible' ? 'active' : ''}`}
          onClick={() => setActiveTab('producible')}
        >
          🎯 Produtos Disponíveis
        </button>
      </nav>

      <main className="app-main">
        {renderTabContent()}
      </main>

      <Modal
        isOpen={isModalOpen}
        title={getModalTitle()}
        onClose={handleCloseModal}
      >
        {editingProduct || (!editingRawMaterial && activeTab === 'products') ? (
          <ProductForm
            productId={editingProduct?.id}
            initialData={
              editingProduct
                ? {
                    name: editingProduct.name,
                    description: editingProduct.description,
                    price: editingProduct.price,
                  }
                : undefined
            }
            onSubmit={handleProductSubmit}
            onCancel={handleCloseModal}
            isLoading={productsLoading}
          />
        ) : (
          <RawMaterialForm
            initialData={
              editingRawMaterial
                ? {
                    name: editingRawMaterial.name,
                    description: editingRawMaterial.description,
                    cost: editingRawMaterial.cost,
                    currentStock: editingRawMaterial.currentStock,
                  }
                : undefined
            }
            onSubmit={handleRawMaterialSubmit}
            onCancel={handleCloseModal}
            isLoading={rawMaterialsLoading}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title={deletingProductId !== null ? 'Excluir Produto' : 'Excluir Matéria-Prima'}
        message={getDeleteMessage()}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteConfirm}
        isLoading={productsLoading || rawMaterialsLoading}
      />
    </div>
  );
}

export default App;
