import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProducts } from '@/store/slices/productSlice';
import { fetchTransactions } from '@/store/slices/transactionSlice';
import { AlertTriangle, Package, TrendingUp, Users } from 'lucide-react';
import { useEffect } from 'react';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products);
  const transactions = useAppSelector((state) => state.transactions.transactions);
  const auth = useAppSelector((state) => state.auth);
  const isLoading = products?.isLoading;
  const productList = products?.products || [];
  const user = auth?.user;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const totalProducts = productList.length;
  const lowStockProducts = productList.filter(p => p.quantity < 10).length;
  const activeProducts = productList.filter(p => p.status === 'Active').length;
  const inactiveProducts = productList.filter(p => p.status === 'Inactive').length;

  const recentTransactions = transactions
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      description: 'Products in inventory',
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Products',
      value: activeProducts,
      description: 'Currently active',
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Low Stock',
      value: lowStockProducts,
      description: 'Need attention',
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Inactive',
      value: inactiveProducts,
      description: 'Not in use',
      icon: Users,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your product inventory
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? '...' : stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {lowStockProducts > 0 && (
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center text-warning">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>
              {lowStockProducts} product{lowStockProducts > 1 ? 's' : ''} {lowStockProducts > 1 ? 'are' : 'is'} running low on stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {productList
                .filter(p => p.quantity < 10)
                .slice(0, 5)
                .map(product => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-warning font-semibold">{product.quantity} left</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates to your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Product transactions will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center">
                  <span className="font-medium">
                    {transaction.productName} ({transaction.action})
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;