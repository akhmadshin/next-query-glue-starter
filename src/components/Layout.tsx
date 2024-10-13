import { Header } from '@/components/Header';

import React from 'react';
import { ParentComponent } from '@/types/general';


export const Layout: ParentComponent = ({ children }) => {
  return (
    <>
      <Header/>
      <main className="pb-28 pt-14 md:pb-28 md:pt-20">
        {children}
      </main>
    </>
  )
}