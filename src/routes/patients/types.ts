import { gql } from '@apollo/client';
import { Static, Type } from '@sinclair/typebox';

export const patientFragment = gql`
    fragment PATIENT_FRAGMENT on PATIENT {
        id
        title
        firstName
        lastName
        hospitalNumber
        visitNumber
        admitNumber
        updatedAt
        createdAt
        
    }
`;

// Base type
export const Patient = Type.Object({
    id: Type.String(),
    title: Type.String(),
    firstName: Type.String(),
    lastName: Type.String(),
    hospitalNumber: Type.String(),
    visitNumber: Type.Optional(Type.String()),
    admitNumber: Type.Optional(Type.String()),
    updatedAt: Type.String(),
    createdAt: Type.String(),
});
export type Patient = Static<typeof Patient>;

// Default response
export const GetPatientsRes = Type.Array(Patient);

//  Create patient
export const CreatePatientReq = Type.Omit(Patient, [
    'id',
    'updatedAt',
    'createdAt',
]);
export type CreatePatientReq = Static<typeof CreatePatientReq>;

// Search patient
export const SearchPatientsReq = Type.Pick(Patient, ['hospitalNumber']);
export type SearchPatientsReq = Static<typeof SearchPatientsReq>;

export const SearchTGReq = Type.Object({
    id: Type.String(),
});
export type SearchTGReq = Static<typeof SearchTGReq>;

export const DeletePatientReq = Type.Pick(Patient, ['id']);
export type DeletePatientReq = Static<typeof DeletePatientReq>;