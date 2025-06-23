// src/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { routeTree } from './routeTree.gen'
import * as TanstackQuery from '~/integrations/tanstack-query/root-provider'

export function createRouter() {
  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
         context: {
        ...TanstackQuery.getContext(),
      },
      scrollRestoration: true,
         defaultPreloadStaleTime: 0,
       Wrap: (props: { children: React.ReactNode }) => {
        return <TanstackQuery.Provider>{props.children}</TanstackQuery.Provider>
      },
    }),
    TanstackQuery.getContext().queryClient,
  )

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}