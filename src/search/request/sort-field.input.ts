import { Field, InputType } from '@nestjs/graphql';
import { SortDirection, SortField } from '@appvise/domain';

@InputType('SortField', { isAbstract: true })
export abstract class SortFieldInput implements SortField {
  abstract field: string;

  @Field(() => SortDirection)
  direction!: SortDirection;
}
