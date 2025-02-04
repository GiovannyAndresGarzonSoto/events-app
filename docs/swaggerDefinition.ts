export const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Events API',
        description: 'Events API Docs for developers',
        contact: {
            name: 'giovannygarzonsoto@gmail.com'
        },
        servers: [`http://localhost:${process.env.PORT}`],
        version: '1.0.0'
    }
}