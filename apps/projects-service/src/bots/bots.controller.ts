import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BotsService } from './bots.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('bots')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bot' })
  @ApiResponse({ status: 201, description: 'Bot created successfully' })
  create(@Body() createBotDto: CreateBotDto, @Request() req) {
    return this.botsService.create(createBotDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bots for the current user' })
  @ApiResponse({ status: 200, description: 'Return all bots' })
  findAll(@Request() req) {
    return this.botsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bot by id' })
  @ApiResponse({ status: 200, description: 'Return the bot' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.botsService.findOne(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bot' })
  @ApiResponse({ status: 200, description: 'Bot deleted successfully' })
  remove(@Param('id') id: string, @Request() req) {
    return this.botsService.remove(id, req.user.id);
  }
} 