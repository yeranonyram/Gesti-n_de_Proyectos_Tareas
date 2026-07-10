import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  private getUserId(req: any): number {
    const userId = req.user?.id || req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return userId;
  }

  @Post()
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    const userId = this.getUserId(req);
    return this.projectsService.create(userId, createProjectDto);
  }

  @Get()
  findAll(@Request() req, @Query() queryDto: QueryProjectDto) {
    const userId = this.getUserId(req);
    return this.projectsService.findAllPaginated(userId, queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = this.getUserId(req);
    return this.projectsService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const userId = this.getUserId(req);
    return this.projectsService.update(+id, userId, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = this.getUserId(req);
    return this.projectsService.remove(+id, userId);
  }
}