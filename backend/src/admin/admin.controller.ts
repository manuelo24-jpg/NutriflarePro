import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ContentStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/block')
  blockUser(@Param('id') id: string, @Body('isBlocked') isBlocked: boolean) {
    return this.adminService.blockUser(id, isBlocked);
  }

  @Get('pending-content')
  getPendingContent() {
    return this.adminService.getPendingContent();
  }

  @Patch('content/:type/:id/status')
  updateContentStatus(
    @Param('type') type: 'exercise' | 'dish',
    @Param('id') id: string,
    @Body('status') status: ContentStatus,
  ) {
    return this.adminService.updateContentStatus(type, id, status);
  }
}
