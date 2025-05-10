import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bot } from './entities/bot.entity';
import { CreateBotDto } from './dto/create-bot.dto';

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bot)
    private botsRepository: Repository<Bot>,
  ) {}

  async create(createBotDto: CreateBotDto, userId: string): Promise<Bot> {
    const bot = this.botsRepository.create({
      ...createBotDto,
      userId,
    });
    return this.botsRepository.save(bot);
  }

  async findAll(userId: string): Promise<Bot[]> {
    return this.botsRepository.find({
      where: { userId },
      relations: ['project'],
    });
  }

  async findOne(id: string, userId: string): Promise<Bot> {
    const bot = await this.botsRepository.findOne({
      where: { id, userId },
      relations: ['project'],
    });

    if (!bot) {
      throw new NotFoundException(`Bot with ID ${id} not found`);
    }

    return bot;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.botsRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Bot with ID ${id} not found`);
    }
  }
} 