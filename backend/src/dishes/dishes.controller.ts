import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto, QueryDishDto } from './dto/dishes.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  findAll(@Query() query: QueryDishDto) {
    return this.dishesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateDishDto) {
    return this.dishesService.create(req.user.id, dto);
  }
}
