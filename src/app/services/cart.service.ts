import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'mini_commerce_cart';
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.readCart());

  readonly items$ = this.itemsSubject.asObservable();
  readonly count$ = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );
  readonly total$ = this.items$.pipe(
    map(items =>
      items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      )
    )
  );

  add(product: Product): void {
    const items = this.getSnapshot();
    const existing = items.find(item => item.product.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        product: { ...product },
        quantity: 1
      });
    }

    this.persist(items);
  }

  increase(productId: string): void {
    const items = this.getSnapshot();
    const item = items.find(current => current.product.id === productId);

    if (!item) {
      return;
    }

    item.quantity += 1;
    this.persist(items);
  }

  decrease(productId: string): void {
    const items = this.getSnapshot();
    const item = items.find(current => current.product.id === productId);

    if (!item) {
      return;
    }

    if (item.quantity <= 1) {
      this.remove(productId);
      return;
    }

    item.quantity -= 1;
    this.persist(items);
  }

  remove(productId: string): void {
    const items = this.getSnapshot().filter(
      item => item.product.id !== productId
    );
    this.persist(items);
  }

  clear(): void {
    this.persist([]);
  }

  getSnapshot(): CartItem[] {
    return this.itemsSubject.value.map(item => ({
      product: { ...item.product },
      quantity: item.quantity
    }));
  }

  getTotal(): number {
    return this.itemsSubject.value.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  private readCart(): CartItem[] {
    const rawCart = localStorage.getItem(this.storageKey);

    if (!rawCart) {
      return [];
    }

    try {
      return JSON.parse(rawCart) as CartItem[];
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }

  private persist(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.itemsSubject.next(items);
  }
}
