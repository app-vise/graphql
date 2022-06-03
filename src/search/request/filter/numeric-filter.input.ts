import { Field, InputType, Int } from '@nestjs/graphql';
import { NumericFilter } from '@appvise/domain';

@InputType('NumericFilter')
export class NumericFilterInput implements NumericFilter {
  @Field(() => Int, {
    nullable: true,
  })
  equals?: number;

  @Field(() => Int, {
    nullable: true,
  })
  lt?: number;

  @Field(() => Int, {
    nullable: true,
  })
  lte?: number;

  @Field(() => Int, {
    nullable: true,
  })
  gt?: number;

  @Field(() => Int, {
    nullable: true,
  })
  gte?: number;
}
