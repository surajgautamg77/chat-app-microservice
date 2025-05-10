import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateProjectDto } from '../dto/create-project.dto';

@ApiTags('projects')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(
    @Inject('PROJECTS_SERVICE') private readonly projectsClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsClient.send({ cmd: 'create_project' }, { ...createProjectDto, userId: req.user.id });
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects for the current user' })
  @ApiResponse({ status: 200, description: 'Return all projects' })
  async findAll(@Request() req) {
    return this.projectsClient.send({ cmd: 'get_projects' }, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by id' })
  @ApiResponse({ status: 200, description: 'Return the project' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.projectsClient.send({ cmd: 'get_project' }, { id, userId: req.user.id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.projectsClient.send({ cmd: 'delete_project' }, { id, userId: req.user.id });
  }
} 