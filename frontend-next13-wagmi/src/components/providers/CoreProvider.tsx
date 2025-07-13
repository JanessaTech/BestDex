'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { 
    RainbowKitProvider, 
    darkTheme,
    Theme} from '@rainbow-me/rainbowkit';
import { config } from '@/config/wagmi';
import merge from 'lodash.merge';
import AuthenticationProvider from './AuthenticationProvider';

const myTheme =  merge(darkTheme(), {
  colors: {
    accentColor: '#db2777',
    connectButtonBackground: '#db2777'
  },
} as Theme);


const queryClient = new QueryClient();

export function CoreProvider({ children }: { children: React.ReactNode }) {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthenticationProvider>
          <RainbowKitProvider 
              theme={myTheme} 
              modalSize="compact">
              {children}
            </RainbowKitProvider>
        </AuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}