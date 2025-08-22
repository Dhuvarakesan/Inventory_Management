import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useToast } from '@/hooks/use-toast';
import { addStock, fetchProducts } from '@/store/slices/productSlice';
import { Package, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

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
      // Use the new `addStock` thunk
      await dispatch(addStock({
        id: selectedProduct.id,
        quantity: formData.quantity,
        reason:formData.reason
      })).unwrap();

      toast({
        title: "Stock entry successful",
        description: `Added ${formData.quantity} units to ${selectedProduct.name}.`,
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
                  onValueChange={(value) =>
                    setFormData({ ...formData, productId: value })
                  }
                  defaultValue={formData.productId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for stock entry"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
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