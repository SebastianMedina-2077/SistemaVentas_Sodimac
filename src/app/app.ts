import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SvToaster } from './nucleo/ui/toaster';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SvToaster],
  template: '<router-outlet /><sv-toaster />',
})
export class App {}
