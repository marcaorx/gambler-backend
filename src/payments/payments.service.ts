import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import Stripe from 'stripe';
import { SubscriptionStatusResponse } from './types/subscription';

@Injectable()
export class PaymentsService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(process.env.PUBLIC_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  async getUser(email: string): Promise<Stripe.Customer> {
    try {
      const customers = await this.stripe.customers.search({
        query: `email:'${email}'`,
      });

      return customers.data[0];
    } catch (error) {
      console.error('Error fetching user:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSubscriptions(): Promise<Stripe.Subscription[]> {
    try {
      const subscriptions = await this.stripe.subscriptions.list();
      return subscriptions.data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getIsUserActive(
    email: string,
  ): Promise<SubscriptionStatusResponse | any> {
    try {
      const user = await this.getUser(email);
      if (!user) {
        return { status: 'not_registered' };
      }
      const subscriptions = await this.getSubscriptions();
      return subscriptions;
      const userSubData = subscriptions.find((sub) => sub.customer === user.id);

      return { status: userSubData?.status };
    } catch (error) {
      console.error('Error fetching subscription status:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
