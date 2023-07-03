import { v4 as uuidv4 } from 'uuid';

interface Blueprint {
    node: number;
    parentNodes: number[];
    taskType: string;
    title: string;
    requiredArr: boolean[];
    status: string;
}

export const blueprint: Blueprint[] = [
    {
        node: 1,
        parentNodes: [0],
        taskType: 'TASK_TYPE_1',
        title: 'Task 1',
        requiredArr: [true],
        status: 'SUCCESS',
    },
    {
        node: 2,
        parentNodes: [1],
        taskType: 'TASK_TYPE_2',
        title: 'Task 2',
        requiredArr: [true],
        status: 'SUCCESS',
    },
    {
        node: 3,
        parentNodes: [1, 2],
        taskType: 'TASK_TYPE_3',
        title: 'Task 3',
        requiredArr: [true, false],
        status: 'PENDING',
    },
    {
        node: 4,
        parentNodes: [3],
        taskType: 'TASK_TYPE_4',
        title: 'Task 4',
        requiredArr: [true],
        status: 'PENDING',
    },
    {
        node: 5,
        parentNodes: [4],
        taskType: 'TASK_TYPE_5',
        title: 'Task 5',
        requiredArr: [true],
        status: 'PENDING',
    },
];

export function formatBluePrint(parentTaskId: string, blueprint: Blueprint[]) {
    let nodes: number[] = [];
    blueprint.forEach((b) => {
        nodes = [...nodes, b.node, ...b.parentNodes];
    });
    const uniqueNodes = [...new Set(nodes)].sort((a, b) => a - b);

    const uniqueNodesMap = uniqueNodes.map((id) => {
        if (id === 0) {
            return { node: id, id: parentTaskId };
        } else {
            return { node: id, id: uuidv4() };
        }
    });

    const blueprintMap = blueprint.map((b) => {
        const findId = uniqueNodesMap.find((n) => n.node === b.node);
        if (!findId) throw new Error('Node not found');
        const id = findId.id;

        const parentIds = b.parentNodes.map((p) => {
            const findId = uniqueNodesMap.find((n) => n.node === p);
            if (!findId) throw new Error('Node not found');
            return findId.id;
        });

        return {
            ...b,
            id,
            parentIds,
        };
    });

    // console.log('-----------------------------------');
    // console.log(blueprintMap);
    return blueprintMap;
}
