import { Component, inject } from '@angular/core';
import { CarritoService } from '../../nucleo/carrito.service';
import { CATEGORIAS } from '../../nucleo/datos';
import { InventarioService } from '../../nucleo/inventario.service';
import { Producto } from '../../nucleo/modelos';
import { SolesPipe } from '../../nucleo/soles.pipe';
import { TiendaService } from '../../nucleo/tienda.service';

@Component({
  selector: 'app-catalogo',
  imports: [SolesPipe],
  templateUrl: './catalogo.html',
})
export class Catalogo {
  private readonly carrito = inject(CarritoService);
  private readonly inventario = inject(InventarioService);
  readonly tienda = inject(TiendaService);

  readonly categorias = CATEGORIAS;
  readonly productos = this.tienda.productos;

  setCategoria(cat: string): void {
    this.tienda.categoria.set(cat);
  }

  agregar(p: Producto): void {
    this.carrito.agregar('tienda', p.sku);
  }

  agotado(p: Producto): boolean {
    return this.inventario.estadoDe(p).estado === 'critico' && p.stock === 0;
  }
}
