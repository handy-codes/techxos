'use client';

import React from 'react'
import { useUser } from '@clerk/nextjs';

const Welcome = () => {
  const {user} = useUser();

  return (
    user && (
    <div className='pl-2 pt-4 flex items-center flex-wrap gap-2 mb-3'><h1 className='text-[#ECEFF1] text-xl sm:text-3xl'>Welcome,</h1> <span className='text-[#03FF01] text-2xl sm:text-4xl '>{user?.firstName}</span></div>
    // <div className='px-8 pt-4 flex items-center flex-wrap gap-2'><h1 className='text-[#ECEFF1] text-3xl'>Welcome</h1> <span className='text-[#03FF01] text-4xl'>{user?.firstName}</span></div>
   )
  )
}

export default Welcome