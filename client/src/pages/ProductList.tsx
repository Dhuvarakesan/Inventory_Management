import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { deleteProduct, fetchProducts, Product, setFilters } from '@/store/slices/productSlice';
import { Edit, Filter, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const productsState = useAppSelector((state) => state.products);
  const products = productsState?.products || [];
  const isLoading = productsState?.isLoading;
  const filters = productsState?.filters || { search: '', category: '', status: '' };
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    dispatch(setFilters({ search: value }));
  };

  const handleCategoryFilter = (value: string) => {
    dispatch(setFilters({ category: value === 'all' ? '' : value }));
  };

  const handleStatusFilter = (value: string) => {
    dispatch(setFilters({ status: value === 'all' ? '' : value }));
  };

  const handleDeleteClick = (id: string) => {
    setSelectedProductId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProductId) {
      try {
        await dispatch(deleteProduct(selectedProductId)).unwrap();
        toast({
          title: 'Product deleted successfully',
          description: 'The product has been removed from the inventory.',
        });
      } catch (error) {
        toast({
          title: 'Error deleting product',
          description: typeof error === 'string' ? error : (error instanceof Error ? error.message : 'An unknown error occurred'),
          variant: 'destructive',
        });
      } finally {
        setIsDialogOpen(false);
        setSelectedProductId(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setSelectedProductId(null);
  };

  const handleEditClick = (id: string) => {
    navigate(`/dashboard/edit-product/${id}`);
  };

  const getStatusBadge = (status: Product['status']) => {
    const variants = {
      'Active': 'bg-success/10 text-success border-success/20',
      'Inactive': 'bg-muted text-muted-foreground',
      'Low Stock': 'bg-warning/10 text-warning border-warning/20'
    };
    
    return (
      <Badge variant="outline" className={variants[status]}>
        {status}
      </Badge>
    );
  };

  const getQuantityColor = (quantity: number) => {
    if (quantity < 10) return 'text-warning font-semibold';
    if (quantity < 50) return 'text-primary';
    return 'text-success';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name?.toLowerCase() || '').includes(filters.search.toLowerCase()) ||
                          (product.category?.toLowerCase() || '').includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesStatus = !filters.status || product.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(products.map(p => p.category))];
  const statuses = ['Active', 'Inactive', 'Low Stock'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover" onClick={() => navigate('/dashboard/create-product')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            {filteredProducts.length} of {products.length} products
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select onValueChange={handleCategoryFilter} defaultValue="all">
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleStatusFilter} defaultValue="all">
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Product ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-sm">{product.id}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className={getQuantityColor(product.quantity)}>
                        {product.quantity}
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditClick(product.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ProductList;