import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductRequest } from '../../types/Product';
import { productService } from '../../services/productService';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await productService.getById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (product: ProductRequest, { rejectWithValue }) => {
    try {
      return await productService.create(product);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, product }: { id: number; product: ProductRequest }, { rejectWithValue }) => {
    try {
      return await productService.update(id, product);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await productService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch By Id
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;

