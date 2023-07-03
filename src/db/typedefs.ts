export const typeDefs = `#graphql
type TASK {
  id: ID @id
  taskType: String
  title: String
  followedBy: [TASK!]! @relationship(type: "FOLLOWED_BY", direction: OUT)
  precededBy: [TASK!]! @relationship(type: "FOLLOWED_BY", direction: IN)
  inTaskGroup: TASK_GROUP @relationship(type: "IN", direction: OUT)
}

type TASK_GROUP {
  id: ID @id
  hasTasks: [TASK!]! @relationship(type: "IN", direction: IN)
}
`;
