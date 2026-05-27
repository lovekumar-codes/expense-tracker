import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Expense Tracker API",

      version: "1.0.0",

      description:
        "Professional Expense Tracker Backend API",
    },

    servers: [
      {
        url:
          "http://localhost:5000",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",

          scheme: "bearer",

          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "./src/routes/*.ts",
  ],
};

const swaggerSpec =
  swaggerJsdoc(options);

export default swaggerSpec;