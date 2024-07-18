import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Task Management API',
      description: 'API for managing tasks',
      version: '1.0.0',
    },
    basePath: '/api/v1',
  },
  apis: ['./swagger.json'],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
