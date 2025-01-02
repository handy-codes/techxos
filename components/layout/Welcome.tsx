'use client';

import React from 'react'
import { useUser } from '@clerk/nextjs';

const Welcome = () => {
  const {user} = useUser();

  const getDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    } else if (user?.username) {
      return user.username.charAt(0).toUpperCase() + user.username.slice(1);
    }
    return '';
  };

  return (
    user && (
      <div className='pl-2 pt-4 flex items-center flex-wrap gap-2 mb-3'>
        <h1 className='text-[#ECEFF1] text-xl sm:text-3xl'>Welcome,</h1>
        <span className='text-[#03FF01] text-2xl sm:text-4xl'>
          {getDisplayName()}
        </span>
      </div>
    )
  )}

export default Welcome