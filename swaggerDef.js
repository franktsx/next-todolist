module.exports = {
  components: {},
  info: {
    title: "Open API Spec.",
    version: "1.0.0",
    description: "Todolist API",
  },
  host: "localhost:3000",
  basePath: "/api",
  // securityDefinitions: {
  //   apiKeyAuth: {
  //     type: "apiKey",
  //     in: "header",
  //     name: "Authorization",
  //     description: "Bearer <JWT-TOKEN>",
  //   },
  // },
  // security: [{ apiKeyAuth: [] }],
  apis: ["pages/api/**/*.ts"],
};
