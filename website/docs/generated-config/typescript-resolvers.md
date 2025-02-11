This plugin generates TypeScript signature for `resolve` functions of your GraphQL API.
You can use this plugin a to generate simple resolvers signature based on your GraphQL types, or you can change it's behavior be providing custom model types (mappers).

You can find a blog post explaining the usage of this plugin here: https://the-guild.dev/blog/better-type-safety-for-resolvers-with-graphql-codegen

## Installation



<img alt="typescript-resolvers plugin version" src="https://img.shields.io/npm/v/@graphql-codegen/typescript-resolvers?color=%23e15799&label=plugin&nbsp;version&style=for-the-badge"/>


    
:::shell Using `yarn`
    yarn add -D @graphql-codegen/typescript-resolvers
:::

## API Reference

### `useIndexSignature`

type: `boolean`
default: `false`

Adds an index signature to any generates resolver.

#### Usage Examples

```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
   - typescript-resolvers
 config:
   useIndexSignature: true
```

### `noSchemaStitching`

type: `boolean`
default: `false`

Disables Schema Stitching support.

Note: The default behavior will be reversed in the next major release. Support for Schema Stitching will be disabled by default.

#### Usage Examples

```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
   - typescript-resolvers
 config:
   noSchemaStitching: true
```

### `wrapFieldDefinitions`

type: `boolean`
default: `true`

Set to `true` in order to wrap field definitions with `FieldWrapper`.
This is useful to allow return types such as Promises and functions. Needed for
compatibility with `federation: true` when


### `customResolveInfo`

type: `string`
default: `graphql#GraphQLResolveInfo`

You can provide your custom GraphQLResolveInfo instead of the default one from graphql-js

#### Usage Examples

```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
   - typescript-resolvers
 config:
   customResolveInfo: ./my-types#MyResolveInfo
```

### `customResolverFn`

type: `string`
default: `(parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult`

You can provide your custom ResolveFn instead the default. It has to be a type that uses the generics <TResult, TParent, TContext, TArgs>

#### Usage Examples

##### Custom Signature
```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
   - typescript-resolvers
 config:
   customResolverFn: ./my-types#MyResolveFn
```

##### With Graphile
```yml
generates:
path/to/file.ts:
 plugins:
   - add:
       content: "import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';"
   - typescript
   - typescript-resolvers
 config:
   customResolverFn: |
     (
       parent: TParent,
       args: TArgs,
       context: TContext,
       info: GraphQLResolveInfo & { graphile: GraphileHelpers<TParent> }
     ) => Promise<TResult> | TResult;
```

### `allowParentTypeOverride`

type: `boolean`

Allow you to override the `ParentType` generic in each resolver, by avoid enforcing the base type of the generated generic type.

This will generate `ParentType = Type` instead of `ParentType extends Type = Type` in each resolver.

#### Usage Examples

```yml
  config:
    allowParentTypeOverride: true
```

### `optionalInfoArgument`

type: `boolean`

Sets `info` argument of resolver function to be optional field. Useful for testing.

#### Usage Examples

```yml
  config:
    optionalInfoArgument: true
```

### `addUnderscoreToArgsType`

type: `boolean`

Adds `_` to generated `Args` types in order to avoid duplicate identifiers.

#### Usage Examples

```yml
  config:
    addUnderscoreToArgsType: true
```

### `contextType`

type: `string`

Use this configuration to set a custom type for your `context`, and it will
effect all the resolvers, without the need to override it using generics each time.
If you wish to use an external type and import it from another file, you can use `add` plugin
and add the required `import` statement, or you can use a `module#type` syntax.

#### Usage Examples

##### Custom Context Type
```yml
plugins
  config:
    contextType: MyContext
```

##### Custom Context Type
```yml
plugins
  config:
    contextType: ./my-types#MyContext
```

### `fieldContextTypes`

type: `Array_1`

Use this to set a custom type for a specific field `context`.
It will only affect the targeted resolvers.
You can either use `Field.Path#ContextTypeName` or `Field.Path#ExternalFileName#ContextTypeName`

#### Usage Examples

##### Custom Field Context Types
```
plugins
  config:
    fieldContextTypes:
      - MyType.foo#CustomContextType
      - MyType.bar#./my-file#ContextTypeOne
```

### `rootValueType`

type: `string`

Use this configuration to set a custom type for the `rootValue`, and it will
effect resolvers of all root types (Query, Mutation and Subscription), without the need to override it using generics each time.
If you wish to use an external type and import it from another file, you can use `add` plugin
and add the required `import` statement, or you can use both `module#type` or `module#namespace#type` syntax.

#### Usage Examples

##### Custom RootValue Type
```yml
plugins
  config:
    rootValueType: MyRootValue
```
##### Custom RootValue Type
```yml
plugins
  config:
    rootValueType: ./my-types#MyRootValue
```

### `mapperTypeSuffix`

type: `string`

Adds a suffix to the imported names to prevent name clashes.

#### Usage Examples

```yml
plugins
  config:
    mapperTypeSuffix: Model
```

### `mappers`

type: `object`

Replaces a GraphQL type usage with a custom type, allowing you to return custom object from
your resolvers.
You can use both `module#type` and `module#namespace#type` syntax.

#### Usage Examples

##### Custom Context Type
```yml
plugins
  config:
    mappers:
      User: ./my-models#UserDbObject
      Book: ./my-models#Collections#Book
```

### `defaultMapper`

type: `string`

Allow you to set the default mapper when it's not being override by `mappers` or generics.
You can specify a type name, or specify a string in `module#type` or `module#namespace#type` format.
The default value of mappers it the TypeScript type generated by `typescript` package.

#### Usage Examples

##### Replace with any
```yml
plugins
  config:
    defaultMapper: any
```

##### Custom Base Object
```yml
plugins
  config:
    defaultMapper: ./my-file#BaseObject
```

##### Wrap default types with Partial
You can also specify a custom wrapper for the original type, without overriding the original generated types, use "{T}" to specify the identifier. (for flow, use `$Shape<{T}>`)
```yml
plugins
  config:
    defaultMapper: Partial<{T}>
```

##### Allow deep partial with `utility-types`
```yml
plugins
 plugins:
   - "typescript"
   - "typescript-resolvers"
   - add:
       content: "import { DeepPartial } from 'utility-types';"
 config:
   defaultMapper: DeepPartial<{T}>
```

### `avoidOptionals`

type: `AvoidOptionalsConfig | boolean`
default: `false`

This will cause the generator to avoid using optionals (`?`),
so all field resolvers must be implemented in order to avoid compilation errors.

#### Usage Examples

##### Override all definition types
```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
   - typescript-resolvers
 config:
   avoidOptionals: true
```

##### Override only specific definition types
```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
 config:
   avoidOptionals:
     field: true
     inputValue: true
     object: true
     defaultValue: true
```

### `showUnusedMappers`

type: `boolean`
default: `true`

Warns about unused mappers.

#### Usage Examples

```yml
generates:
path/to/file.ts:
 plugins:
   - typescript
   - typescript-resolvers
 config:
   showUnusedMappers: true
```

### `enumValues`

type: `EnumValuesMap`

Overrides the default value of enum values declared in your GraphQL schema, supported
in this plugin because of the need for integration with `typescript` package.
See documentation under `typescript` plugin for more information and examples.


### `resolverTypeWrapperSignature`

type: `string`
default: `Promise<T> | T`

Allow you to override `resolverTypeWrapper` definition.


### `federation`

type: `boolean`
default: `false`

Supports Apollo Federation


### `enumPrefix`

type: `boolean`
default: `true`

Allow you to disable prefixing for generated enums, works in combination with `typesPrefix`.

#### Usage Examples

##### Disable enum prefixes
```yml
  config:
    typesPrefix: I
    enumPrefix: false
```

### `optionalResolveType`

type: `boolean`
default: `false`

Sets the `__resolveType` field as optional field.


### `immutableTypes`

type: `boolean`
default: `false`

Generates immutable types by adding `readonly` to properties and uses `ReadonlyArray`.


### `namespacedImportName`

type: `string`
default: `''`

Prefixes all GraphQL related generated types with that value, as namespaces import.
You can use this featuere to allow seperation of plugins to different files.


### `resolverTypeSuffix`

type: `string`
default: `Resolvers`

Suffix we add to each generated type resolver.


### `allResolversTypeName`

type: `string`
default: `Resolvers`

The type name to use when exporting all resolvers signature as unified type.


### `internalResolversPrefix`

type: `string`
default: `'__'`

Defines the prefix value used for `__resolveType` and and `__isTypeOf` resolvers.
If you are using `mercurius-js`, please set this field to empty string for better compatiblity.


### `onlyResolveTypeForInterfaces`

type: `boolean`
default: `false`

Turning this flag to `true` will generate resolver siganture that has only `resolveType` for interfaces, forcing developers to write inherited type resolvers in the type itself.


### `strictScalars`

type: `boolean`
default: `false`

Makes scalars strict.

If scalars are found in the schema that are not defined in `scalars`
an error will be thrown during codegen.

#### Usage Examples

```yml
config:
  strictScalars: true
```

### `defaultScalarType`

type: `string`
default: `any`

Allows you to override the type that unknown scalars will have.

#### Usage Examples

```yml
config:
  defaultScalarType: unknown
```

### `scalars`

type: `ScalarsMap`

Extends or overrides the built-in scalars and custom GraphQL scalars to a custom type.


### `namingConvention`

type: `NamingConvention`
default: `change-case-all#pascalCase`

Allow you to override the naming convention of the output.
You can either override all namings, or specify an object with specific custom naming convention per output.
The format of the converter must be a valid `module#method`.
Allowed values for specific output are: `typeNames`, `enumValues`.
You can also use "keep" to keep all GraphQL names as-is.
Additionally you can set `transformUnderscore` to `true` if you want to override the default behavior,
which is to preserves underscores.

Available case functions in `change-case-all` are `camelCase`, `capitalCase`, `constantCase`, `dotCase`, `headerCase`, `noCase`, `paramCase`, `pascalCase`, `pathCase`, `sentenceCase`, `snakeCase`, `lowerCase`, `localeLowerCase`, `lowerCaseFirst`, `spongeCase`, `titleCase`, `upperCase`, `localeUpperCase` and `upperCaseFirst`
[See more](https://github.com/btxtiger/change-case-all)


### `typesPrefix`

type: `string`
default: ``

Prefixes all the generated types.

#### Usage Examples

```yml
config:
  typesPrefix: I
```

### `typesSuffix`

type: `string`
default: ``

Suffixes all the generated types.

#### Usage Examples

```yml
config:
  typesSuffix: I
```

### `skipTypename`

type: `boolean`
default: `false`

Does not add __typename to the generated types, unless it was specified in the selection set.

#### Usage Examples

```yml
config:
  skipTypename: true
```

### `nonOptionalTypename`

type: `boolean`
default: `false`

Automatically adds `__typename` field to the generated types, even when they are not specified
in the selection set, and makes it non-optional

#### Usage Examples

```yml
config:
  nonOptionalTypename: true
```

### `useTypeImports`

type: `boolean`
default: `false`

Will use `import type {}` rather than `import {}` when importing only types. This gives
compatibility with TypeScript's "importsNotUsedAsValues": "error" option
