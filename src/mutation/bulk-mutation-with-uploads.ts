import {
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Resolver,
} from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CurrentIdentity, GetCurrentIdentity, SelectionSet } from '../request';
import { SelectionSet as SelectionSetObject } from '@appvise/domain';
import { Type } from '@nestjs/common';
import { IsArray, ValidateNested } from 'class-validator';
import { Type as TypeDecorator } from 'class-transformer';
import { BulkMutationError } from './bulk-mutation';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Upload from 'graphql-upload/Upload.js';
import { GraphQLUploadScalar } from '../scalar';

export function BulkMutationWithUploads<TEntity, TNode, TQuery, TInput>(
  inputType: Type<TInput>,
  nodeType: new (entity: TEntity) => TNode,
  queryType: new (itemId: string, selectionSet?: SelectionSetObject) => TQuery,
  queryName: string
): any {
  const queryNameClass =
    queryName.substring(0, 1).toUpperCase() + queryName.substring(1);

  @InputType(`${queryNameClass}Input`)
  class BulkMutationInputClass {
    @Field(() => [inputType])
    @IsArray()
    @TypeDecorator(() => inputType)
    @ValidateNested({ each: true })
    items!: TInput[];
  }

  @ObjectType(`${queryNameClass}Result`)
  class BulkMutationResult {
    @Field(() => Int)
    index: number;

    @Field(() => nodeType, { nullable: true })
    node?: TNode;

    @Field(() => BulkMutationError, { nullable: true })
    error?: BulkMutationError;

    constructor(index: number, node?: TNode, error?: BulkMutationError) {
      this.index = index;
      this.node = node;
      this.error = error;
    }
  }

  @ObjectType(`${queryNameClass}Response`)
  class BulkMutationResponse {
    @Field(() => [BulkMutationResult])
    results!: BulkMutationResult[];

    @Field(() => Int)
    errorCount!: number;
  }

  @Resolver(() => nodeType, { isAbstract: true })
  abstract class BulkMutationWithUploadsResolver {
    protected constructor(
      protected readonly commandBus: CommandBus,
      protected readonly queryBus: QueryBus
    ) {}

    @Mutation(() => BulkMutationResponse, { name: queryName })
    async execute(
      @Args('data', { type: () => BulkMutationInputClass })
      input: BulkMutationInputClass,
      @GetCurrentIdentity() currentIdentity: CurrentIdentity,
      @SelectionSet() selectionSet: SelectionSetObject,
      @Args({
        name: 'files',
        type: () => [GraphQLUploadScalar],
        nullable: true,
      })
      files?: Upload[]
    ): Promise<BulkMutationResponse> {
      const results: BulkMutationResult[] = [];
      let errorCount = 0;

      for (let index = 0; index < input.items.length; index++) {
        try {
          // Call abstract mutation in extender class
          const nodeId = await this.executeMutation(
            input.items[index],
            currentIdentity,
            files && files[index] ? await files[index] : undefined
          );

          // Retrieve created/updated entity
          const entity = await this.queryBus.execute<TQuery, TEntity>(
            new queryType(nodeId, selectionSet)
          );

          // Wrap entity in result set
          results.push(new BulkMutationResult(index, new nodeType(entity)));
        } catch (error: any) {
          errorCount++;

          // Add error for item
          results.push(
            new BulkMutationResult(
              index,
              undefined,
              new BulkMutationError(error.message)
            )
          );
        }
      }

      return {
        results,
        errorCount,
      };
    }

    abstract executeMutation(
      input: TInput,
      currentIdentity: CurrentIdentity,
      file?: Upload
    ): Promise<string>;
  }

  return BulkMutationWithUploadsResolver;
}
