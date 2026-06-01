import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    this.logger.log(`Connecting to Redis at: ${redisUrl}`);

    try {
      this.redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
      });

      this.redisClient.on('connect', () => {
        this.logger.log('Successfully connected to Redis database');
      });

      this.redisClient.on('error', (error) => {
        this.logger.error('Redis connection error:', error);
      });
    } catch (error) {
      this.logger.error('Failed to initialize Redis client:', error);
    }
  }

  getClient(): Redis {
    return this.redisClient;
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    if (ttlSeconds) {
      return this.redisClient.set(key, value, 'EX', ttlSeconds);
    }
    return this.redisClient.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async onModuleDestroy() {
    if (this.redisClient) {
      this.logger.log('Disconnecting from Redis...');
      await this.redisClient.quit();
    }
  }
}
