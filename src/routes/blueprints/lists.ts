export interface Blueprint {
    id: string;
    parentIds: string[];
    childrenIds?: string[];
    taskType: string;
    title: string;
    isRequired: boolean;
    status: string;
}

export function BP_demo(): Blueprint[] {
    return [
        {
            id: '1',
            parentIds: [],
            taskType: 'ADD_PATIENT_INFO',
            title: 'Task 1',
            isRequired: true,
            status: 'SUCCESS',
        },
        {
            id: '2',
            parentIds: ['1'],
            taskType: 'ACTIVATE_TRACK',
            title: 'Task 2',
            isRequired: true,
            status: 'SUCCESS',
        },
        {
            id: '3',
            parentIds: ['1', '2'],
            taskType: 'CHECK_TIME',
            title: 'Task 3',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '4',
            parentIds: ['3'],
            taskType: 'CHECK_TIME',
            title: 'Task 4',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '5',
            parentIds: ['4'],
            taskType: 'CHECK_TIME',
            title: 'Task 5',
            isRequired: true,
            status: 'PENDING',
        },
    ];
}

export function stroke1(): Blueprint[] {
    return [
        {
            id: '1',
            parentIds: [],
            taskType: 'ADD_PATIENT_INFO',
            title: 'Task 1',
            isRequired: true,
            status: 'SUCCESS',
        },
        {
            id: '2',
            parentIds: ['1'],
            taskType: 'ACTIVATE_TRACK',
            title: 'Task 2',
            isRequired: true,
            status: 'SUCCESS',
        },
        {
            id: '3',
            parentIds: ['1', '2'],
            taskType: 'CHECK_TIME',
            title: 'Task 3',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '4',
            parentIds: ['3'],
            taskType: 'CHECK_TIME',
            title: 'Task 4',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '5',
            parentIds: ['4'],
            taskType: 'CHECK_TIME',
            title: 'Task 5',
            isRequired: true,
            status: 'PENDING',
        },
    ];
}
