import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { createPatient, getPatients, searchPatients } from './services';
import { CreatePatientReq, GetPatientsRes, SearchPatientsReq } from './types';

const patients: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.route({
        method: 'GET',

        url: '/',
        schema: {
            description: 'Get all patients',
            tags: ['patients'],
            response: {
                200: GetPatientsRes,
            },
        },
        handler: async function (request, reply) {
            const data = await getPatients(server);
            return data;
        },
    });

    server.route({
        method: 'POST',
        schema: {
            description: 'Create patient',
            tags: ['patients'],
            body: CreatePatientReq,
            response: {
                200: GetPatientsRes,
            },
        },
        url: '/',
        handler: async function (request, reply) {
            const data = await createPatient(server, request.body);
            return data;
        },
    });

    server.route({
        method: 'POST',
        url: '/search',
        schema: {
            description: 'Search patient',
            tags: ['patients'],
            body: SearchPatientsReq,
            response: {
                200: GetPatientsRes,
            },
        },
        handler: async function (request, reply) {
            const data = await searchPatients(server, request.body);
            return data;
        },
    });
};

export default patients;
