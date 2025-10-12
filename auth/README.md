# auth

This is the `auth` microservice for the cinema-ghor project (TypeScript + Express).
This README explains how to clone the repository, install dependencies, run the app in development, build for production, run tests, and set up Visual Studio Code with the Yarn v4 SDKs and the workspace TypeScript version.

## Requirements

- Node.js (recommend >= 18)
- Yarn 4.x (this repo uses Yarn v4; package.json pins `yarn@4.9.2`)
- Git

If you don't have Yarn 4 installed globally you can still use Yarn via Corepack (Node 16.10+ includes Corepack) or run the commands below from the project folder.

## Quickstart — clone, install, run

1. Clone the repository (replace with your repo URL):

```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo/auth
```

2. Install dependencies:

```bash
yarn install
```

3. Run in development (uses `tsx watch`):

```bash
yarn dev
```

This runs the server entry at `src/server.ts` and restarts on file changes.

## Build for production

Compile TypeScript to `./dist`:

```bash
yarn build
```

After a successful build the compiled files will be in `dist/`. Run the compiled server with Node (use a Node version compatible with the compiled target):

```bash
node --enable-source-maps dist/server.js
```

Note: `--enable-source-maps` is useful to get correct stack traces when using generated source maps.

## Tests & linting

- Run tests:

```bash
yarn test
```

- Lint (check):

```bash
yarn lint
```

- Lint and auto-fix:

```bash
yarn lint:fix
```

## Yarn SDKs + VS Code setup (recommended)

This project uses Yarn v4. To enable editor integrations (TypeScript and ESLint) and ensure VS Code uses the workspace TypeScript version, run the Yarn SDK installer from the `auth` directory.

1. From the `auth` folder run:

```bash
yarn dlx @yarnpkg/sdks vscode
```

This command will:

- Install editor SDK shims into `.yarn/sdks/` (for TypeScript, ESLint, etc.).
- Create/update `.vscode/settings.json` to point VS Code at the workspace SDKs (if possible).

2. Open VS Code at the project folder (open the `auth` folder, not only repository root):

```bash
code .
```

3. Make VS Code use the workspace TypeScript version:

- Press Ctrl+Shift+P -> "TypeScript: Select TypeScript Version" -> choose "Use Workspace Version".

Alternatively, add or verify these workspace settings in `.vscode/settings.json` (this is what the SDK installer usually writes):

```json
{
  "typescript.tsdk": ".yarn/sdks/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "eslint.nodePath": ".yarn/sdks/eslint"
}
```

Having `typescript.tsdk` set keeps VS Code's TypeScript language features in sync with the project's TypeScript version and compiler options.

If you prefer the GUI flow: click the TypeScript version in the status bar and select "Use Workspace Version".

## Notes about the TypeScript project

- Root `tsconfig.json` targets `nodenext` and `esnext` and compiles sources from `src/` into `dist/`.
- Compiler options include `declaration: true` and `declarationMap: true` so a build produces type declarations in `dist/`.

## Useful scripts (from package.json)

- `yarn dev` — run in development (watch mode via `tsx`).
- `yarn build` — compile TypeScript into `dist/` using `tsc -p tsconfig.json`.
- `yarn lint` — run ESLint checks.
- `yarn lint:fix` — run ESLint and fix fixable problems.
- `yarn test` — run Jest tests.

## Troubleshooting

- If editor intellisense or types are missing after you run the SDK command, restart VS Code.
- If VS Code still uses the global TypeScript version, open a workspace settings and ensure `typescript.tsdk` is set as shown above and then select "Use Workspace Version".
- If yarn fails due to an incompatible Yarn binary, make sure Corepack is enabled or install Yarn 4.x following the official Yarn docs.

## Contributing

If you make changes, run tests and lint locally before pushing. You can use the same commands defined above.

---

If you want, I can add a ready-made `.vscode/settings.json` to the repo that sets `typescript.tsdk` and ESLint paths. Would you like me to add that file?

# auth
