import { driver } from '../../db/server';
import { getNodePosition } from '../../graph';
import { createTaskGroups } from '../taskgroups/services';
import { createTasks, getTasksByTaskGroupId } from '../tasks/services';
import { blueprint, formatBluePrint } from './utils';

export async function clearData() {
    const session = driver.session();
    await session.run('MATCH (n) DETACH DELETE n');
    await session.close();
    return { data: 'All cleared' };
}

export async function seedData() {
    const taskGroups = await createTaskGroups(
        'HN' + Date.now().toString().slice(-5),
    );
    const taskGroupId = taskGroups[0].id;
    const parentTasks = await getTasksByTaskGroupId(taskGroupId);
    const parentTaskId = parentTasks[0].id;
    const blueprintMap = formatBluePrint(parentTaskId, blueprint);

    for await (const b of blueprintMap) {
        await createTasks({
            taskGroupId: taskGroupId,
            parentTaskIds: b.parentIds,
            taskType: b.taskType,
            title: b.title,
            requiredArr: b.requiredArr,
            status: b.status,
            id: b.id,
        });
    }
}

export async function getTasksWithActiveStatus() {
    const session = driver.session();
    const data = await session.run(`
        match (task:TASK)
        optional match (taskParents:TASK)-[:NEXT]->(task:TASK)
        optional match (task:TASK)-[:NEXT]->(taskChildren:TASK)
        optional match (taskParentsRequired:TASK)-[:NEXT{required: true}]->(task:TASK)
        with task, collect(distinct taskChildren{.*}) as groupTaskChildren, collect(distinct taskParents{.*}) as groupTaskParents, collect(distinct taskParentsRequired{.*}) as groupTaskParentsRequired, collect(taskParentsRequired.status) AS taskParentsRequiredStatusList
        with *, reduce(isActive = true, status IN taskParentsRequiredStatusList | isActive AND (status = 'SUCCESS')) AS isActive
        return task{.*, groupTaskChildren:groupTaskChildren, groupTaskParents:groupTaskParents, isActive: isActive AND (task.status = 'PENDING'), groupTaskParentsRequired:groupTaskParentsRequired}
    `);
    await session.close();
    return data.records.map((r) => r.get('task'));
}

export async function getGraphInfo() {
    const session = driver.session();
    const dataTemp = await session.run(`
        match (n:TASK)
        match (:TASK)-[r:NEXT]->(:TASK)
        with collect(distinct n{.*, elementId:elementId(n)}) as nodes, collect(distinct r{.*, elementId:elementId(r), source:elementId(startNode(r)), target:elementId(endNode(r))}) as edges
        return {nodes:nodes, edges:edges}`);
    await session.close();
    const data = dataTemp.records.map((r) =>
        r.get('{nodes:nodes, edges:edges}'),
    )[0];

    const nodes = data!.nodes;
    const edges = data!.edges;

    const nodesOut = getNodePosition(nodes, edges);
    return { nodes: nodesOut, edges: edges };
}
