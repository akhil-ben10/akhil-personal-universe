# Akhil — A world of my own

Complete React + JavaScript + Vite export of the current website. All page text, styling, images, the textured GLB model, motion controls, scroll animations, drag interactions, and responsive layouts are preserved.

## Run locally

Use Node.js 22.12+ or a newer supported Node.js LTS version.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite.

## Production build

```sh
npm run build
npm run preview
```

The deployable website is generated in `dist/`.

## Deploy on Vercel

1. Extract this ZIP. Open the `akhil-personal-universe` folder.
2. Upload its contents to your own GitHub repository, keeping `package.json` at the repository root.
3. In Vercel, choose **Add New → Project** and import that repository.
4. Framework preset: **Vite**. Build command: **npm run build**. Output directory: **dist**. Install command: **npm ci**.
5. Choose Node.js 22.12+ / the latest supported LTS in project settings. No environment variables or API keys are required.
6. Deploy. `vercel.json` already supplies the build settings.

Alternatively, from this project folder, run `npx vercel` and follow the CLI prompts, then `npx vercel --prod`.

## Files

- `src/App.jsx`: the complete React page
- `src/main.jsx`: React entry point
- `src/interactions.js`: animations and 3D controls with effect cleanup
- `src/styles.css`: original design and responsive styles
- `src/vendor/model-viewer.min.js`: bundled Google model-viewer
- `public/assets/`: all images, artwork, the textured `akhil-textured.glb`, and the model-viewer license
- `index.html`: page metadata and favicon
- `package.json` and `package-lock.json`: dependencies and reproducible installation
- `vite.config.js`: Vite build configuration
- `vercel.json`: Vercel deployment configuration

This project has no backend, ChatGPT sign-in requirement, Sites runtime dependency, or secret keys. It continues to work when deployed independently. Google Fonts loads the same fonts as the current site; fallback fonts are already defined if it is unavailable. The model-viewer library is bundled locally and its Apache 2.0 license is included.

`node_modules`, build output, source-control internals, and ChatGPT hosting metadata are intentionally excluded from the source ZIP. Running `npm ci` restores dependencies and `npm run build` creates the output.
