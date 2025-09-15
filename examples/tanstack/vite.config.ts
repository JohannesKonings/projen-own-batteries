// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
  },
  define: {
    // Expose environment variables to the client
    "process.env.BETTER_AUTH_URL": JSON.stringify(process.env.BETTER_AUTH_URL),
  },
  plugins: [
    tanstackStart({
      target: "aws_lambda", // https://nitro.build/deploy/providers/aws
      customViteReactPlugin: true,
      // client routing with cloudfront not working
      // spa: {
      //   enabled: true,
      // },
      tsr: {
        srcDirectory: "src/webapp",
        routesDirectory: "src/webapp/routes",
        generatedRouteTree: "src/webapp/routeTree.gen.ts",
      },
    }),
    react(),
    tsConfigPaths({
      root: "./",
      projects: ["./tsconfig.json"],
    }),
  ],
  //   build: {
  //     outDir: "../dist",
  //   },
});
