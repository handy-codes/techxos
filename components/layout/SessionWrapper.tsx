'use client&apos;;

import React, { ReactNode } from &apos;react&apos;;
import { RecoilRoot } from &apos;recoil';

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
