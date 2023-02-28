import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { SearchResult } from '@appvise/domain';

export interface IEdgeType<TNode> {
  cursor: string;
  node: TNode;
}

export function Edge<TEntity, TNode, TEdgeEntity>(
  nodeRef: Type<TNode>
): Type<IEdgeType<TNode>> {
  @ObjectType({ isAbstract: true })
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => nodeRef)
    node: TNode;

    protected constructor(
      entity: TEntity,
      edgeResult: SearchResult<TEdgeEntity>
    ) {
      this.cursor = edgeResult.cursor;
      this.node = new nodeRef(entity);
    }
  }

  return EdgeType as Type<IEdgeType<TNode>>;
}
