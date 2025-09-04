import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('trades')
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  symbol: string;

  @PrimaryColumn({ type: 'timestamptz' })
  ts: Date;

  @Column('float')
  price: number;

  @Column('float')
  qty: number;

  @CreateDateColumn()
  createdAt: Date;
}
