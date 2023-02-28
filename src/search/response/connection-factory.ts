import { SearchResponse, SearchResult, SelectionSet } from '@appvise/domain';
import { IConnectionType, IEdgeType } from '.';

export class ConnectionFactory {
  static fromSearchResponse<
    TEntity,
    TNode,
    TEdge extends IEdgeType<TNode>,
    TConnection extends IConnectionType<TNode, TEdge>
  >(
    connectionType: new () => TConnection,
    nodeType: new (entity: TEntity) => TNode,
    response: SearchResponse<TEntity>,
    selectionSet: SelectionSet,
    customEdgeType?: new (
      entity: TEntity,
      searchResult: SearchResult<TEntity>
    ) => TEdge
  ): TConnection {
    const connection = new connectionType();

    connection.pageInfo = response.pageInfo;

    if (response.totalCount !== undefined) {
      connection.totalCount = response.totalCount;
    }

    if (selectionSet.isSelected('edges')) {
      connection.edges = response.results.map((searchResult) => {
        if (customEdgeType) {
          // Construct custom edge if provided
          return new customEdgeType(searchResult.item, searchResult);
        }

        // Return default edge otherwise
        return {
          cursor: searchResult.cursor,
          node: new nodeType(searchResult.item),
        } as TEdge;
      });
    }

    if (selectionSet.isSelected('nodes')) {
      connection.nodes = response.results.map((searchResult) => {
        return new nodeType(searchResult.item);
      });
    }

    return connection;
  }
}
