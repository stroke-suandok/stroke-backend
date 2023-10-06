import { FastifyInstance } from 'fastify';

import { createTask } from '../tasks/services';
import { BP_demo} from './lists';
import { type CreateBlueprintReq } from './types';
import { formatBlueprint } from './utils';

export async function createBlueprint(
    fastify: FastifyInstance,
    body: CreateBlueprintReq,
) {
    const bps = formatBlueprint(BP_demo());

    for await (const b of bps) {
        await createTask(fastify, { ...b, taskGroupId: body.taskGroupId });
    }

    return { success: true };
}

