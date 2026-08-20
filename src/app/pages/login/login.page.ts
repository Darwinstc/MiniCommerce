import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { addIcons } from 'ionicons';
import {
  eyeOffOutline,
  eyeOutline
} from 'ionicons/icons';

import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  readonly form;
  showPassword = false;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly alertController: AlertController
  ) {
    addIcons({
      eyeOutline,
      eyeOffOutline
    });
    this.form = this.formBuilder.nonNullable.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

async submit(): Promise<void> {

  if (this.form.invalid) {
    this.form.markAllAsTouched();

    await this.showMessage(
      'Formulario incompleto',
      'Ingresa un correo válido y una contraseña de mínimo 6 caracteres.'
    );

    return;
  }

  const {
    email,
    password
  } = this.form.getRawValue();

  try {

    await this.authService.login(
      email,
      password
    );

    const returnUrl =
      this.route.snapshot
        .queryParamMap
        .get('returnUrl') ||
      '/catalogo';

    await this.router.navigateByUrl(
      returnUrl
    );

  } catch (error) {

    console.error(
      'Error al iniciar sesión:',
      error
    );

    await this.showMessage(
      'No fue posible ingresar',
      'Verifica el correo y la contraseña.'
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
        buttons: [
          'Aceptar'
        ]
      });
    await alert.present();
  }
}