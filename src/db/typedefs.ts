export const typeDefs = `#graphql

enum Role {
  SUPER_ADMIN
  ADMIN
  USER
  }

enum Department {
  ER
  OR
  LAB
  ANY
}

enum TaskType {
  ADD_PATIENT_INFO
  ACTIVATE_TRACK
  CHECK_TIME
  END_PROCESS
}

enum Entry {
  WALKIN
  REFER
}

enum ActType {
  CHECK_TIME
}


type TASK {
  id: ID! @unique
  taskType: TaskType @default(value: CHECK_TIME)
  title: String @default(value: "New Task")
  isRequired: Boolean @default(value: true)
  isCompleted: Boolean @default(value: false)
  groupType: String!
  createdAt: DateTime
  updatedAt: DateTime
  completedAt: DateTime!
  roleAllowed: [Role!]!
  roledisallowed: [Role!]!
  departmentAllowed: [Department!]!
  departmentDisallowed: [Department!]!
  standardTime: Int!
  
  followedBy: [TASK!]! @relationship(type: "NEXT", direction: OUT)
  precededBy: [TASK!]! @relationship(type: "NEXT", direction: IN)
  inTaskGroup: TASK_GROUP @relationship(type: "IN_TASKGROUP", direction: OUT)

  eValue: Int!
  vValue: String!
  mValue: String!
  bloodPressureH: Int!
  bloodPressureL: Int!
  pulse: Int!
}



type TASK_GROUP {
  id: ID! @unique
  hn: String
  titleName: String
  firstName: String
  lastName: String
  entry: Entry
  destination: String

  hasTasks: [TASK!]! @relationship(type: "IN_TASKGROUP", direction: IN)
}


type User {
  id: ID! @unique
  department: Department
  username: String
  password: String
  role: Role @default(value: USER)
  createdAt: DateTime
  updatedAt: DateTime

  acts: [TASK!]! @relationship(type: "ACT", properties: "ACT_PROPS", direction: OUT)
}

interface ACT_PROPS @relationshipProperties {
     actType: ActType @default(value: CHECK_TIME)
}

`;

// export const typeDefs = `#graphql
// type TASK {
//   id: ID! @unique
//   taskType: String
//   title: String
//   status: String
//   followedBy: [TASK!]! @relationship(type: "NEXT", properties: "NEXT_PROPS", direction: OUT)
//   precededBy: [TASK!]! @relationship(type: "NEXT", properties: "NEXT_PROPS", direction: IN)
//   inTaskGroup: TASK_GROUP @relationship(type: "IN_TASKGROUP", direction: OUT)
// }

// type TASK_GROUP {
//   id: ID! @unique
//   hasTasks: [TASK!]! @relationship(type: "IN_TASKGROUP", direction: IN)
//   hn: String
// }

// interface NEXT_PROPS @relationshipProperties {
//     required: Boolean!  @default(value: false)
// }
// `;
