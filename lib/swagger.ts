export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Mitha Laundry API',
    version: '1.0.0',
    description: 'API documentation untuk aplikasi manajemen laundry Mitha Laundry',
    contact: {
      name: 'Mitha Laundry Team',
      email: 'support@mithalaundry.com',
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      sessionCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'session',
        description: 'Session cookie for authentication',
      },
    },
    schemas: {
      Customer: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          totalOrders: { type: 'integer' },
          status: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'phone', 'status'],
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          customerId: { type: 'string' },
          status: {
            type: 'string',
            enum: ['sorting', 'washing', 'ironing', 'ready', 'completed', 'cancelled'],
          },
          services: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                price: { type: 'number' },
                quantity: { type: 'number' },
                subtotal: { type: 'number' },
              },
            },
          },
          payment: { type: 'string', enum: ['cash', 'qris'] },
          paymentStatus: {
            type: 'string',
            enum: ['unpaid', 'pending', 'paid', 'failed', 'expired'],
          },
          subtotal: { type: 'number' },
          expressFee: { type: 'number' },
          total: { type: 'number' },
          isExpress: { type: 'boolean' },
          deliveryDate: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          paidAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'customerId', 'status', 'payment', 'total'],
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          error: { type: 'string' },
          message: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Validation failed' },
          details: {
            type: 'array',
            items: { type: 'string' },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  security: [{ sessionCookie: [] }],
  paths: {
    '/api/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Get all orders',
        description: 'Retrieve a list of all orders with customer information',
        responses: {
          200: {
            description: 'List of orders retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Order' },
                    },
                    timestamp: { type: 'string' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Session required',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        description: 'Create a new order with services and payment method',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  customerId: { type: 'string' },
                  services: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        price: { type: 'number' },
                        quantity: { type: 'number' },
                        subtotal: { type: 'number' },
                      },
                      required: ['name', 'price', 'quantity', 'subtotal'],
                    },
                  },
                  payment: { type: 'string', enum: ['cash', 'qris'] },
                  itemCount: { type: 'integer' },
                  deliveryDate: { type: 'string', format: 'date-time' },
                  isExpress: { type: 'boolean' },
                  subtotal: { type: 'number' },
                  expressFee: { type: 'number' },
                  total: { type: 'number' },
                },
                required: [
                  'customerId',
                  'services',
                  'payment',
                  'subtotal',
                  'expressFee',
                  'total',
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Order created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Order' },
                    timestamp: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Customer not found',
          },
        },
      },
    },
    '/api/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get order by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Order retrieved successfully',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Order not found',
          },
        },
      },
      put: {
        tags: ['Orders'],
        summary: 'Update order status',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['sorting', 'washing', 'ironing', 'ready', 'completed', 'cancelled'],
                  },
                  note: { type: 'string' },
                },
                required: ['status'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Order updated successfully',
          },
          400: {
            description: 'Invalid status',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Order not found',
          },
        },
      },
    },
    '/api/customers': {
      get: {
        tags: ['Customers'],
        summary: 'Get all customers',
        responses: {
          200: {
            description: 'List of customers',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Customer' },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
      post: {
        tags: ['Customers'],
        summary: 'Create a new customer',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                },
                required: ['name', 'phone'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Customer created successfully',
          },
          400: {
            description: 'Validation error',
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/dashboard': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get dashboard statistics',
        parameters: [
          {
            name: 'period',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['today', 'week', 'month', 'year'],
            },
            description: 'Period for statistics',
          },
        ],
        responses: {
          200: {
            description: 'Dashboard data retrieved',
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/payment/qris': {
      post: {
        tags: ['Payment'],
        summary: 'Generate Midtrans QRIS payment code',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  orderId: { type: 'string' },
                },
                required: ['orderId'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Midtrans QRIS code generated',
          },
          400: {
            description: 'Invalid order or amount',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Order not found',
          },
        },
      },
    },
  },
}
