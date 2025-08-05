import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UsersService } from 'src/users/user.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // GET user info
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userId = req.user!['id'];
    const user = await this.userService.findById(userId);

    return { ...user, password: undefined, refreshToken: undefined };
  }

  // PUT user info
  @UseGuards(AccessTokenGuard)
  @Put('profile')
  async updateUser(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user!['id'], updateUserDto);
  }

  // DELETE user
  @UseGuards(AccessTokenGuard)
  @Delete('profile')
  async remove(@Req() req: Request) {
    return this.userService.remove(req.user!['id']);
  }
}
