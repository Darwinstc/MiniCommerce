import { Injectable } from '@angular/core';

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore';

import { firestore } from '../core/firebase.config';
import {
  Order
} from '../models/order.model';

import {
  CartItem
} from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  async createOrder(
    userId: string,
    userName: string,
    userEmail: string,
    items: CartItem[],
    total: number
  ): Promise<string> {

    const orderReference =
      await addDoc(
        collection(
          firestore,
          'orders'
        ),
        {
          userId,
          userName,
          userEmail,

          items: items.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image
          })),

          total,
          status: 'COMPLETADO',
          createdAt: serverTimestamp()
        }
      );

    return orderReference.id;
  }

  async getById(
    orderId: string
  ): Promise<Order | null> {

    const orderReference =
      doc(
        firestore,
        'orders',
        orderId
      );

    const snapshot =
      await getDoc(
        orderReference
      );

    if (!snapshot.exists()) {
      return null;
    }

    const data =
      snapshot.data();

    return {
      id: snapshot.id,
      userId: data['userId'],
      userName: data['userName'],
      userEmail: data['userEmail'],
      items: data['items'],
      total: data['total'],
      status: data['status'],
      createdAt:
        data['createdAt']
          ?.toDate()
          ?.toISOString() ?? ''
    } as Order;
  }

  async getOrdersByUser(
    userId: string
  ): Promise<Order[]> {

    const ordersQuery =
      query(
        collection(
          firestore,
          'orders'
        ),
        where(
          'userId',
          '==',
          userId
        ),
        orderBy(
          'createdAt',
          'desc'
        )
      );

    const snapshot =
      await getDocs(
        ordersQuery
      );

    return snapshot.docs.map(
      document => {

        const data =
          document.data();

        return {
          id: document.id,
          userId: data['userId'],
          userName: data['userName'],
          userEmail: data['userEmail'],
          items: data['items'],
          total: data['total'],
          status: data['status'],
          createdAt:
            data['createdAt']
              ?.toDate()
              ?.toISOString() ?? ''
        };

      }
    ) as Order[];
  }
}