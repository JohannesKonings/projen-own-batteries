// src/routes/index.tsx
import * as fs from 'node:fs'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { useSession, signIn, signOut } from "~/lib/auth-client"; // Import auth if needed
import { useTRPC } from '~/integrations/trpc/react';
import { useQuery } from '@tanstack/react-query';
import { getHeaders } from '@tanstack/react-start/server';

const filePath = '/tmp/count.txt'



async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, 'utf-8').catch(() => '0'),
  )
}

const getCount = createServerFn({
  method: 'GET',
}).handler(() => {
   console.log('headersjkGET', getHeaders())
  return readCount()
})

const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    console.log('headersjkPOST', getHeaders())
    const count = await readCount()
    await fs.promises.writeFile(filePath, `${count + data}`)
  })

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
})



function Home() {
  const router = useRouter()
  const state = Route.useLoaderData()
  const { data: session } = useSession()

  const trpc = useTRPC();
  const { data: serverPing } = useQuery({
    ...trpc.people.serverPing.queryOptions(),
  });

  console.log('Session data:', session)

  return (
    <>
    <button
      type="button"
      onClick={() => {
        updateCount({ data: 1 }).then(() => {
          router.invalidate()
        })
      }}
    >
      Add 1 to {state}?
    </button>
    <div>
      <p>Current count: {state}</p>
      <p>Server Ping: {serverPing}</p>

      {session ? (
        <div>
          <p>Welcome, {session.user.name}!</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <button onClick={() => signIn.social({ provider: "github" })}>Sign In</button>
      )}
      {session && <Link to="/dashboard">Dashboard</Link>}
    </div>
    </>
  )
}