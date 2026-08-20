import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';

import { firestore } from '../core/firebase.config';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private readonly reviewsSubject =
    new BehaviorSubject<Review[]>([]);

  readonly reviews$ =
    this.reviewsSubject.asObservable();

  constructor() {
    void this.loadReviews();
  }

  async addReview(
    userId: string,
    userName: string,
    rating: number,
    comment: string
  ): Promise<void> {

    await addDoc(
      collection(
        firestore,
        'reviews'
      ),
      {
        userId,
        userName,
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp()
      }
    );

    await this.loadReviews();
  }

  async loadReviews(): Promise<void> {

    const reviewsQuery = query(
      collection(
        firestore,
        'reviews'
      ),
      orderBy(
        'createdAt',
        'desc'
      )
    );

    const snapshot =
      await getDocs(reviewsQuery);

    const reviews: Review[] =
      snapshot.docs.map(document => {

        const data = document.data();

        return {
          id: document.id,
          userId: data['userId'],
          userName: data['userName'],
          rating: data['rating'],
          comment: data['comment'],
          createdAt:
            data['createdAt']
              ?.toDate()
              ?.toISOString() ?? ''
        };
      });

    this.reviewsSubject.next(
      reviews
    );
  }
}