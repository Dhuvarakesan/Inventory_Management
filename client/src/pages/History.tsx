import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchTransactions } from '@/store/slices/transactionSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

const History = () => {
  const dispatch = useAppDispatch();
  const { transactions, isLoading, error } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const getTransactionBadge = (type: 'entry' | 'withdrawal') => {
    if (type === 'entry') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <TrendingUp className="w-3 h-3 mr-1" />
          Entry
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
        <TrendingDown className="w-3 h-3 mr-1" />
        Withdrawal
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-muted-foreground">View all product entries and withdrawals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Log</CardTitle>
          <CardDescription>
            Complete history of all stock movements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Stock Change</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>{transaction.productName}</TableCell>
                    <TableCell>{getTransactionBadge(transaction.type)}</TableCell>
                    <TableCell>
                      <span className={transaction.type === 'entry' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'entry' ? '+' : '-'}{transaction.quantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {transaction.previousStock} → {transaction.newStock}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.userName}</TableCell>
                    <TableCell>{transaction.reason || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;