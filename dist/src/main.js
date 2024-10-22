"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cors = require("cors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cors({ origin: 'https://localhost:8081' }));
    await app.listen(process.env.PORT || 3333);
}
bootstrap();
//# sourceMappingURL=main.js.map