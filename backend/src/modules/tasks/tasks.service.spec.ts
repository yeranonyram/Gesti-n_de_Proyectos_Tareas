import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { ProjectsService } from '../projects/projects.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { describe } from 'node:test';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepo: Repository<Task>;
  let projectsService: ProjectsService;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    findAndCount: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
      getCount: jest.fn().mockResolvedValue(0),
    })),
  };

  const mockProjectsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepo = module.get<Repository<Task>>(getRepositoryToken(Task));
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const userId = 1;
      const projectId = 1;
      const createTaskDto = { title: 'Test Task', description: 'Test Desc' };
      const mockTask = { id: 1, ...createTaskDto, projectId };

      mockProjectsService.findOne.mockResolvedValue({ id: projectId });
      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(userId, projectId, createTaskDto);
      expect(result).toEqual(mockTask);
      expect(mockProjectsService.findOne).toHaveBeenCalledWith(
        projectId,
        userId,
      );
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if task does not belong to user', async () => {
      const mockTask = { id: 1, projectId: 2 };
      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockProjectsService.findOne.mockRejectedValue(new ForbiddenException());
      await expect(service.findOne(1, 1)).rejects.toThrow(ForbiddenException);
    });
  });
});
