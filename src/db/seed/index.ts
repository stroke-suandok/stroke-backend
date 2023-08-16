import { fastify } from 'fastify';
import fastifyBcrypt from 'fastify-bcrypt';

import { type Patient } from '../../routes/patients/types';
import { type TaskGroup } from '../../routes/taskgroups/types';
import { getApolloServer } from './apollo';
import {
    queryPatients,
    queryUsers,
    seedCreateUsers,
    seedPatients,
} from './seedAccounts';
import { seedBlueprint } from './seedBlueprints';
import { queryTaskGroups, seedTaskgroups } from './seedTaskgroups';
import { type SingleGraphQLResponse } from './utils';

async function main() {
    // Create a password hash
    const app = fastify();
    app.register(fastifyBcrypt);
    await app.ready();
    const password = await app.bcrypt.hash('1234');

    const { apollo, driver } = await getApolloServer();

    await driver.executeQuery('MATCH (n) DETACH DELETE n');
    console.log('Clear all data in database');

    try {
        // User
        console.log('Create user');
        let resultMutateUser = await apollo.executeOperation(
            seedCreateUsers(password),
        );
        console.log(JSON.stringify(resultMutateUser));
        const resultQueryUser = await apollo.executeOperation(queryUsers());
        console.log(JSON.stringify(resultQueryUser.body));
        console.log('------------------done-------------------\n\n\n\n');

        // Patient
        console.log('Create patient');
        let resultMutatePatent = await apollo.executeOperation(seedPatients());
        console.log(JSON.stringify(resultMutatePatent));
        const resultQueryPatient = (await apollo.executeOperation(
            queryPatients(),
        )) as SingleGraphQLResponse<{ patients: Patient[] }>;
        console.log(JSON.stringify(resultQueryPatient.body));
        console.log('------------------done-------------------\n\n\n\n');

        //  Taskgroups
        console.log('Create taskgroups');
        const patients = resultQueryPatient.body.singleResult.data.patients;
        const resultMutateTaskgroups = await apollo.executeOperation(
            seedTaskgroups(patients),
        );
        console.log(JSON.stringify(resultMutateTaskgroups));
        const resultQueryTaskgroups = (await apollo.executeOperation(
            queryTaskGroups(),
        )) as SingleGraphQLResponse<{ taskGroups: TaskGroup[] }>;
        const taskgroups =
            resultQueryTaskgroups.body.singleResult.data.taskGroups;
        console.log(taskgroups);
        console.log('------------------done-------------------\n\n\n\n');

        //  Blueprint
        console.log('Create blueprint');
        const resultMutateBlueprint = (await apollo.executeOperation(
            seedBlueprint(taskgroups),
        )) as SingleGraphQLResponse<{ blueprint: TaskGroup[] }>;
        console.log(
            JSON.stringify(resultMutateBlueprint.body.singleResult, null, 2),
        );
        console.log('------------------done-------------------\n\n\n\n');
    } catch (err) {
        console.log(err);
    }

    process.exit(0);
}

main();
