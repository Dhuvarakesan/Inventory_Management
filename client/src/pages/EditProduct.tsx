import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useToast } from '@/hooks/use-toast';
import { updateProduct } from '@/store/slices/productSlice';
import { ArrowLeft, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const products = useAppSelector((state) => state.products.products);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    minCountLevel: 0,
    status: 'Active' as 'Active' | 'Inactive' | 'Low Stock',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Toys', 'Home & Garden'];

  useEffect(() => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setFormData(product);
    } else {
      toast({
        title: 'Error',
        description: 'Product not found.',
        variant: 'destructive',
      });
      navigate('/dashboard/products');
    }
  }, [id, products, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await dispatch(updateProduct({ ...formData, id })).unwrap();
      toast({
        title: 'Product updated successfully',
        description: `${formData.name} has been updated in the inventory.`,
      });
      navigate('/dashboard/products');
    } catch (error) {
      toast({
        title: 'Error updating product',
        description: error as string,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/dashboard/products')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">Update the product details</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Information
            </CardTitle>
            <CardDescription>Modify the details for the product</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  defaultValue={formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="minCountLevel">Minimum Count Level</Label>
                <Input
                  id="minCountLevel"
                  type="number"
                  placeholder="Enter minimum count level"
                  value={formData.minCountLevel}
                  onChange={(e) => setFormData({ ...formData, minCountLevel: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setFormData({ ...formData, status: value as 'Active' | 'Inactive' | 'Low Stock' })}
                  defaultValue={formData.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Low Stock">Low Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard/products')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProduct;
