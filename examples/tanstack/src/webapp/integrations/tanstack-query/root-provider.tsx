import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import superjson from 'superjson'
import { createTRPCClient, httpLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import { TRPCProvider } from '~/integrations/trpc/react'

import type { TRPCRouter } from '~/integrations/trpc/router'

function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') {
      // Client-side: use current window location
      return window.location.origin
    }
    // Server-side: use environment variables
    return process.env.BETTER_AUTH_URL || 
           process.env.VITE_BETTER_AUTH_URL || 
           `http://localhost:${process.env.PORT ?? 3000}`
  })()
  return `${base}/api/trpc`
}

function makeTrpcClient() {
  return createTRPCClient<TRPCRouter>({
  links: [
    httpLink({
      url: getUrl(),
      transformer: superjson,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
          headers: {
            ...options?.headers,
            'Content-Type': 'application/json',
          },
        })
      },
    }),
  ],
  })
}

function makeQueryClient() {
  return new QueryClient({
  defaultOptions: {
    dehydrate: { serializeData: superjson.serialize },
    hydrate: { deserializeData: superjson.deserialize },
    queries: {
      // Add retry logic for production
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.data?.httpStatus >= 400 && error?.data?.httpStatus < 500) {
          return false
        }
        return failureCount < 3
      },
    },
  },
  })
}

export function createClients() {
  const queryClient = makeQueryClient()
  const trpcClient = makeTrpcClient()
  const serverHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient: queryClient,
  })
  return { queryClient, trpcClient, serverHelpers }
}

export function Provider({ children, queryClient, trpcClient }: { children: React.ReactNode, queryClient: QueryClient, trpcClient: ReturnType<typeof makeTrpcClient> }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}