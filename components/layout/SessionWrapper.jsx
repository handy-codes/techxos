'use client&apos;;

import React from &apos;react&apos;;
import { RecoilRoot } from &apos;recoil';

export default function SessionWrapper({ children }) {
  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  );
}
