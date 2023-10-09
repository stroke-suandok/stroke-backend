import { FastifyInstance } from 'fastify';

import { type TasksReq } from './types';
import { getNodePosition } from './uitls';

export async function getTasks(fastify: FastifyInstance, body: TasksReq) {
    const query = `
    MATCH (n: TASK) - [: IN_TASKGROUP] - > (: TASK_GROUP {
        id: $taskGroupId
        })
        MATCH (: TASK_GROUP {
          id: $taskGroupId
          }) < -[: IN_TASKGROUP] - (parent: TASK) - [r: NEXT] - > (: TASK)
          WITH collect( DISTINCT n {
            .*, createdAt: apoc.temporal.format(n.createdAt, 'iso_instant'), elementId: elementId(n)
            }) AS nodes, collect( DISTINCT r {
              .*, elementId: elementId(r), source: elementId(startNode(r)), target: elementId(endNode(r)), isRequired: parent.isRequired
              }) AS edges
              WITH {
                nodes: nodes,
                edges: edges
              }
               AS data
              RETURN data
      
    `;

    const { records } = await fastify.neo4jDriver.executeQuery(query, {
        taskGroupId: body.taskGroupId,
    });

    const data = records.map((r) => r.get('data'))[0];
    const nodes = data!.nodes;
    const edges = data!.edges;

    const nodesOut = getNodePosition(nodes, edges);
    return { nodes: nodesOut, edges: edges };
}
