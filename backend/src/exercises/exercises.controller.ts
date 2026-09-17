import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto, QueryExerciseDto } from './dto/exercises.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  findAll(@Query() query: QueryExerciseDto) {
    return this.exercisesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateExerciseDto) {
    return this.exercisesService.create(req.user.id, dto);
  }
}
