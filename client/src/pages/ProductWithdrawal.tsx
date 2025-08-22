import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useToast } from "@/hooks/use-toast";
import {
  fetchProducts,
  withdrawStock
} from "@/store/slices/productSlice";
import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

const ProductWithdrawal = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    productId: "",
    quantity: 0,
    reason: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const selectedProduct = products.find((p) => p.id === formData.productId);
  const isInsufficientStock =
    selectedProduct && formData.quantity > selectedProduct.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !user || isInsufficientStock) return;

    setIsSubmitting(true);

    try {
     

      // Update product stock
      await dispatch(
        withdrawStock({
          id: selectedProduct.id,
          quantity: formData.quantity,
          reason: formData.reason,
        })
      ).unwrap();
      toast({
        title: "Stock withdrawal successful",
        description: `Removed ${formData.quantity} units from ${selectedProduct.name}.`,
      });

      setFormData({ productId: "", quantity: 0, reason: "" });
    } catch (error) {
      toast({
        title: "Error removing stock",
        description: error as string,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Product Withdrawal
        </h1>
        <p className="text-muted-foreground">
          Remove stock from existing products
        </p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Stock Withdrawal
            </CardTitle>
            <CardDescription>
              Decrease inventory for existing products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="product">Select Product</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, productId: value })
                  }
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
                          <span className="text-muted">
                            (Available: {product.quantity})
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
                        <div className="font-medium">Available Stock</div>
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
                <Label htmlFor="quantity">Quantity to Remove</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedProduct?.quantity || 0}
                  placeholder="Enter quantity to remove"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
                {isInsufficientStock && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Insufficient stock. Available: {selectedProduct?.quantity}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="reason">
                  Reason (Required for withdrawals)
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for stock withdrawal (e.g., 'Damaged goods', 'Product returned', 'Sale')"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                />
              </div>

              {selectedProduct &&
                formData.quantity > 0 &&
                !isInsufficientStock && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <TrendingDown className="w-4 h-4" />
                      <strong>Stock Preview</strong>
                    </div>
                    <div className="mt-2 text-sm text-red-700">
                      {selectedProduct.name} stock will decrease from{" "}
                      <strong>{selectedProduct.quantity}</strong> to{" "}
                      <strong>
                        {selectedProduct.quantity - formData.quantity}
                      </strong>
                    </div>
                  </div>
                )}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isSubmitting ||
                  !formData.productId ||
                  formData.quantity === 0 ||
                  !formData.reason ||
                  isInsufficientStock
                }
                variant={isInsufficientStock ? "destructive" : "default"}
              >
                {isSubmitting ? "Removing Stock..." : "Remove Stock"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductWithdrawal;
