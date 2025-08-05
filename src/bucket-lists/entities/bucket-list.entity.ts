import { BucketListItem } from 'src/bucket-list-items/entities/bucket-list-item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['name', 'user'], { unique: true })
export class BucketList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @ManyToOne(() => User, (user) => user.bucketLists)
  user: User | undefined;

  @OneToMany(
    () => BucketListItem,
    (bucketListItem) => bucketListItem.bucketList,
  )
  items: BucketListItem[];
}
