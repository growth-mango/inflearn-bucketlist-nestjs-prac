export class CreateBucketListItemDto {
  // bucketListId 는 params 로 가져오고
  // achieved 는 항상 false 로 넣을거라서 dto 필드로 넣을 필요가 없음
  destinationId: number;
}
