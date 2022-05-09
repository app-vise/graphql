import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PointInput {
  @Field()
  x!: number;

  @Field()
  y!: number;
}
