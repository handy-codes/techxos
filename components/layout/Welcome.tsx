'use client';

import { useSession } from 'next-auth/react';
import React from 'react'

const Welcome = () => {
    const { data: session } = useSession();
    console.log(session);
    return (
        session && (
            <div className="">
                <p>Welcome back {session?.user?.name}</p>
            </div>
        )
    );
  }

export default Welcome

