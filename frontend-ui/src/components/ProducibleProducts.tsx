import React, { useEffect, useState } from 'react';
import { Product } from '../types/Product';
import { productService } from '../services/productService';
import './ProductList.css';

interface ProducibleProductsProps {
  onClose: () => void;
}

const ProducibleProducts: React.FC<ProducibleProductsProps> = ({ onClose }) => {
  const [producibleProducts, setProducibleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducibleProducts = async () => {
      try {
        setLoading(true);
        const products = await productService.getProducible();
        setProducibleProducts(products);
      } catch (err: any) {
        setError('Erro ao carregar produtos que podem ser produzidos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducibleProducts();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="product-list">
        <div className="loading">
          <div>Carregando produtos que podem ser produzidos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list">
        <div className="empty-state">
          <div className="icon">⚠️</div>
          <h3>Erro</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (producibleProducts.length === 0) {
    return (
      <div className="product-list">
        <div className="empty-state">
          <div className="icon">📦</div>
          <h3>Nenhum produto pode ser produzido</h3>
          <p>Não há estoque suficiente de matérias-primas para produzir nenhum produto no momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            {producibleProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                </td>
                <td>{product.description}</td>
                <td className="price">{formatCurrency(product.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProducibleProducts;
