import { gql } from '../../plugins/db/client';
import { formatBlueprint} from '../../routes/blueprints/utils';
import { type TaskGroup } from '../../routes/taskgroups/types';
import { BP_demo, stroke1, stroke2 } from '../../routes/blueprints/lists';


function getTaskData(taskgroups: TaskGroup[]) {
    let taskData: any = [];

    taskgroups.forEach((tg) => {
        // Define an array of blueprint functions
        const blueprintFunctions = [BP_demo, stroke1, stroke2];

        // Choose a random blueprint function from the array
        const randomBlueprintFunction = blueprintFunctions[Math.floor(Math.random() * blueprintFunctions.length)];

        // Get a random blueprint array using the selected function 
        const randomBlueprintArray = randomBlueprintFunction();

// Apply the formatBlueprint function to the random array
        const bps = formatBlueprint(randomBlueprintArray);
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
