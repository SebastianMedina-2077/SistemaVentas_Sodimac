import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { autenticar } from '../../nucleo/datos';
import { SesionService } from '../../nucleo/sesion.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);

  readonly enviado = signal(false);
  readonly verClave = signal(false);
  /** Mensaje cuando el usuario o la contraseña no coinciden con ningún rol. */
  readonly errorAcceso = signal('');

  readonly form = this.fb.nonNullable.group({
    usuario: ['', [Validators.required, Validators.minLength(3)]],
    clave: ['', [Validators.required, Validators.minLength(4)]],
  });

  /** Verdadero cuando el campo es inválido y ya debe mostrarse el error. */
  invalido(campo: 'usuario' | 'clave'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.enviado());
  }

  /** Estado visual del campo para el icono de validación: 'ok' | 'mal' | ''. */
  estado(campo: 'usuario' | 'clave'): 'ok' | 'mal' | '' {
    const c = this.form.controls[campo];
    if (this.invalido(campo)) return 'mal';
    if (c.valid && c.value) return 'ok';
    return '';
  }

  alternarClave(): void {
    this.verClave.update((v) => !v);
  }

  ingresar(): void {
    this.enviado.set(true);
    this.errorAcceso.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { usuario, clave } = this.form.getRawValue();
    const rol = autenticar(usuario, clave);
    if (!rol) {
      this.errorAcceso.set('Usuario o contraseña incorrectos. Verifica tus credenciales.');
      return;
    }

    this.sesion.iniciar(rol);
    if (rol.destino === 'tienda') {
      this.router.navigate(['/tienda']);
    } else {
      this.router.navigate(['/admin', rol.moduloInicial]);
    }
  }
}
