import {
  ConflictException,
  ConsoleLogger,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskToEmployeeDto } from './dto/create-task-to-employee.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { TaskEmployeeRepository } from './task-employee.repository';
import { TasksService } from 'src/tasks/tasks.service';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { In } from 'typeorm';
import { TaskRepository } from 'src/tasks/tasks.repository';
import { EmployeeService } from 'src/employee/employee.service';
import e from 'express';

@Injectable()
export class TaskEmployeeService {
  constructor(
    private readonly taskService: TasksService,
    private readonly employeeService: EmployeeService,
    private readonly taskEmployeeRepository: TaskEmployeeRepository,
  ) {}

  async attachEmployeesToTask(
    id: string,
    employeeId: string[],
    user: UserEntity,
  ): Promise<void> {
    await this.taskService.verifyId(id, user.id);
    const employee = await this.taskEmployeeRepository.find({
      where: { employeeId: In(employeeId) },
    });

    return await this.taskEmployeeRepository.attachEmployeesToTask(
      id,
      employeeId,
    );
  }

  async attachTaskstoEmployee(id: string, taskId: string[], user: UserEntity) {
    await this.employeeService.verifyId(id, user);
    const task = await this.taskEmployeeRepository.find({
      where: { taskId: In(taskId) },
    });

    return await this.taskEmployeeRepository.attachTaskstoEmployee(id, taskId);
  }

  async deleteEmployeesToTask(
    id: string,
    employee: { id: string },
    user: UserEntity,
  ): Promise<void> {
    await this.taskService.verifyId(id, user.id);
    await this.employeeService.verifyId(employee.id, user);

    return await this.taskEmployeeRepository.deleteEmployeesToTask(
      id,
      employee.id,
    );
  }
}