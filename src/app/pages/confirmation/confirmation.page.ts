import {
  CurrencyPipe,
  DatePipe
} from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import {
  Order
} from '../../models/order.model';

import {
  OrderService
} from '../../services/order.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton
  ],
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss']
})
export class ConfirmationPage
  implements OnInit {

  order: Order | null = null;

  loading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly orderService: OrderService
  ) {}

  async ngOnInit(): Promise<void> {

    const orderId =
      this.route.snapshot
        .queryParamMap
        .get('orderId');

    if (!orderId) {
      this.loading = false;
      return;
    }

    try {

      this.order =
        await this.orderService.getById(
          orderId
        );

    } catch (error) {

      console.error(
        'Error cargando pedido:',
        error
      );

      this.order = null;

    } finally {

      this.loading = false;
    }
  }
}