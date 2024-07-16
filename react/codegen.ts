// import { CodegenConfig } from '@graphql-codegen/cli'
//
// const config: CodegenConfig = {
//   schema: 'http://localhost:4000',
//   documents: ['src/**/*.tsx'],
//   ignoreNoDocuments: true, // for better experience with the watcher
//   generates: {
//     './src/gql/': {
//       preset: 'client'
//     }
//   }
// }
//
// export default config


import { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "http://localhost:4000",
  documents: ["./src/queries/**/*.ts"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "src/types.ts": { plugins: ["typescript"] },
    "src/": {
      preset: "near-operation-file",
      presetConfig: {
        extension: "generated.tsx", baseTypesPath: "types.ts"
      },
      config: {
        plugins: ["typescript-operations", "typescript-react-apollo"],
        withHooks: true
      }
    }
  }
}

export default config