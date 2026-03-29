import { createSchema } from 'graphql-yoga'
import { resolvers } from './schema/resolvers.generated'
import { typeDefs } from './schema/typeDefs.generated'
import { urlDirective } from './schema/directives/urlDirective'
import { constraintDirective, constraintDirectiveTypeDefs } from 'graphql-constraint-directive'

const executableSchema = createSchema({
  resolvers: [resolvers],
  typeDefs: [constraintDirectiveTypeDefs, typeDefs]
})

const constraint = constraintDirective()

export const schema = constraint(urlDirective(executableSchema))
