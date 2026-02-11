# Frontend - Funcionalidades

Este documento resume as funcionalidades implementadas no frontend do sistema AutoFlex para atender aos requisitos.

### Componentes referentes a Produtos:
- `ProductList.tsx` - Lista de produtos com ações
- `ProductForm.tsx` - Formulário para criar/editar produtos
- `productSlice.ts` - Redux store para produtos
- `productService.ts` - Serviços de API para produtos

---

### Componentes referentes a Matérias-Primas:
- `RawMaterialList.tsx` - Lista de matérias-primas com ações
- `RawMaterialForm.tsx` - Formulário para criar/editar matérias-primas
- `rawMaterialSlice.ts` - Redux store para matérias-primas
- `rawMaterialService.ts` - Serviços de API para matérias-primas

---

## Associar Matérias-Primas aos Produtos

### Componentes:
- `RawMaterialAssociation.tsx` - Componente para gerenciar associações
- Integrado ao `ProductForm.tsx` (não é tela separada conforme especificado)

---

## Listar Produtos Que Podem Ser Produzidos

### Componentes:
- `ProducibleProducts.tsx` - Lista produtos que podem ser produzidos

---

## 🎨 Interface do Usuário

### Navegação por Abas:
- **📦 Produtos** - Gerenciamento de produtos
- **🏭 Matérias-Primas** - Gerenciamento de matérias-primas  
- **🎯 Produtos Disponíveis** - Lista de produtos que podem ser produzidos

### Recursos da Interface:
- ✅ Design responsivo
- ✅ Modais para criar/editar
- ✅ Confirmação de exclusão
- ✅ Estados de loading
- ✅ Tratamento de erros
- ✅ Validação de formulários
- ✅ Formatação de moeda (BRL)
- ✅ Formatação de números

---

## 🔧 Tecnologias Utilizadas

### Frontend:
- React 18 com TypeScript
- Redux Toolkit para gerenciamento de estado
- Axios para requisições HTTP
- CSS

---

## 🚀 Como Testar

1. **Iniciar Backend:**
   ```bash
   cd /home/douglascampos/Projects/autoflex
   ./mvnw spring-boot:run
   ```

2. **Iniciar Frontend:**
   ```bash
   cd /home/douglascampos/Projects/autoflex/frontend-ui
   npm start
   ```

3. **Acessar:** http://localhost:3000

---
