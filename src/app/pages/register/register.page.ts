import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AlertController,
  IonBackButton,
  IonButtons,
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
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonItem,
    IonInput,
    IonButton,
    IonIcon
  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {
  readonly form;

  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly alertController: AlertController
  ) {
    addIcons({
      eyeOutline,
      eyeOffOutline
    });
    this.form = this.formBuilder.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
async submit(): Promise<void> {

  if (this.form.invalid) {
    this.form.markAllAsTouched();

    await this.showMessage(
      'Revisa la información',
      'Todos los campos son obligatorios y deben tener un formato válido.'
    );

    return;
  }

  const {
    name,
    email,
    password
  } = this.form.getRawValue();

  try {

    await this.authService.register(
      name,
      email,
      password
    );

    await this.showMessage(
      'Registro exitoso',
      'Tu cuenta fue creada correctamente.'
    );

    await this.router.navigate([
      '/catalogo'
    ]);

  } catch (error) {

    console.error(
      'Error al registrar usuario:',
      error
    );

    await this.showMessage(
      'No fue posible registrarte',
      'El correo ya puede estar registrado o la información no es válida.'
    );
  }
}

  private async showMessage(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar']
    });

    await alert.present();
  }
}
