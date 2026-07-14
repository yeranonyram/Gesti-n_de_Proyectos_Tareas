import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { ProjectsService } from '../projects/projects.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let projectsService: ProjectsService;
  let notificationsGateway: NotificationsGateway;
  let usersService: UsersService;
  let emailService: EmailService;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
      getCount: jest.fn().mockResolvedValue(0),
    })),
  };

  const mockProjectsService = {
    findOne: jest.fn().mockResolvedValue({ id: 1, userId: 1 }),
  };

  const mockNotificationsGateway = {
    sendNotification: jest.fn(),
    notifyUser: jest.fn(),
  };

  const mockUsersService = {
    findById: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com' }),
  };

  const mockEmailService = {
    sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
    sendTaskCompletedEmail: jest.fn().mockResolvedValue(undefined),
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
        {
          provide: NotificationsGateway,
          useValue: mockNotificationsGateway,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    projectsService = module.get<ProjectsService>(ProjectsService);
    notificationsGateway = module.get<NotificationsGateway>(NotificationsGateway);
    usersService = module.get<UsersService>(UsersService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending' as any,
        priority: 'medium' as any,
      };
      const userId = 1;
      const projectId = 1;
      const savedTask = { id: 1, ...createTaskDto, projectId };

      mockTaskRepository.create.mockReturnValue(savedTask);
      mockTaskRepository.save.mockResolvedValue(savedTask);

      const result = await service.create(userId, projectId, createTaskDto);

      expect(result).toEqual(savedTask);
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        projectId,
      });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(savedTask);
    });
  });

  describe('findOne', () => {
    it('should return a task if found', async () => {
      const task = { id: 1, title: 'Test', projectId: 1 };
      mockTaskRepository.findOne.mockResolvedValue(task);

      const result = await service.findOne(1, 1);
      expect(result).toEqual(task);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const task = { id: 1, title: 'Old Title', status: 'pending', projectId: 1 };
      const updateDto = { title: 'New Title' };
      const updatedTask = { ...task, ...updateDto };

      mockTaskRepository.findOne
        .mockResolvedValueOnce(task)  // For findOne
        .mockResolvedValueOnce(updatedTask); // For findOne after update
      mockTaskRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, 1, updateDto);
      expect(result.title).toBe('New Title');
    });
  });

  describe('remove', () => {
    it('should soft delete a task', async () => {
      const task = { id: 1, title: 'To Delete', projectId: 1 };
      mockTaskRepository.findOne.mockResolvedValue(task);
      mockTaskRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(1, 1);
      expect(mockTaskRepository.softDelete).toHaveBeenCalledWith(1);
    });
  });

  describe('getStats', () => {
    it('should return task statistics', async () => {
      mockTaskRepository.count.mockResolvedValue(5);
      mockTaskRepository.createQueryBuilder().getRawMany.mockResolvedValue([
        { status: 'pending', count: '2' },
        { status: 'completed', count: '3' },
      ]);

      const stats = await service.getStats(1);
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('byStatus');
      expect(stats).toHaveProperty('byPriority');
    });
  });
});