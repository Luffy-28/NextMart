import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NexMart Customer API',
      version: '1.0.0',
      description: 'API documentation for the NexMart E-commerce Customer Backend.',
    },
    servers: [
      {
        url: 'http://localhost:5004/api/v1',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication and account management' },
      { name: 'Users', description: 'User profile and address management' },
      { name: 'Products', description: 'Product browsing and search' },
      { name: 'Categories', description: 'Product categories' },
      { name: 'Subcategories', description: 'Product subcategories' },
      { name: 'Deals', description: 'Active promotional deals' },
      { name: 'Cart', description: 'Shopping cart management' },
      { name: 'Orders', description: 'Order placement and management' },
      { name: 'Payments', description: 'Stripe payment processing' },
    ],
    paths: {
      // ─── AUTH ───────────────────────────────────────────────────────────────
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new customer',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'Password123!' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Signup successful, OTP sent to email' },
            400: { description: 'User already exists or validation error' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login a customer',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'Password123!' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful, returns accessToken and refreshToken' },
            400: { description: 'Invalid credentials or unverified account' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/auth/verify': {
        post: {
          tags: ['Auth'],
          summary: 'Verify email address via OTP',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'otp'],
                  properties: {
                    email: { type: 'string', example: 'john@example.com' },
                    otp: { type: 'string', example: '123456' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Email verified successfully' },
            400: { description: 'Invalid or expired OTP' },
            404: { description: 'User not found' },
          },
        },
      },
      '/auth/resendOtp': {
        post: {
          tags: ['Auth'],
          summary: 'Resend verification OTP',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string', example: 'john@example.com' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'OTP resent successfully' },
            400: { description: 'OTP still active or user already verified' },
            404: { description: 'User not found' },
          },
        },
      },
      '/auth/refresh': {
        get: {
          tags: ['Auth'],
          summary: 'Generate a new access token using a refresh token',
          security: [],
          parameters: [
            {
              in: 'header',
              name: 'Authorization',
              required: true,
              schema: { type: 'string', example: 'Bearer <refreshToken>' },
            },
          ],
          responses: {
            200: { description: 'New access token generated' },
            500: { description: 'Invalid or expired refresh token' },
          },
        },
      },
      '/auth/forgot-password': {
        post: {
          tags: ['Auth'],
          summary: 'Request a password reset OTP',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string', example: 'john@example.com' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'OTP sent if account exists (always 200 to prevent email enumeration)' },
            400: { description: 'Account not verified' },
          },
        },
      },
      '/auth/reset-password': {
        post: {
          tags: ['Auth'],
          summary: 'Reset password using OTP',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'otp', 'newPassword'],
                  properties: {
                    email: { type: 'string', example: 'john@example.com' },
                    otp: { type: 'string', example: '123456' },
                    newPassword: { type: 'string', example: 'NewPassword456!' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Password reset successful' },
            400: { description: 'Invalid OTP or weak password' },
            404: { description: 'User not found' },
          },
        },
      },
      '/auth/google': {
        get: {
          tags: ['Auth'],
          summary: 'Initiate Google OAuth login (redirect flow)',
          security: [],
          responses: {
            302: { description: 'Redirects to Google Sign-In page' },
          },
        },
      },
      '/auth/googleVerification': {
        post: {
          tags: ['Auth'],
          summary: 'Verify Google ID token from client-side flow',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['token'],
                  properties: {
                    token: { type: 'string', example: 'eyJhbGciOiJSUzI1NiIs...' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Google login successful, returns accessToken and refreshToken' },
            500: { description: 'Token verification failed' },
          },
        },
      },
      '/auth/google/callback': {
        get: {
          tags: ['Auth'],
          summary: 'Google OAuth callback (handled automatically, do not call directly)',
          security: [],
          responses: {
            302: { description: 'Redirects to frontend with tokens in query params' },
          },
        },
      },

      // ─── USERS ──────────────────────────────────────────────────────────────
      '/users/': {
        get: {
          tags: ['Users'],
          summary: "Get the logged-in user's profile",
          responses: {
            200: { description: 'User details fetched successfully' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/users/me': {
        patch: {
          tags: ['Users'],
          summary: "Update the logged-in user's profile details",
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Jane Doe' },
                    phone: { type: 'string', example: '0412345678' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'User details updated successfully' },
            401: { description: 'Unauthorized' },
            404: { description: 'User not found' },
          },
        },
      },
      '/users/address': {
        get: {
          tags: ['Users'],
          summary: 'Get all saved addresses for the logged-in user',
          responses: {
            200: { description: 'Addresses fetched successfully' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/users/addAddress': {
        post: {
          tags: ['Users'],
          summary: 'Add a new address',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['address'],
                  properties: {
                    address: {
                      type: 'object',
                      required: ['street', 'city', 'state', 'postcode'],
                      properties: {
                        street: { type: 'string', example: '123 George St' },
                        suburb: { type: 'string', example: 'Sydney CBD' },
                        city: { type: 'string', example: 'Sydney' },
                        state: { type: 'string', example: 'NSW' },
                        postcode: { type: 'string', example: '2000' },
                        country: { type: 'string', example: 'Australia' },
                        isDefault: { type: 'boolean', example: true },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Address saved successfully' },
            400: { description: 'Address is required' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/users/address/{id}': {
        patch: {
          tags: ['Users'],
          summary: 'Update a saved address',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Address ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['address'],
                  properties: {
                    address: {
                      type: 'object',
                      properties: {
                        street: { type: 'string', example: '456 Pitt St' },
                        suburb: { type: 'string', example: 'Sydney CBD' },
                        city: { type: 'string', example: 'Sydney' },
                        state: { type: 'string', example: 'NSW' },
                        postcode: { type: 'string', example: '2000' },
                        isDefault: { type: 'boolean', example: false },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Address updated successfully' },
            401: { description: 'Unauthorized' },
            404: { description: 'Address not found' },
          },
        },
      },

      // ─── PRODUCTS ────────────────────────────────────────────────────────────
      '/products': {
        get: {
          tags: ['Products'],
          summary: 'Get all products with filtering, sorting and pagination',
          security: [],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
            {
              in: 'query', name: 'sort',
              schema: { type: 'string', enum: ['newest', 'oldest', 'price-asc', 'price-desc', 'rating-high', 'rating-low'], default: 'newest' },
            },
            { in: 'query', name: 'category', schema: { type: 'string' }, description: 'Category ID' },
            { in: 'query', name: 'subcategory', schema: { type: 'string' }, description: 'Subcategory ID' },
            { in: 'query', name: 'minPrice', schema: { type: 'number' } },
            { in: 'query', name: 'maxPrice', schema: { type: 'number' } },
            { in: 'query', name: 'rating', schema: { type: 'number' }, description: 'Minimum rating' },
            { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Full-text search term' },
          ],
          responses: {
            200: { description: 'Products fetched with pagination metadata' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/products/featured': {
        get: {
          tags: ['Products'],
          summary: 'Get featured products with pagination',
          security: [],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
          ],
          responses: {
            200: { description: 'Featured products fetched successfully' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/products/tags': {
        get: {
          tags: ['Products'],
          summary: 'Get products by tags with pagination',
          security: [],
          parameters: [
            {
              in: 'query', name: 'tags', required: true,
              schema: { type: 'string' },
              description: 'Comma-separated list of tags (e.g. sale,new)',
            },
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
          ],
          responses: {
            200: { description: 'Products fetched successfully' },
            400: { description: 'Tags query parameter is required' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/products/slug/{slug}': {
        get: {
          tags: ['Products'],
          summary: 'Get a product by its slug',
          security: [],
          parameters: [
            {
              in: 'path', name: 'slug', required: true,
              schema: { type: 'string', example: 'wireless-headphones-pro' },
            },
          ],
          responses: {
            200: { description: 'Product fetched successfully' },
            404: { description: 'Product not found' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/products/{id}': {
        get: {
          tags: ['Products'],
          summary: 'Get a product by ID',
          security: [],
          parameters: [
            {
              in: 'path', name: 'id', required: true,
              schema: { type: 'string' },
              description: 'MongoDB ObjectId of the product',
            },
          ],
          responses: {
            200: { description: 'Product fetched successfully' },
            404: { description: 'Product not found' },
            500: { description: 'Internal server error' },
          },
        },
      },

      // ─── CATEGORIES ──────────────────────────────────────────────────────────
      '/categories': {
        get: {
          tags: ['Categories'],
          summary: 'Get all active categories',
          security: [],
          responses: {
            200: { description: 'Categories fetched successfully' },
            500: { description: 'Internal server error' },
          },
        },
      },

      // ─── SUBCATEGORIES ───────────────────────────────────────────────────────
      '/subcategories/{categoryId}': {
        get: {
          tags: ['Subcategories'],
          summary: 'Get all active subcategories for a given category',
          security: [],
          parameters: [
            {
              in: 'path', name: 'categoryId', required: true,
              schema: { type: 'string' },
              description: 'MongoDB ObjectId of the parent category',
            },
          ],
          responses: {
            200: { description: 'Subcategories fetched successfully' },
            404: { description: 'Subcategory not found' },
            500: { description: 'Internal server error' },
          },
        },
      },

      // ─── DEALS ───────────────────────────────────────────────────────────────
      '/deals': {
        get: {
          tags: ['Deals'],
          summary: 'Get all currently active deals',
          security: [],
          responses: {
            200: { description: 'Active deals fetched successfully' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/deals/{id}': {
        get: {
          tags: ['Deals'],
          summary: 'Get a deal by ID',
          security: [],
          parameters: [
            {
              in: 'path', name: 'id', required: true,
              schema: { type: 'string' },
              description: 'MongoDB ObjectId of the deal',
            },
          ],
          responses: {
            200: { description: 'Deal fetched successfully' },
            404: { description: 'Deal not found' },
            500: { description: 'Internal server error' },
          },
        },
      },

      // ─── CART ────────────────────────────────────────────────────────────────
      '/carts': {
        get: {
          tags: ['Cart'],
          summary: "Get the logged-in user's cart",
          responses: {
            200: { description: 'Cart retrieved successfully' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/carts/add': {
        post: {
          tags: ['Cart'],
          summary: 'Add an item to the cart',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['productId', 'quantity'],
                  properties: {
                    productId: { type: 'string', description: 'MongoDB ObjectId of the product' },
                    quantity: { type: 'integer', minimum: 1, example: 2 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Item added to cart successfully' },
            400: { description: 'Missing fields, invalid quantity, or insufficient stock' },
            404: { description: 'Product not found' },
          },
        },
      },
      '/carts/update': {
        patch: {
          tags: ['Cart'],
          summary: 'Update the quantity of a cart item',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['productId', 'quantity'],
                  properties: {
                    productId: { type: 'string' },
                    quantity: { type: 'integer', minimum: 1, example: 3 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cart quantity updated successfully' },
            400: { description: 'Invalid quantity or insufficient stock' },
            404: { description: 'Cart or item not found' },
          },
        },
      },
      '/carts/remove/{productId}': {
        delete: {
          tags: ['Cart'],
          summary: 'Remove an item from the cart',
          parameters: [
            {
              in: 'path', name: 'productId', required: true,
              schema: { type: 'string' },
              description: 'MongoDB ObjectId of the product to remove',
            },
          ],
          responses: {
            200: { description: 'Item removed from cart successfully' },
            404: { description: 'Cart or item not found' },
          },
        },
      },
      '/carts/clear': {
        delete: {
          tags: ['Cart'],
          summary: 'Clear all items from the cart',
          responses: {
            200: { description: 'Cart cleared successfully' },
            404: { description: 'Cart not found' },
          },
        },
      },

      // ─── ORDERS ──────────────────────────────────────────────────────────────
      '/orders': {
        get: {
          tags: ['Orders'],
          summary: 'Get all orders for the logged-in user',
          responses: {
            200: { description: 'Orders fetched successfully' },
            401: { description: 'Unauthorized' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/orders/{id}': {
        get: {
          tags: ['Orders'],
          summary: 'Get a single order by ID',
          parameters: [
            {
              in: 'path', name: 'id', required: true,
              schema: { type: 'string' },
              description: 'MongoDB ObjectId of the order',
            },
          ],
          responses: {
            200: { description: 'Order details fetched successfully' },
            401: { description: 'Unauthorized' },
            404: { description: 'Order not found' },
          },
        },
      },
      '/orders/create': {
        post: {
          tags: ['Orders'],
          summary: "Create a new order from the user's cart",
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['shippingAddressId'],
                  properties: {
                    shippingAddressId: {
                      type: 'string',
                      description: "MongoDB ObjectId of the user's saved address",
                    },
                    paymentMethod: {
                      type: 'string',
                      enum: ['card', 'paypal', 'cod'],
                      default: 'card',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Order created successfully' },
            400: { description: 'Cart is empty or missing shipping address' },
            401: { description: 'Unauthorized' },
            404: { description: 'Shipping address not found or does not belong to user' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/orders/cancel/{id}': {
        patch: {
          tags: ['Orders'],
          summary: 'Cancel an order',
          parameters: [
            {
              in: 'path', name: 'id', required: true,
              schema: { type: 'string' },
              description: 'MongoDB ObjectId of the order to cancel',
            },
          ],
          responses: {
            200: { description: 'Order cancelled successfully' },
            400: { description: 'Order already cancelled or in a non-cancellable status' },
            401: { description: 'Unauthorized' },
            404: { description: 'Order not found' },
          },
        },
      },

      // ─── PAYMENTS ────────────────────────────────────────────────────────────
      '/payments/create-payment-intent': {
        post: {
          tags: ['Payments'],
          summary: 'Create a Stripe Payment Intent for an order',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['orderId'],
                  properties: {
                    orderId: { type: 'string', description: 'MongoDB ObjectId of the order to pay for' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Payment intent created, returns clientSecret' },
            401: { description: 'Unauthorized' },
            404: { description: 'Order not found' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/payments/webhook': {
        post: {
          tags: ['Payments'],
          summary: 'Stripe webhook endpoint (called by Stripe, not the frontend)',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object' } } },
          },
          responses: {
            200: { description: 'Webhook received and processed' },
            400: { description: 'Webhook signature verification failed' },
            500: { description: 'Failed to process webhook event' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
