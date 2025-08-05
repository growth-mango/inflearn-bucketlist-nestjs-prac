import { BucketList } from 'src/bucket-lists/entities/bucket-list.entity';
import { Destination } from 'src/destinations/entities/destination.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BucketListItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BucketList, (BucketList) => BucketList.items)
  bucketList: BucketList | undefined;

  @ManyToOne(() => Destination, (Destination) => Destination.bucketListItems, {
    eager: true,
  })
  destination: Destination;

  @Column({ default: false })
  achieved: boolean;
}

// many 쪽이 보통 bucketListId 같은식으로 컬럼 가지고 있음 왜냐? 어차피 many 는 여러개 row 가 만들어지고 거기에 id 붙는 형식이 더 효율적이니가!
