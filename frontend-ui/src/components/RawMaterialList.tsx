import React from 'react';
import { RawMaterial } from '../types/RawMaterial';
import './RawMaterialList.css';

interface RawMaterialListProps {
  rawMaterials: RawMaterial[];
  onEdit: (rawMaterial: RawMaterial) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const RawMaterialList: React.FC<RawMaterialListProps> = ({
  rawMaterials,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="raw-material-list">
        <div className="loading">
          <div>Carregando matérias-primas...</div>
        </div>
      </div>
    );
  }

  if (rawMaterials.length === 0) {
    return (
      <div className="raw-material-list">
        <div className="empty-state">
          <div className="icon">🏭</div>
          <h3>Nenhuma matéria-prima cadastrada</h3>
          <p>Clique em "Nova Matéria-Prima" para adicionar a primeira</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatStock = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="raw-material-list">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Custo por Unidade</th>
              <th>Estoque Atual</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {rawMaterials.map((rawMaterial) => (
              <tr key={rawMaterial.id}>
                <td>
                  <strong>{rawMaterial.name}</strong>
                </td>
                <td>{rawMaterial.description}</td>
                <td className="cost">{formatCurrency(rawMaterial.cost)}</td>
                <td className="stock">{formatStock(rawMaterial.currentStock)}</td>
                <td>
                  <div className="actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => onEdit(rawMaterial)}
                      title="Editar matéria-prima"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => onDelete(rawMaterial.id)}
                      title="Excluir matéria-prima"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RawMaterialList;
