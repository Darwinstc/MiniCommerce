import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import {
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';

import { firestore } from '../core/firebase.config';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  getAll(): Observable<Product[]> {
    return from(this.getProducts());
  }

  private async getProducts(): Promise<Product[]> {

    const productsQuery = query(
      collection(
        firestore,
        'products'
      ),
      where(
        'isActive',
        '==',
        true
      )
    );

    const snapshot =
      await getDocs(productsQuery);

    return snapshot.docs.map(document => ({
      id: document.id,
      ...document.data()
    })) as Product[];
  }
}