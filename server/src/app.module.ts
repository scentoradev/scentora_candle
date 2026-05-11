import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { UserSessionsModule } from './modules/user_sessions/user_sessions.module';
import { EmailVerificationsModule } from './modules/email_verifications/email_verifications.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductImagesModule } from './modules/product_images/product_images.module';
import { CartItemsModule } from './modules/cart_items/cart_items.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrderItemsModule } from './modules/order_items/order_items.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PaymentWebhooksModule } from './modules/payment_webhooks/payment_webhooks.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { InventoryLogsModule } from './modules/inventory_logs/inventory_logs.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    UserSessionsModule,
    EmailVerificationsModule,
    CategoriesModule,
    ProductsModule,
    ProductImagesModule,
    CartItemsModule,
    AddressesModule,
    OrdersModule,
    OrderItemsModule,
    PaymentsModule,
    PaymentWebhooksModule,
    ReviewsModule,
    InventoryLogsModule,
    CouponsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
