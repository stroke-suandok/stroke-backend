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
            title: 'Create Patient HN',
            isRequired: true,
            status: 'SUCCESS',
        },
        {
            id: '2',
            parentIds: ['1'],
            taskType: 'CHECK_TIME',
            title: 'Meeting an ER Doctor',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '3',
            parentIds: ['2'],
            taskType: 'CHECK_TIME',
            title: 'Start FAST process',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '4',
            parentIds: ['3'],
            taskType: 'CHECK_TIME',
            title: 'Pelvis process',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '5',
            parentIds: ['4'],
            taskType: 'CHECK_TIME',
            title: 'Notify Set OR',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '6',
            parentIds: ['5'],
            taskType: 'CHECK_TIME',
            title: 'OR Arrival',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '7',
            parentIds: ['6'],
            taskType: 'CHECK_TIME',
            title: 'Start Operation',
            isRequired: true,
            status: 'PENDING',
        }
    ];
}
export function stroke2(): Blueprint[] {
    return [
        {
            id: '1',
            parentIds: [],
            taskType: 'ADD_PATIENT_INFO',
            title: 'Create Patient HN',
            isRequired: true,
            status: 'SUCCESS',
        },
        {
            id: '2',
            parentIds: ['1'],
            taskType: 'CHECK_TIME',
            title: 'Meeting an ER Doctor',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '3',
            parentIds: ['2'],
            taskType: 'CHECK_TIME',
            title: 'Start FAST process',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '4',
            parentIds: ['3'],
            taskType: 'CHECK_TIME',
            title: 'CXR process',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '5',
            parentIds: ['4'],
            taskType: 'CHECK_TIME',
            title: 'Notify Set OR',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '6',
            parentIds: ['5'],
            taskType: 'CHECK_TIME',
            title: 'OR Arrival',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '7',
            parentIds: ['6'],
            taskType: 'CHECK_TIME',
            title: 'Start Operation',
            isRequired: true,
            status: 'PENDING',
        }
    ];
}

export function stroke3(): Blueprint[] {
    return [
        {
            id: '1',
            parentIds: [],
            taskType: 'ADD_PATIENT_INFO',
            title: 'Create Patient HN',
            isRequired: true,
            status: 'SUCCESS',
        },
        {
            id: '2',
            parentIds: ['1'],
            taskType: 'CHECK_TIME',
            title: 'Meeting an ER Doctor',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '3',
            parentIds: ['2'],
            taskType: 'CHECK_TIME',
            title: 'Start FAST process',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '4',
            parentIds: ['3'],
            taskType: 'CHECK_TIME',
            title: 'Requesting CT Brain',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '5',
            parentIds: ['4'],
            taskType: 'CHECK_TIME',
            title: 'Transport from ER to CT',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '6',
            parentIds: ['5'],
            taskType: 'CHECK_TIME',
            title: 'Arrival back from CT',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '7',
            parentIds: ['6','5'],
            taskType: 'CHECK_TIME',
            title: 'Meeting Neuro docter',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '8',
            parentIds: ['7'],
            taskType: 'CHECK_TIME',
            title: 'Notify Set OR',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '9',
            parentIds: ['8'],
            taskType: 'CHECK_TIME',
            title: 'OR Arrival',
            isRequired: true,
            status: 'PENDING',
        },
        {
            id: '10',
            parentIds: ['9'],
            taskType: 'CHECK_TIME',
            title: 'Start Operation',
            isRequired: true,
            status: 'PENDING',
        }
    ];
}


