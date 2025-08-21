import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProducts, updateProduct } from '@/store/slices/productSlice';
import { createTransaction } from '@/store/slices/transactionSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Package } from 'lucide-react';

const ProductEntry = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    reason: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const selectedProduct = products.find(p => p.id === formData.productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const newQuantity = selectedProduct.quantity + formData.quantity;
      
      // Update product stock
      await dispatch(updateProduct({
        id: selectedProduct.id,
        quantity: newQuantity
      })).unwrap();

      // Create transaction record
      await dispatch(createTransaction({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        type: 'entry',
        quantity: formData.quantity,
        previousStock: selectedProduct.quantity,
        newStock: newQuantity,
        reason: formData.reason,
        userId: user.id,
        userName: user.name
      })).unwrap();

      toast({
        title: "Stock entry successful",
        description: `Added ${formData.quantity} units to ${selectedProduct.name}. New stock: ${newQuantity}`,
      });
      
      setFormData({ productId: '', quantity: 0, reason: '' });
    } catch (error) {
      toast({
        title: "Error adding stock",
        description: error as string,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Entry</h1>
        <p className="text-muted-foreground">Add stock to existing products</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Stock Entry
            </CardTitle>
            <CardDescription>
              Increase inventory for existing products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="product">Select Product</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) => setFormData({ ...formData, productId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>{product.name}</span>
                          <span className="text-muted-foreground">
                            (Current: {product.quantity})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProduct && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Current Stock</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedProduct.quantity}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Category</div>
                        <div>{selectedProduct.category}</div>
                      </div>
                      <div>
                        <div className="font-medium">Status</div>
                        <div>{selectedProduct.status}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div>
                <Label htmlFor="quantity">Quantity to Add</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="Enter quantity to add"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for stock entry (e.g., 'New shipment received', 'Inventory correction')"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>

              {selectedProduct && formData.quantity > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <TrendingUp className="w-4 h-4" />
                    <strong>Stock Preview</strong>
                  </div>
                  <div className="mt-2 text-sm text-green-700">
                    {selectedProduct.name} stock will increase from{' '}
                    <strong>{selectedProduct.quantity}</strong> to{' '}
                    <strong>{selectedProduct.quantity + formData.quantity}</strong>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !formData.productId || formData.quantity === 0}
              >
                {isSubmitting ? 'Adding Stock...' : 'Add Stock'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductEntry;