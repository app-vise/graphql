import { Field, InputType } from '@nestjs/graphql';
import { NumericFilter } from '@appvise/domain';
import { GraphQLBigInt } from 'graphql-scalars';

@InputType('NumericFilter')
export class NumericFilterInput implements NumericFilter {
  @Field(() => GraphQLBigInt, {
    nullable: true,
  })
  equals?: number;

  @Field(() => GraphQLBigInt, {
    nullable: true,
  })
  lt?: number;

  @Field(() => GraphQLBigInt, {
    nullable: true,
  })
  lte?: number;

  @Field(() => GraphQLBigInt, {
    nullable: true,
  })
  gt?: number;

  @Field(() => GraphQLBigInt, {
    nullable: true,
  })
  gte?: number;
}
