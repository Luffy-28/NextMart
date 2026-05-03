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
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
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
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'test@example.com' },
                    password: { type: 'string', example: 'Password123!' },
                    confirmPassword: { type: 'string', example: 'Password123!' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Signup successful! Please check your email for the verification code' },
            400: { description: 'Validation Error or User already exists' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login customer',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'thakurishankar159@gmail.com' },
                    password: { type: 'string', example: '@#$@@@@sdkjhsk1' },
                  },
                },
              },
            },
          },
          responses: {
            200: { 
              description: 'User logged in successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
                      refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
                      data: {
                        type: 'object',
                        properties: {
                          name: { type: 'string', example: 'John Doe' },
                          email: { type: 'string', example: 'test@example.com' },
                          role: { type: 'string', example: 'customer' },
                          isVerified: { type: 'boolean', example: true },
                        }
                      }
                    }
                  }
                }
              }
            },
            400: { description: 'Invalid email or password' },
          },
        },
      },
      '/auth/verify': {
        post: {
          tags: ['Auth'],
          summary: 'Verify email via OTP',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: '12853@ait.nsw.edu.au' },
                    otp: { type: 'string', example: '392841' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Email verified successfully!' },
            400: { description: 'Invalid OTP' },
          },
        },
      },
      '/auth/resendOtp': {
        post: {
          tags: ['Auth'],
          summary: 'Resend Verification OTP',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: '12853@ait.nsw.edu.au' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'OTP has been resent to your email' },
            400: { description: 'OTP already sent or User already verified' },
          },
        },
      },
      '/auth/google': {
        get: {
          tags: ['Auth'],
          summary: 'Trigger Google OAuth login (Redirect flow)',
          security: [],
          responses: {
            302: { description: 'Redirects to Google Sign-In page' },
          },
        },
      },
      '/auth/googleVerification': {
        post: {
          tags: ['Auth'],
          summary: 'Verify Google OAuth credential (Client-side flow)',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    idToken: { type: 'string', example: 'eyJhbGciOiJSUzI1NiIs...' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Google login successful' },
          },
        },
      },
      '/users/': {
        get: {
          tags: ['Users'],
          summary: 'Get the logged-in user profile',
          responses: {
            200: { description: 'User details fetched successfully' },
            401: { description: 'Unauthorized access (No token or invalid token)' },
          },
        },
      },
    },
  },
  apis: [], // No need for external docs, fully defined here
};

export const swaggerSpec = swaggerJsdoc(options);
