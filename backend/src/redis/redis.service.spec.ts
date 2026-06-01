import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';

const mockConfigService = {
  get: jest.fn().mockReturnValue('redis://localhost:6379'),
};

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      get: jest.fn().mockResolvedValue('value'),
      set: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
      quit: jest.fn().mockResolvedValue('OK'),
    };
  });
});

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve a key from redis', async () => {
    const result = await service.get('test_key');
    expect(result).toBe('value');
    expect(service.getClient().get).toHaveBeenCalledWith('test_key');
  });

  it('should set a key in redis', async () => {
    const result = await service.set('test_key', 'value', 3600);
    expect(result).toBe('OK');
    expect(service.getClient().set).toHaveBeenCalledWith('test_key', 'value', 'EX', 3600);
  });

  it('should delete a key from redis', async () => {
    const result = await service.del('test_key');
    expect(result).toBe(1);
    expect(service.getClient().del).toHaveBeenCalledWith('test_key');
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });
});
