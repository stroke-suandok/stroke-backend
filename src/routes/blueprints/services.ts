import { FastifyInstance } from 'fastify';

import { createTask } from '../tasks/services';
import { BP_demo, Blueprint, stroke1, stroke2 } from './lists';
import { type CreateBlueprintReq } from './types';
import { formatBlueprint } from './utils';

export async function createBlueprint(
    fastify: FastifyInstance,
    body: CreateBlueprintReq,
) {
    let bps: Blueprint[];

    switch (body.blueprintType) {
        case 'demo':
            bps = formatBlueprint(BP_demo());
            break;
        case 'suandok1':
            bps = formatBlueprint(stroke1()); //Another function.
            break;
        case 'suandok2':
        bps = formatBlueprint(stroke2()); //Another function.
        break;
    default:
        throw fastify.httpErrors.badRequest('Invalid blueprint type');
    }

    for await (const b of bps) {
        await createTask(fastify, { ...b, taskGroupId: body.taskGroupId });
    }

    return { success: true };
}