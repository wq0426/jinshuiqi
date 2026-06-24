import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Metric } from '../../entities/metric.entity';
import {
  WxAddress,
  WxDevice,
  WxOrder,
  WxProduct,
  WxUser,
  WxWorkorder,
} from '../../entities/wx.entities';
import { WxController } from './wx.controller';
import { WxService } from './wx.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Metric,
      WxProduct,
      WxDevice,
      WxWorkorder,
      WxOrder,
      WxAddress,
      WxUser,
    ]),
  ],
  controllers: [WxController],
  providers: [WxService],
})
export class WxModule {}
