import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Point } from '@appvise/domain';

@ObjectType('Point')
export class PointField {
  @Field(() => Float)
  x: number;

  @Field(() => Float)
  y: number;

  constructor(point: Point) {
    this.x = point.x;
    this.y = point.y;
  }
}
