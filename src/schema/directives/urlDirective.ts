import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLSchema, defaultFieldResolver, GraphQLError } from 'graphql';

export function urlDirective(schema: GraphQLSchema, directiveName = 'url') {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            // Find arguments with the @url directive
            const argsWithDirective = Object.entries(fieldConfig.args || {}).filter(
                ([_argName, argConfig]) => getDirective(schema, argConfig, directiveName)?.[0]
            );

            if (argsWithDirective.length > 0) {
                const { resolve = defaultFieldResolver } = fieldConfig;

                fieldConfig.resolve = async function (source, args, context, info) {
                    for (const [argName] of argsWithDirective) {
                        const value = args[argName];
                        if (value && typeof value === 'string') {
                            try {
                                new URL(value);
                            } catch (e) {
                                throw new GraphQLError(`Invalid URL provided for argument \`${argName}\`: ${value}`);
                            }
                        }
                    }
                    return resolve(source, args, context, info);
                };
                return fieldConfig;
            }
        }
    });
}
