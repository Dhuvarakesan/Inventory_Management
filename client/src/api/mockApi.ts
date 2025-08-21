import axios from 'axios';

// Mock data
const mockProducts = [
  {
    id: 'PRD001',
    name: 'Wireless Headphones',
    category: 'Electronics',
    quantity: 45,
    status: 'Active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:22:00Z'
  },
  {
    id: 'PRD002',
    name: 'Office Chair',
    category: 'Furniture',
    quantity: 8,
    status: 'Low Stock',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: 'PRD003',
    name: 'Coffee Maker',
    category: 'Appliances',
    quantity: 23,
    status: 'Active',
    createdAt: '2024-01-12T11:20:00Z',
    updatedAt: '2024-01-19T13:30:00Z'
  },
  {
    id: 'PRD004',
    name: 'Desk Lamp',
    category: 'Furniture',
    quantity: 0,
    status: 'Inactive',
    createdAt: '2024-01-08T08:45:00Z',
    updatedAt: '2024-01-17T10:15:00Z'
  },
  {
    id: 'PRD005',
    name: 'Smartphone',
    category: 'Electronics',
    quantity: 67,
    status: 'Active',
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-21T12:00:00Z'
  }
];

const mockUsers = [
  {
    id: 'USR001',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'Admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'USR002',
    email: 'user@demo.com',
    name: 'Regular User',
    role: 'User',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

const mockTransactions = [
  {
    id: 'txn1',
    productId: 'PRD001',
    productName: 'Wireless Headphones',
    type: 'entry' as const,
    quantity: 50,
    previousStock: 25,
    newStock: 75,
    reason: 'New shipment received',
    userId: 'USR001',
    userName: 'Admin User',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'txn2',
    productId: 'PRD002',
    productName: 'Office Chair',
    type: 'withdrawal' as const,
    quantity: 3,
    previousStock: 15,
    newStock: 12,
    reason: 'Sold to customer',
    userId: 'USR001',
    userName: 'Admin User',
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    id: 'txn3',
    productId: 'PRD003',
    productName: 'Coffee Maker',
    type: 'entry' as const,
    quantity: 20,
    previousStock: 8,
    newStock: 28,
    reason: 'Inventory restock',
    userId: 'USR002',
    userName: 'Regular User',
    createdAt: '2024-01-13T09:15:00Z'
  }
];

// Store original axios methods
const originalPost = axios.post;
const originalGet = axios.get;
const originalPut = (axios as any).put;

// Setup mock API by overriding axios methods
export const setupMockApi = () => {
  // Mock POST requests
  axios.post = ((url: string, data?: any, config?: any) => {
    if (url === '/api/auth/login') {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const { email, password } = data;
          
          if (email === 'admin@demo.com' && password === 'password123') {
            resolve({
              data: {
                user: mockUsers[0],
                token: 'mock-admin-token'
              },
              status: 200,
              statusText: 'OK',
              headers: {},
              config: config || {}
            });
          } else if (email === 'user@demo.com' && password === 'password123') {
            resolve({
              data: {
                user: mockUsers[1],
                token: 'mock-user-token'
              },
              status: 200,
              statusText: 'OK',
              headers: {},
              config: config || {}
            });
          } else {
            reject({
              response: {
                data: { message: 'Invalid credentials' },
                status: 401,
                statusText: 'Unauthorized',
                headers: {},
                config: config || {}
              }
            });
          }
        }, 1000);
      });
    }

    if (url === '/api/products') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newProduct = {
            ...data,
            id: `PRD${(mockProducts.length + 1).toString().padStart(3, '0')}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          mockProducts.push(newProduct);
          resolve({
            data: newProduct,
            status: 201,
            statusText: 'Created',
            headers: {},
            config: config || {}
          });
        }, 500);
      });
    }

    if (url === '/api/users') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser = {
            ...data,
            id: `USR${(mockUsers.length + 1).toString().padStart(3, '0')}`,
            createdAt: new Date().toISOString()
          };
          mockUsers.push(newUser);
          resolve({
            data: newUser,
            status: 201,
            statusText: 'Created',
            headers: {},
            config: config || {}
          });
        }, 500);
      });
    }

    if (url === '/api/transactions') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newTransaction = {
            ...data,
            id: `txn${mockTransactions.length + 1}`,
            createdAt: new Date().toISOString()
          };
          mockTransactions.unshift(newTransaction);
          resolve({
            data: newTransaction,
            status: 201,
            statusText: 'Created',
            headers: {},
            config: config || {}
          });
        }, 500);
      });
    }
    
    // For other POST requests, use original method
    return originalPost(url, data, config);
  }) as any;

  // Mock GET requests
  axios.get = ((url: string, config?: any) => {
    if (url === '/api/products') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: mockProducts,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: config || {}
          });
        }, 500);
      });
    }
    
    if (url === '/api/users') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: mockUsers,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: config || {}
          });
        }, 500);
      });
    }
    
    if (url === '/api/transactions') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: mockTransactions,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: config || {}
          });
        }, 500);
      });
    }
    
    // For other GET requests, use original method
    return originalGet(url, config);
  }) as any;

  // Mock PUT requests
  axios.put = ((url: string, data?: any, config?: any) => {
    if (url.startsWith('/api/products/')) {
      const productId = url.split('/').pop();
      return new Promise((resolve) => {
        setTimeout(() => {
          const productIndex = mockProducts.findIndex(p => p.id === productId);
          if (productIndex !== -1) {
            mockProducts[productIndex] = { 
              ...mockProducts[productIndex], 
              ...data, 
              updatedAt: new Date().toISOString() 
            };
            resolve({
              data: mockProducts[productIndex],
              status: 200,
              statusText: 'OK',
              headers: {},
              config: config || {}
            });
          }
        }, 500);
      });
    }
    
    // For other PUT requests, use original method
    return originalPut ? originalPut(url, data, config) : Promise.reject('PUT not supported');
  }) as any;
};