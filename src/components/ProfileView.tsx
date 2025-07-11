'use client';

import { useEffect, useState } from 'react';
import type { User } from '@prisma/client';

export default function ProfileView({ userId }: {
  userId: number;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/user?id=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch user');

        const data: User = await res.json();
        setUser(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message || 'Unknown error');
        else setError('Unknown error');
      }
    }

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Major: {user.major}</p>
      <p>Minor: {user.minor || 'N/A'}</p>
      <p>Quote: {user.quote}</p>
    </div>
  );
}