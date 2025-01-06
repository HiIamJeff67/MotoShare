"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const bodyParser = require("body-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:8081',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.use(bodyParser.json({
        verify: (req, res, buf) => {
            if (req.originalUrl === '/webhook/stripePaymentIntent') {
                req.rawBody = buf;
            }
        },
    }));
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(process.env.PORT || 3333);
}
bootstrap();
//# sourceMappingURL=main.js.map