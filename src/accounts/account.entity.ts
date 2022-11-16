import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  stub: string;

  @Column({ nullable: false })
  exchange: string;

  @Column({ nullable: false })
  apiKey: string;

  @Column({ nullable: false })
  secret: string;
}
