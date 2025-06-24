// vite.config.ts
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  define: {
    // Expose environment variables to the client
    "process.env.BETTER_AUTH_URL": JSON.stringify(process.env.BETTER_AUTH_URL),
  },
  plugins: [
    tsConfigPaths({
      root: "./",
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      target: "aws_lambda", // https://nitro.build/deploy/providers/aws
      tsr: {
        srcDirectory: "src/webapp",
        routesDirectory: "src/webapp/routes",
        generatedRouteTree: "src/webapp/routeTree.gen.ts",
      },
    }),
  ],
  //   build: {
  //     outDir: "../dist",
  //   },
});
