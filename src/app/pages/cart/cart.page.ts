import {
  AsyncPipe,
  CurrencyPipe
} from '@angular/common';

import { Component } from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AlertController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonButton
  ],
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss']
})
export class CartPage {

  readonly items$ = this.cartService.items$;
  readonly total$ = this.cartService.total$;

  constructor(
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly orderService: OrderService,
    private readonly router: Router,
    private readonly alertController: AlertController
  ) {}

  decrease(productId: string): void {
    this.cartService.decrease(productId);
  }

  increase(productId: string): void {
    this.cartService.increase(productId);
  }

  remove(productId: string): void {
    this.cartService.remove(productId);
  }

  async checkout(): Promise<void> {

    const items =
      this.cartService.getSnapshot();

    if (items.length === 0) {
      await this.showMessage(
        'Carrito vacío',
        'Agrega al menos un producto antes de finalizar la compra.'
      );

      return;
    }

    const user =
      this.authService.currentUser();

    if (
      !this.authService.isAuthenticated() ||
      !user
    ) {
      await this.router.navigate(
        ['/login'],
        {
          queryParams: {
            returnUrl: '/carrito'
          }
        }
      );

      return;
    }

    const total = items.reduce(
      (sum, item) =>
        sum +
        (
          item.product.price *
          item.quantity
        ),
      0
    );

    try {

      const orderId =
        await this.orderService.createOrder(
          user.id,
          user.name,
          user.email,
          items,
          total
        );

      this.cartService.clear();

      await this.router.navigate(
        ['/confirmacion'],
        {
          queryParams: {
            orderId
          }
        }
      );

    } catch (error) {

      console.error(
        'Error al completar la compra:',
        error
      );

      await this.showMessage(
        'No fue posible completar la compra',
        'Ocurrió un problema al guardar el pedido. Intenta nuevamente.'
      );
    }
  }

  private async showMessage(
    header: string,
    message: string
  ): Promise<void> {

    const alert =
      await this.alertController.create({
        header,
        message,
        buttons: ['Aceptar']
      });

    await alert.present();
  }
}