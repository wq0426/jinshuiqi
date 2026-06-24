import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Metric } from '../../entities/metric.entity';
import {
  AdminAlert,
  AdminAlertRule,
  AdminCategory,
  AdminCommission,
  AdminCustomer,
  AdminDevice,
  AdminDeviceModel,
  AdminDistRule,
  AdminDistributor,
  AdminOrder,
  AdminProduct,
  AdminRechargePackage,
  AdminRechargeRecord,
  AdminTechnician,
  AdminWithdrawal,
  AdminWorkorder,
} from '../../entities/admin.entities';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Metric,
      AdminCategory,
      AdminProduct,
      AdminOrder,
      AdminDevice,
      AdminDeviceModel,
      AdminWorkorder,
      AdminTechnician,
      AdminDistributor,
      AdminCommission,
      AdminWithdrawal,
      AdminDistRule,
      AdminCustomer,
      AdminRechargePackage,
      AdminRechargeRecord,
      AdminAlert,
      AdminAlertRule,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
