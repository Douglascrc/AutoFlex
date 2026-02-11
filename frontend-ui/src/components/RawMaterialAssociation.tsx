import React, { useState } from 'react';
import { useAppSelector } from '../hooks/useRedux';
import { ProductRawMaterial } from '../types/RawMaterial';
import { productService } from '../services/productService';
import './RawMaterialAssociation.css';

interface RawMaterialAssociationProps {
  productId?: number;
  onAssociationAdded?: () => void;
}

interface Association extends ProductRawMaterial {
  rawMaterialName: string;
}

const RawMaterialAssociation: React.FC<RawMaterialAssociationProps> = ({
  productId,
  onAssociationAdded,
}) => {
  const { rawMaterials } = useAppSelector((state) => state.rawMaterials);
  const [selectedRawMaterialId, setSelectedRawMaterialId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableRawMaterials = rawMaterials.filter(
    (rm) => !associations.some((assoc) => assoc.rawMaterialId === rm.id)
  );

  const handleAddAssociation = async () => {
    if (!selectedRawMaterialId || quantity <= 0) {
      alert('Por favor, selecione uma matéria-prima e informe a quantidade necessária.');
      return;
    }

    const rawMaterial = rawMaterials.find((rm) => rm.id === selectedRawMaterialId);
    if (!rawMaterial) return;

    const newAssociation: Association = {
      rawMaterialId: selectedRawMaterialId as number,
      quantity,
      rawMaterialName: rawMaterial.name,
    };

    // Se temos um productId, salva no backend
    if (productId) {
      try {
        setIsLoading(true);
        await productService.addRawMaterial(productId, {
          rawMaterialId: selectedRawMaterialId as number,
          quantity,
        });

        if (onAssociationAdded) {
          onAssociationAdded();
        }
      } catch (error) {
        alert('Erro ao associar matéria-prima ao produto');
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Adiciona à lista local
    setAssociations([...associations, newAssociation]);
    setSelectedRawMaterialId('');
    setQuantity(0);
  };

  const handleRemoveAssociation = (rawMaterialId: number) => {
    setAssociations(associations.filter((assoc) => assoc.rawMaterialId !== rawMaterialId));
  };

  const formatQuantity = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (!productId) {
    return (
      <div className="raw-material-association">
        <h3>🏭 Matérias-Primas Necessárias</h3>
        <p style={{ color: '#666', fontSize: '14px', fontStyle: 'italic' }}>
          Salve o produto primeiro para associar matérias-primas
        </p>
      </div>
    );
  }

  return (
    <div className="raw-material-association">
      <h3>🏭 Matérias-Primas Necessárias</h3>

      <div className="association-form">
        <div className="form-group">
          <label htmlFor="rawMaterial">Matéria-Prima</label>
          <select
            id="rawMaterial"
            value={selectedRawMaterialId}
            onChange={(e) => setSelectedRawMaterialId(e.target.value ? Number(e.target.value) : '')}
            disabled={isLoading}
          >
            <option value="">Selecione uma matéria-prima</option>
            {availableRawMaterials.map((rm) => (
              <option key={rm.id} value={rm.id}>
                {rm.name} (Estoque: {formatQuantity(rm.currentStock)})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantidade</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        <button
          type="button"
          className="btn-add"
          onClick={handleAddAssociation}
          disabled={isLoading || !selectedRawMaterialId || quantity <= 0}
        >
          {isLoading ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>

      <div className="associations-list">
        {associations.length === 0 ? (
          <div className="empty-associations">
            Nenhuma matéria-prima associada
          </div>
        ) : (
          associations.map((association) => (
            <div key={association.rawMaterialId} className="association-item">
              <div className="association-info">
                <div className="name">{association.rawMaterialName}</div>
                <div className="quantity">
                  Quantidade necessária: {formatQuantity(association.quantity)}
                </div>
              </div>
              <button
                className="btn-remove"
                onClick={() => handleRemoveAssociation(association.rawMaterialId)}
                title="Remover associação"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RawMaterialAssociation;
