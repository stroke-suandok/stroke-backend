import { v4 as uuidv4 } from 'uuid';

import { type Blueprint } from './lists';

export function formatBlueprint(blueprint: Blueprint[]) {
    let idArray: string[] = [];
    blueprint.forEach((b) => {
        idArray = [...idArray, b.id, ...b.parentIds];
    });

    const uniqueIdArray = [...new Set(idArray)];

    const uniqueIdArrayMap = uniqueIdArray.map((id) => {
        if (id.length > 6) {
            // This is probably the real id, just use the id
            return { before: id, after: id };
        } else {
            return { before: id, after: uuidv4() };
        }
    });

    const blueprintMap = blueprint.map((b) => {
        const findId = uniqueIdArrayMap.find((n) => n.before === b.id);
        if (!findId) throw new Error('Node not found');
        const idAfter = findId.after;
        const parentIds = b.parentIds.map((p) => {
            const findId = uniqueIdArrayMap.find((n) => n.before === p);
            if (!findId) throw new Error('Node not found');
            return findId.after;
        });

        return {
            ...b,
            id: idAfter,
            parentIds: parentIds,
            childrenIds: b?.childrenIds || [],
        };
    });

    // console.log('-----------------------------------');
    // console.log(blueprintMap);
    // console.log('-----------------------------------');
    return blueprintMap;
}
