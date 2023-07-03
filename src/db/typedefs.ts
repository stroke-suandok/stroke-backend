export const typeDefs = `#graphql
type TASK {
  id: ID! @unique
  taskType: String
  title: String
  status: String
  followedBy: [TASK!]! @relationship(type: "NEXT", properties: "NEXT_PROPS", direction: OUT)
  precededBy: [TASK!]! @relationship(type: "NEXT", properties: "NEXT_PROPS", direction: IN)
  inTaskGroup: TASK_GROUP @relationship(type: "IN_TASKGROUP", direction: OUT)
}

type TASK_GROUP {
  id: ID! @unique
  hasTasks: [TASK!]! @relationship(type: "IN_TASKGROUP", direction: IN)
  hn: String
}

interface NEXT_PROPS @relationshipProperties {
    required: Boolean!  @default(value: false)
}

`;
