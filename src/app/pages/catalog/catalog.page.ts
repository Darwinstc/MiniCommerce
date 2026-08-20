import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe
} from '@angular/common';

import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  cartOutline, logOutOutline
} from 'ionicons/icons';

import {
  AlertController,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController
} from '@ionic/angular/standalone';

import { Product } from '../../models/product.model';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';


@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonBadge,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonTextarea
  ],
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss']
})
export class CatalogPage {

  @ViewChild(IonContent)
  content!: IonContent;
  readonly products$ = this.productService.getAll();
  readonly cartCount$ = this.cartService.count$;
  readonly reviews$ = this.reviewService.reviews$;

  readonly stars = [1, 2, 3, 4, 5];

  selectedRating = 0;
  reviewComment = '';



  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    readonly authService: AuthService,
    private readonly reviewService: ReviewService,
    private readonly router: Router,
    private readonly alertController: AlertController,
    private readonly toastController: ToastController
  ) {
    addIcons({
      cartOutline,
      logOutOutline
    });
  }

  async addToCart(product: Product): Promise<void> {
    this.cartService.add(product);

    const alert = await this.alertController.create({
      header: 'Producto agregado',
      message: `${product.name} fue agregado al carrito.`,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async logout(): Promise<void> {
    this.authService.logout();

    const toast = await this.toastController.create({
      message: 'Sesión cerrada correctamente',
      duration: 1800,
      position: 'top',
      icon: 'log-out-outline',
      cssClass: 'logout-toast'
    });

    await toast.present();

    await this.router.navigate(['/catalogo']);
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
  }

async submitReview(): Promise<void> {

  const user =
    this.authService.currentUser();

  if (!user) {
    await this.router.navigate([
      '/login'
    ]);
    return;
  }

  if (
    this.selectedRating <= 0 ||
    !this.reviewComment.trim()
  ) {
    await this.showMessage(
      'Reseña incompleta',
      'Selecciona una calificación y escribe un comentario.'
    );

    return;
  }

  try {

    await this.reviewService.addReview(
      user.id,
      user.name,
      this.selectedRating,
      this.reviewComment
    );

    this.selectedRating = 0;
    this.reviewComment = '';

    await this.showMessage(
      'Reseña publicada',
      'Gracias por compartir tu opinión.'
    );

  } catch (error) {

    console.error(
      'Error guardando reseña:',
      error
    );

    await this.showMessage(
      'No fue posible publicar',
      'Intenta nuevamente.'
    );
  }
}
  showMessage(arg0: string, arg1: string) {
    throw new Error('Method not implemented.');
  }

  private async showReviewAlert(
    header: string,
    message: string
  ): Promise<void> {

    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async scrollToProducts(): Promise<void> {
    const productsSection = document.getElementById('productos');

    if (!productsSection) {
      return;
    }

    const scrollElement = await this.content.getScrollElement();

    const sectionTop =
      productsSection.getBoundingClientRect().top +
      scrollElement.scrollTop -
      70;

    await this.content.scrollToPoint(
      0,
      sectionTop,
      600
    );
  }
}