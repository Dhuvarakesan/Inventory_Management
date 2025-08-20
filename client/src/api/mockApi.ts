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

// Store original axios methods
const originalPost = axios.post;
const originalGet = axios.get;

// Setup mock API by overriding axios methods
export const setupMockApi = () => {
  // Mock axios.post for login
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
    
    // For other POST requests, use original method
    return originalPost(url, data, config);
  }) as any;

  // Mock axios.get for products and users
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
    
    // For other GET requests, use original method
    return originalGet(url, config);
  }) as any;
};