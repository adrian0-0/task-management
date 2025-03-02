import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetStatusFilterDto } from './dto/get-status-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../user/entities/user.entity';
import { User } from '../auth/get-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateTaskToEmployeeDto } from '../task-employee/dto/create-task-to-employee.dto';
import { TaskEmployeeService } from '../task-employee/task-employee.service';
import { ResponseDto } from '../common/response/dto/response.dto';

@Controller('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class TasksController {
  constructor(
    private taskService: TasksService,
    private readonly taskEmployeeService: TaskEmployeeService,
  ) {}

  @Get()
  getTaks(
    @Query() filterDto: GetStatusFilterDto,
    @User() user: UserEntity,
  ): Promise<ResponseDto<TaskEntity[]>> {
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  findOneTask(
    @Param('id') id: string,
    @User() user: UserEntity,
  ): Promise<ResponseDto<TaskEntity>> {
    return this.taskService.findOneTask(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @User() user: UserEntity,
  ): Promise<ResponseDto<TaskEntity>> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Post('/employee/:id')
  attachEmployeesToTask(
    @Param('id') id: string,
    @Body() taskId: string[],
    @User() user: UserEntity,
  ): Promise<void> {
    return this.taskEmployeeService.attachEmployeesToTask(id, taskId, user);
  }

  @Patch('/:id')
  updateTaskByUser(
    @Param('id') id: string,
    @User() user: UserEntity,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<ResponseDto<TaskEntity>> {
    return this.taskService.updateTask(id, user, updateTaskDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  deleteTaskById(
    @Param('id') id: string,
    @User() user: UserEntity,
  ): Promise<void> {
    return this.taskService.deleteTask(id, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/employee/:id/:employeeId')
  deleteEmployeesToTask(
    @Param('id') id: string,
    @Param('employeeId') employeeId: string,
    @User() user: UserEntity,
  ): Promise<void> {
    return this.taskEmployeeService.removeEmployeeFromTask(
      id,
      employeeId,
      user,
    );
  }
}
