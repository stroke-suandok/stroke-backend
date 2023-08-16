import { gql } from '../../plugins/db/client';
import { BP_demo } from '../../routes/blueprints/lists';
import { formatBlueprint } from '../../routes/blueprints/utils';
import { type TaskGroup } from '../../routes/taskgroups/types';

function getTaskData(taskgroups: TaskGroup[]) {
    let taskData: any = [];

    taskgroups.forEach((tg) => {
        const bps = formatBlueprint(BP_demo());
        const data = bps.map((bp) => {
            const { parentIds, childrenIds, ...mainFields } = bp;
            return {
                ...mainFields,
                taskGroup: {
                    connect: {
                        where: {
                            node: { id: tg.id },
                        },
                    },
                },
                parents: {
                    connect: parentIds?.map((id) => ({
                        where: { node: { id: id } },
                    })),
                },
                children: {
                    connect: childrenIds?.map((id) => ({
                        where: { node: { id: id } },
                    })),
                },
            };
        });
        taskData = [...taskData, ...data];
    });

    return taskData;
}

export function seedBlueprint(taskgroups: TaskGroup[]) {
    const taskData = getTaskData(taskgroups);
    const gqlMutation = gql`
        mutation Mutation($input: [TASKCreateInput!]!) {
            createTasks(input: $input) {
                tasks {
                    id
                }
            }
        }
    `;

    const variables = {
        input: taskData,
    };

    return {
        query: gqlMutation,
        variables,
    };
}
