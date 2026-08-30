import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressLogDto, SetProgressGoalDto } from './dto/progress.dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async upsertLog(userId: string, dto: CreateProgressLogDto) {
    const logDate = new Date(dto.date);
    // Strip time for Date type in Prisma
    const isoDateOnly = new Date(Date.UTC(logDate.getUTCFullYear(), logDate.getUTCMonth(), logDate.getUTCDate()));

    const data = {
      weightKg: dto.weightKg ?? null,
      bodyFatPct: dto.bodyFatPct ?? null,
      muscleMassKg: dto.muscleMassKg ?? null,
      chestCm: dto.chestCm ?? null,
      waistCm: dto.waistCm ?? null,
      hipCm: dto.hipCm ?? null,
      armCm: dto.armCm ?? null,
      thighCm: dto.thighCm ?? null,
      sleepHours: dto.sleepHours ?? null,
      waterLiters: dto.waterLiters ?? null,
      dailySteps: dto.dailySteps ?? null,
      caloriesBurned: dto.caloriesBurned ?? null,
      restingHeartRate: dto.restingHeartRate ?? null,
      systolicBp: dto.systolicBp ?? null,
      diastolicBp: dto.diastolicBp ?? null,
      energyLevel: dto.energyLevel ?? null,
      stressLevel: dto.stressLevel ?? null,
      notes: dto.notes ?? null,
    };

    return this.prisma.progressLog.upsert({
      where: {
        userId_date: {
          userId,
          date: isoDateOnly,
        },
      },
      update: data,
      create: {
        userId,
        date: isoDateOnly,
        ...data,
      },
    });
  }

  async getLogs(userId: string, limit = 30) {
    return this.prisma.progressLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }

  async getLatestLog(userId: string) {
    const log = await this.prisma.progressLog.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    return log ?? null;
  }

  async setGoal(userId: string, dto: SetProgressGoalDto) {
    return this.prisma.progressGoal.upsert({
      where: { userId },
      update: {
        weightKg: dto.weightKg ?? null,
        bodyFatPct: dto.bodyFatPct ?? null,
        muscleMassKg: dto.muscleMassKg ?? null,
        chestCm: dto.chestCm ?? null,
        waistCm: dto.waistCm ?? null,
        hipCm: dto.hipCm ?? null,
        armCm: dto.armCm ?? null,
        thighCm: dto.thighCm ?? null,
        sleepHours: dto.sleepHours ?? null,
        waterLiters: dto.waterLiters ?? null,
        dailySteps: dto.dailySteps ?? null,
        caloriesBurned: dto.caloriesBurned ?? null,
      },
      create: {
        userId,
        weightKg: dto.weightKg ?? null,
        bodyFatPct: dto.bodyFatPct ?? null,
        muscleMassKg: dto.muscleMassKg ?? null,
        chestCm: dto.chestCm ?? null,
        waistCm: dto.waistCm ?? null,
        hipCm: dto.hipCm ?? null,
        armCm: dto.armCm ?? null,
        thighCm: dto.thighCm ?? null,
        sleepHours: dto.sleepHours ?? null,
        waterLiters: dto.waterLiters ?? null,
        dailySteps: dto.dailySteps ?? null,
        caloriesBurned: dto.caloriesBurned ?? null,
      },
    });
  }

  async getGoal(userId: string) {
    const goal = await this.prisma.progressGoal.findUnique({
      where: { userId },
    });
    return goal ?? null;
  }

  async getStats(userId: string) {
    const logs = await this.prisma.progressLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 14,
    });

    const goal = await this.prisma.progressGoal.findUnique({
      where: { userId },
    });

    const latest = logs[0] ?? null;
    const previous = logs[1] ?? null;

    // Weight change relative to first recorded log or previous
    const earliestLog = logs[logs.length - 1] ?? null;
    const weightChange = (latest?.weightKg && previous?.weightKg)
      ? Number((latest.weightKg - previous.weightKg).toFixed(1))
      : 0;

    // Averages (last 7 logs)
    const last7 = logs.slice(0, 7);
    const avgSleep = last7.length > 0
      ? Number((last7.reduce((acc, l) => acc + (l.sleepHours ?? 0), 0) / (last7.filter(l => l.sleepHours != null).length || 1)).toFixed(1))
      : 0;

    const avgWater = last7.length > 0
      ? Number((last7.reduce((acc, l) => acc + (l.waterLiters ?? 0), 0) / (last7.filter(l => l.waterLiters != null).length || 1)).toFixed(1))
      : 0;

    const avgSteps = last7.length > 0
      ? Math.round(last7.reduce((acc, l) => acc + (l.dailySteps ?? 0), 0) / (last7.filter(l => l.dailySteps != null).length || 1))
      : 0;

    return {
      latest,
      goal,
      weightChange,
      averages: {
        sleepHours: avgSleep,
        waterLiters: avgWater,
        dailySteps: avgSteps,
      },
      totalLogsCount: logs.length,
    };
  }
}
