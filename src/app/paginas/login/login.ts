import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { autenticar } from '../../nucleo/datos';
import { SesionService } from '../../nucleo/sesion.service';
import { SvSpinner } from '../../nucleo/ui/spinner';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, SvSpinner],
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);

  readonly enviado = signal(false);
  readonly verClave = signal(false);
  readonly cargando = signal(false);
  readonly errorAcceso = signal('');

  readonly form = this.fb.nonNullable.group({
    usuario: ['', [Validators.required, Validators.minLength(3)]],
    clave: ['', [Validators.required, Validators.minLength(4)]],
  });

  // Muestra el error solo si el campo se tocó o ya se intentó enviar.
  invalido(campo: 'usuario' | 'clave'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.enviado());
  }

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
    if (this.form.invalid || this.cargando()) {
      this.form.markAllAsTouched();
      return;
    }

    // Simula la verificación contra el backend para mostrar el estado de carga.
    this.cargando.set(true);
    const { usuario, clave } = this.form.getRawValue();
    setTimeout(() => {
      const rol = autenticar(usuario, clave);
      if (!rol) {
        this.cargando.set(false);
        this.errorAcceso.set('Usuario o contraseña incorrectos. Verifica tus credenciales.');
        return;
      }
      this.sesion.iniciar(rol);
      this.router.navigate(rol.destino === 'tienda' ? ['/tienda'] : ['/admin', rol.moduloInicial]);
    }, 800);
  }
}
