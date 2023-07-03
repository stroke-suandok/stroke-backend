export const typeDefs = `#graphql
type TASK {
  id: ID @id
  taskType: String
  title: String
  followedBy: [TASK!]! @relationship(type: "NEXT", direction: OUT)
  precededBy: [TASK!]! @relationship(type: "NEXT", direction: IN)
  inTaskGroup: TASK_GROUP @relationship(type: "IN_TASKGROUP", direction: OUT)
}

type TASK_GROUP {
  id: ID @id
  hasTasks: [TASK!]! @relationship(type: "IN_TASKGROUP", direction: IN)
  hn: String
}
`;
