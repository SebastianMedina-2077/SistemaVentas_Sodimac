import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../nucleo/catalogo.service';
import { CATEGORIAS, metaCategoria } from '../../nucleo/datos';
import { Producto } from '../../nucleo/modelos';
import { SolesPipe } from '../../nucleo/soles.pipe';
import { SvImagen } from '../../nucleo/ui/imagen';
import { ToastService } from '../../nucleo/ui/toast.service';

// Gestión de catálogo (gerente): editar atributos e imagen de los productos.
@Component({
  selector: 'app-productos',
  imports: [FormsModule, SolesPipe, SvImagen],
  templateUrl: './productos.html',
})
export class Productos {
  private readonly catalogo = inject(CatalogoService);
  private readonly toast = inject(ToastService);

  readonly categorias = CATEGORIAS.filter((c) => c !== 'Todos');
  readonly filtro = signal('');
  readonly editando = signal<string | null>(null); // sku en edición, 'nuevo' o null

  private readonly campoImagen = viewChild<ElementRef<HTMLInputElement>>('campoImagen');
  private readonly campoBusqueda = viewChild<ElementRef<HTMLInputElement>>('campoBusqueda');

  // Borrador del formulario.
  readonly fSku = signal('');
  readonly fNombre = signal('');
  readonly fMarca = signal('');
  readonly fPrecio = signal(0);
  readonly fCategoria = signal(this.categorias[0]);
  readonly fUbicacion = signal('');
  readonly fGondola = signal(0);
  readonly fAlmacen = signal(0);
  readonly fDescripcion = signal('');
  readonly fImagen = signal('');

  readonly productos = this.catalogo.productos;
  readonly metaImagen = computed(() => metaCategoria(this.fCategoria()).imagen);

  readonly filtrados = computed(() => {
    const q = this.filtro().trim().toLowerCase();
    if (!q) return this.productos();
    return this.productos().filter((p) => `${p.nombre} ${p.sku} ${p.marca} ${p.categoria}`.toLowerCase().includes(q));
  });

  editar(p: Producto): void {
    this.editando.set(p.sku);
    this.fSku.set(p.sku);
    this.fNombre.set(p.nombre);
    this.fMarca.set(p.marca);
    this.fPrecio.set(p.precio);
    this.fCategoria.set(p.categoria);
    this.fUbicacion.set(p.ubicacion);
    this.fGondola.set(p.stockGondola);
    this.fAlmacen.set(p.stockAlmacen);
    this.fDescripcion.set(p.descripcion);
    this.fImagen.set(p.imagen);
  }

  nuevo(): void {
    this.editando.set('nuevo');
    this.fSku.set('NEW-' + String(this.productos().length + 1).padStart(3, '0'));
    this.fNombre.set('');
    this.fMarca.set('');
    this.fPrecio.set(0);
    this.fCategoria.set(this.categorias[0]);
    this.fUbicacion.set('');
    this.fGondola.set(0);
    this.fAlmacen.set(0);
    this.fDescripcion.set('');
    this.fImagen.set('');
  }

  cerrar(): void {
    this.editando.set(null);
  }

  enfocarImagen(): void {
    if (!this.editando()) this.nuevo();
    setTimeout(() => this.campoImagen()?.nativeElement.focus(), 0);
  }

  enfocarBusqueda(): void {
    this.campoBusqueda()?.nativeElement.focus();
  }

  verTotal(): void {
    this.toast.mostrar('Catálogo', `${this.productos().length} productos en total.`, 'info');
  }

  mas(): void {
    this.toast.mostrar('Más acciones', 'Exportar catálogo — disponible próximamente.', 'info');
  }

  guardar(): void {
    if (!this.fNombre().trim() || this.fPrecio() <= 0) {
      this.toast.mostrar('Faltan datos', 'Ingresa nombre y un precio válido.', 'error');
      return;
    }
    const meta = metaCategoria(this.fCategoria());
    const cambios: Partial<Producto> = {
      nombre: this.fNombre().trim(),
      marca: this.fMarca().trim() || 'Sodimac',
      precio: this.fPrecio(),
      categoria: this.fCategoria(),
      ubicacion: this.fUbicacion().trim() || '—',
      stockGondola: Math.max(0, this.fGondola()),
      stockAlmacen: Math.max(0, this.fAlmacen()),
      descripcion: this.fDescripcion().trim(),
      imagen: this.fImagen().trim() || meta.imagen,
      imagenLocal: meta.imagen,
      tinte: meta.tinte,
      tinta: meta.tinta,
    };

    if (this.editando() === 'nuevo') {
      this.catalogo.agregar({
        sku: this.fSku(),
        caracteristicas: [`Marca ${cambios.marca}`, `Categoría ${this.fCategoria()}`],
        stock: 0,
        minimo: Math.max(5, Math.round((this.fGondola() + this.fAlmacen()) * 0.3)),
        inicial: this.fNombre().charAt(0),
        ...cambios,
      } as Producto);
      this.toast.mostrar('Producto creado', `${this.fSku()} · ${cambios.nombre}`);
    } else {
      this.catalogo.actualizar(this.editando()!, cambios);
      this.toast.mostrar('Producto actualizado', `${cambios.nombre}`);
    }
    this.cerrar();
  }
}
