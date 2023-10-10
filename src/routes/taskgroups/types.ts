import { Static, Type } from '@sinclair/typebox';

import { gql } from '../../plugins/db/client';
import { Patient } from '../patients/types';
import { patientFragment } from '../patients/types';

export const taskGroupFragment = gql`
    ${patientFragment}
    fragment TASK_GROUP_FRAGMENT on TASK_GROUP {
        id
        destination
        entry
        patient {
            ...PATIENT_FRAGMENT
        }
    }
`;

//  Base type
export const TaskGroup = Type.Object({
    id: Type.String(),
    entry: Type.Optional(Type.String()),
    destination: Type.Optional(Type.String()),
    patient: Patient,
});
export type TaskGroup = Static<typeof TaskGroup>;


// Default response
export const GetTaskGroupRes = Type.Array(TaskGroup);
export const TaskGroups = Type.Array(TaskGroup);
export type TaskGroups = Static<typeof TaskGroups>

// Create taskgroup
export const CreateTaskGroupReq = Type.Object({
    ...Type.Omit(TaskGroup, ['id', 'patient']).properties,
    destination: Type.String(),
    entry: Type.String(),
    ...Type.Pick(Patient,['hospitalNumber', 'firstName', 'lastName', 'title']).properties,
    blueprintType: Type.String()
});
export type CreateTaskGroupReq = Static<typeof CreateTaskGroupReq>;

// Search taskgroups
export const SearchTaskGroupsReq = Type.Pick(TaskGroup, ['id']);
export type SearchTaskGroupsReq = Static<typeof SearchTaskGroupsReq>;
