import { FastifyInstance } from 'fastify';

import { createTask } from '../tasks/services';
import { Blueprint, stroke1, stroke2, stroke3 } from './lists';
import { type CreateBlueprintReq } from './types';
import { formatBlueprint } from './utils';

export async function createBlueprint(
    fastify: FastifyInstance,
    body: CreateBlueprintReq,
) {
    let bps: Blueprint[];

    switch (body.blueprintType) {
        case 'stroke11':
            bps = formatBlueprint(stroke1()); //Another function.
            break;
        case 'stroke2':
            bps = formatBlueprint(stroke2()); //Another function.
            break;
        case 'stroke3':
            bps = formatBlueprint(stroke3()); //Another function.
            break;
    default:
        throw fastify.httpErrors.badRequest('Invalid blueprint type');
    }

    for await (const b of bps) {
        await createTask(fastify, { ...b, taskGroupId: body.taskGroupId });
    }

    return { success: true };
}