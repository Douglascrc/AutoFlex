import React, { useState, useEffect } from 'react';
import { RawMaterialRequest } from '../types/RawMaterial';
import './RawMaterialForm.css';

interface RawMaterialFormProps {
  initialData?: RawMaterialRequest;
  onSubmit: (data: RawMaterialRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const RawMaterialForm: React.FC<RawMaterialFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<RawMaterialRequest>({
    name: '',
    description: '',
    cost: 0,
    currentStock: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.cost < 0 || formData.currentStock < 0) {
      alert('Por favor, preencha todos os campos obrigatórios com valores válidos.');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done by parent component
    }
  };

  return (
    <form className="raw-material-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nome *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          disabled={isLoading}
          placeholder="Digite o nome da matéria-prima"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          disabled={isLoading}
          placeholder="Descrição da matéria-prima"
        />
      </div>

      <div className="form-group">
        <label htmlFor="cost">Custo por unidade *</label>
        <input
          type="number"
          id="cost"
          name="cost"
          value={formData.cost}
          onChange={handleInputChange}
          required
          min="0"
          step="0.01"
          disabled={isLoading}
          placeholder="0.00"
        />
      </div>

      <div className="form-group">
        <label htmlFor="currentStock">Estoque atual *</label>
        <input
          type="number"
          id="currentStock"
          name="currentStock"
          value={formData.currentStock}
          onChange={handleInputChange}
          required
          min="0"
          step="0.01"
          disabled={isLoading}
          placeholder="0.00"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default RawMaterialForm;
