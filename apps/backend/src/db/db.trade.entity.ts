import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('trades')
export class Trade {
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
