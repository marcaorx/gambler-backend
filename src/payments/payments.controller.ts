import { Controller, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('subscriptions')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Get('/:email')
  getIsUserActive(@Param('email') email) {
    try {
      return this.paymentService.getIsUserActive(email);
    } catch (error) {
      console.log(error);
    }
  }
}
