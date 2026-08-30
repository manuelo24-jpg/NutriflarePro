import { Controller, Get, Post, Body, Req, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateProgressLogDto, SetProgressGoalDto } from './dto/progress.dto';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('logs')
  createOrUpdateLog(@Req() req: any, @Body() dto: CreateProgressLogDto) {
    return this.progressService.upsertLog(req.user.id, dto);
  }

  @Get('logs')
  getLogs(@Req() req: any, @Query('limit') limit?: string) {
    const take = limit ? parseInt(limit, 10) : 30;
    return this.progressService.getLogs(req.user.id, take);
  }

  @Get('logs/latest')
  getLatestLog(@Req() req: any) {
    return this.progressService.getLatestLog(req.user.id);
  }

  @Post('goals')
  setGoal(@Req() req: any, @Body() dto: SetProgressGoalDto) {
    return this.progressService.setGoal(req.user.id, dto);
  }

  @Get('goals')
  getGoal(@Req() req: any) {
    return this.progressService.getGoal(req.user.id);
  }

  @Get('stats')
  getStats(@Req() req: any) {
    return this.progressService.getStats(req.user.id);
  }
}
