'use client';

import React, { ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

interface SessionWrapperProps {
  children: ReactNode;
}

export default function SessionWrapper({ children }: SessionWrapperProps) {
  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  );
}
