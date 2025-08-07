import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { getAvatar, getUserID } from '~/lib/auth-server-func'
import { signOut } from '~/lib/auth-client';
import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from '~/integrations/trpc/react';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  beforeLoad: async () => {
    const userID = await getUserID()
        return {
      userID,
    };
  },
   loader: async ({ context }) => {
    console.log('Dashboard loader context:', context);
    if (!context.userID) {
      throw redirect({ to: "/" });
    }
    return {
      userID: context.userID,
    };
  },
})

function RouteComponent() {
  const { userID } = Route.useLoaderData()
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchAvatar = async () => {
      const avatar = await getAvatar();
      setAvatar(avatar ?? undefined);
    };
    fetchAvatar();
  }, []);

  const { data: userName } = useQuery({
    queryKey: ['name'],
    queryFn: () => fetch('/api/name').then(res => res.json()),
  })

  const trpc = useTRPC();
  const { data: userNameFromTRPC } = useQuery({
    ...trpc.people.currentUserName.queryOptions(),
  });

  return (
    <>
      <div>User ID: {userID}</div>
      {avatar && <img src={avatar} alt="User Avatar" style={{ width: 48, height: 48, borderRadius: '50%' }} />}
      <br />
         <strong>Name from useQuery:</strong> {userName?.name || 'Loading...'}
      <br />
         <strong>Name from TRPC:</strong> {userNameFromTRPC || 'Loading...'}
      <br />
      <button
        type="button"
        onClick={async () =>
          signOut({}, { onSuccess: () => { navigate({ to: '/' }) } })
        }
      >
        Sign Out
      </button>
     
    </>

  )
}
