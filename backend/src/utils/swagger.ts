import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "CruiseWare API",
            version: "0.0.1",
            description: "This is the documentation for CruiseWare.\n\nCruiseWare is an inventrory management service by Cruise.\n\n",
            contact: {
                email: "iconmoa@gmail.com"
            }
        },
        externalDocs: {
            description: "CruiseWare product description",
            url: "https://docs.google.com/document/d/1TydS0SZFJnVUsYvKF1qAfR7XNjFdlEahBOdom4zisQs/edit?usp=sharing"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ]
    },
    apis: ["./src/controller/v0/**/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: string | number) {
    // Swagger page
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }))


    // Doc in JSON format
    app.get("/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
}

export default swaggerDocs;