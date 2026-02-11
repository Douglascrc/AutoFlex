import React from 'react';
import { Product } from '../types/Product';
import './ProductList.css';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="product-list-loading">
        <div className="spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-list-empty">
        <p>Nenhum produto cadastrado.</p>
        <p>Clique em "Novo Produto" para adicionar.</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td className="description-cell">{product.description}</td>
              <td>{formatCurrency(product.price)}</td>
              <td className="actions-cell">
                <button
                  className="btn-icon btn-edit"
                  onClick={() => onEdit(product)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon btn-delete"
                  onClick={() => onDelete(product.id)}
                  title="Excluir"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;

