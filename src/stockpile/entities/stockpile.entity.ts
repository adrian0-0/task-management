import { TaskEntity } from 'src/tasks/entities/task.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('stockpile')
export class StockPileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  quant: number;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => UserEntity, (user) => user.stockpile, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @Column({ name: 'userId' })
  userId: string;

  @ManyToOne(() => TaskEntity, (task) => task.stockpile, {
    onDelete: 'CASCADE',
  })
  task: string;

  @Column({ name: 'taskId', nullable: true })
  taskId?: string;
}
