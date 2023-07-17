import { driver } from '../../plugins/db';

export async function clearData() {
    const session = driver.session();
    await session.run('MATCH (n) DETACH DELETE n');
    await session.close();
    return { data: 'All cleared' };
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
