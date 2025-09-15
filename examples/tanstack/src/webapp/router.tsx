// src/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import * as TanstackQuery from '~/integrations/tanstack-query/root-provider'
import { dehydrate as rqDehydrate, hydrate as rqHydrate } from '@tanstack/react-query'

export function createRouter() {
  // Create per-request clients to avoid cross-request leakage on the server
  const { queryClient, trpcClient, serverHelpers } = TanstackQuery.createClients()

  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
      trpc: serverHelpers,
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Dehydrate/hydrate React Query for SSR
    dehydrate: () => ({
      queryClientState: rqDehydrate(queryClient),
    }),
    hydrate: (dehydrated: any) => {
      if (dehydrated?.queryClientState) {
        rqHydrate(queryClient, dehydrated.queryClientState)
      }
    },
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanstackQuery.Provider queryClient={queryClient} trpcClient={trpcClient}>
          {props.children}
        </TanstackQuery.Provider>
      )
    },
  })

  return router as any
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}