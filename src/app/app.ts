import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PaymentRequest } from '../app/component/payment-request/payment-request';

@Component({
  selector: 'app-root',
  imports: [PaymentRequest],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('dofi');
}
