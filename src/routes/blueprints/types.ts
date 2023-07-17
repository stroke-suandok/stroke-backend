import { Static, Type } from '@sinclair/typebox';

export const CreateBlueprintReq = Type.Object({
    blueprintType: Type.Optional(Type.String()),
    taskGroupId: Type.String(),
});
export type CreateBlueprintReq = Static<typeof CreateBlueprintReq>;
