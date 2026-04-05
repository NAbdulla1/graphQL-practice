import { createSchema } from 'graphql-yoga'
import { resolvers } from './schema/resolvers.generated'
import { typeDefs } from './schema/typeDefs.generated'
import { urlDirective } from './schema/directives/urlDirective'

const executableSchema = createSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefs]
})

export const schema = urlDirective(executableSchema)
