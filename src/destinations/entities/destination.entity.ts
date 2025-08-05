import { BucketListItem } from 'src/bucket-list-items/entities/bucket-list-item.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index('idx_destination_description', ['description'])
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  location: string;

  @OneToMany(
    () => BucketListItem,
    (bucketListItem) => bucketListItem.destination,
  )
  bucketListItems: BucketListItem[];
}
