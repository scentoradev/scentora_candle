import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductImagesModule } from './modules/product_images/product_images.module';
import { InventoryLogsModule } from './modules/inventory_logs/inventory_logs.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContentPagesModule } from './modules/content_pages/content_pages.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    ProductImagesModule,
    InventoryLogsModule,
    AuthModule,
    ContentPagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
