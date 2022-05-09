import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Entity } from '@appvise/domain';

@ObjectType({ isAbstract: true })
export abstract class BaseNode {
  @Field(() => ID, {
    description: 'Globally unique identifier for this entity',
  })
  id: string;

  @Field(() => GraphQLISODateTime, {
    description: 'Timestamp as to when this entity was created',
  })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, {
    description: 'Timestamp as to when this entity was last updated',
  })
  updatedAt: Date;

  protected constructor(entity: Entity<unknown>) {
    this.id = entity.id.value;
    this.createdAt = entity.createdAt.value;
    this.updatedAt = entity.updatedAt.value;
  }
}
