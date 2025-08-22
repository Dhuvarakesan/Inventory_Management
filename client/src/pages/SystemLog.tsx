import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchSystemLogs } from '@/store/slices/transactionSlice';
import { useEffect } from 'react';

const SystemLog = () => {
  const dispatch = useAppDispatch();
  const { transactions, isLoading, error } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchSystemLogs());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>System Logs</h1>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Description</th>
            <th>User</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.type}</td>
              <td>{transaction.reason || 'N/A'}</td>
              <td>{transaction.userName}</td>
              <td>{new Date(transaction.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SystemLog;
