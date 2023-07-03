import { driver } from '../../db/server';
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
        with task, collect(distinct taskChildren{.*}) as groupTaskChildren, collect(distinct taskParents{.*}) as groupTaskParents, collect(taskParents.status) AS taskParentsStatusList
        with *, reduce(isActive = true, status IN taskParentsStatusList | isActive AND (status = 'SUCCESS')) AS isActive
        return task{.*, groupTaskChildren:groupTaskChildren, groupTaskParents:groupTaskParents, isActive: isActive AND (task.status = 'PENDING')}
    `);
    await session.close();
    return data.records.map((r) => r.get('task'));
}
