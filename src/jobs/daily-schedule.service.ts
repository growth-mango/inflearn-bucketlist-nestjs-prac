import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class DailyScheduleService {
  constructor(private readonly userService: UsersService) {}

  @Cron('0 0 9 * * *')
  async trackUserCountEvery9AM() {
    const userCount = await this.userService.countAll();

    console.log(
      `[${new Date().toLocaleDateString()}] 오늘의 유저 수는 ${userCount}명 입니다.`,
    );
  }
}
