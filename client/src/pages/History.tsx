import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchTransactions } from '@/store/slices/transactionSlice';
import { format } from 'date-fns';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const History = () => {
  const dispatch = useAppDispatch();
  const { transactions, isLoading, error } = useAppSelector((state) => state.transactions);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const getTransactionBadge = (type: 'addStock' | 'withdrawStock') => {
    if (type === 'addStock') {
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

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = filterUser ? transaction.username.toLowerCase().includes(filterUser.toLowerCase()) : true;
    const matchesTimeRange = (() => {
      const now = new Date();
      const transactionDate = new Date(transaction.timestamp);
      if (timeRange === 'last10') {
        return (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24) <= 10;
      } else if (timeRange === 'last30') {
        return (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24) <= 30;
      } else if (timeRange === 'custom') {
        if (!customStartDate || !customEndDate) return false;
        const startDate = new Date(customStartDate);
        const endDate = new Date(customEndDate);
        return transactionDate >= startDate && transactionDate <= endDate;
      }
      return true;
    })();
    return matchesSearch && matchesUser && matchesTimeRange;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Transaction History
        </h1>
        <p className="text-muted-foreground">
          View all product entries and withdrawals
        </p>
      </div>

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Filter by user"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Time</option>
          <option value="last10">Last 10 Days</option>
          <option value="last30">Last 30 Days</option>
          <option value="custom">Custom Date Range</option>
        </select>
        {timeRange === 'custom' && (
          <div className="flex space-x-2 items-center">
            <label className="text-sm font-medium">From:</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="border p-2 rounded"
            />
            <label className="text-sm font-medium">To:</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Log</CardTitle>
          <CardDescription>
            Complete history of all stock movements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
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
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.timestamp
                        ? format(
                            new Date(transaction.timestamp),
                            "MMM dd, yyyy"
                          )
                        : "Invalid Date"}
                    </TableCell>
                    <TableCell>{transaction.productName}</TableCell>
                    <TableCell>
                      {getTransactionBadge(transaction.action)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          transaction.action === "addStock"
                            ? "text-green-600 pl-2"
                            : "text-red-600 pl-2"
                        }
                      >
                        {transaction.action === "addStock" ? "+" : "-"}
                        {Math.abs(
                          transaction.newStock - transaction.previousStock
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground pl-3">
                        {transaction.previousStock} → {transaction.newStock}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.username}</TableCell>
                    <TableCell>{transaction.reason || "-"}</TableCell>
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