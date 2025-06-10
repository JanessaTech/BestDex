'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { setCookie, deleteCookie } from 'cookies-next'
import { 
    RainbowKitProvider, 
    darkTheme,
    Theme,
    RainbowKitAuthenticationProvider} from '@rainbow-me/rainbowkit';

import { useMemo } from 'react';
import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit';
import { createSiweMessage } from 'viem/siwe';
import useAuthState from '@/config/store';
import { config } from '@/config/wagmi';
import merge from 'lodash.merge';

const myTheme =  merge(darkTheme(), {
  colors: {
    accentColor: '#db2777',
    connectButtonBackground: '#db2777'
  },
} as Theme);


const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const {connected, setState, isDone} = useAuthState()

  const authAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        const response = await fetch('/api/nonce');
        return await response.text();
      },

      createMessage: ({ nonce, address, chainId }) => {
        return createSiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to the app.',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
        });
      },

      verify: async ({ message, signature }) => {
        try {
          const response = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, signature }),
          });

          const authenticated = Boolean(response.ok);

          if(authenticated) {
            setState('authenticated')
            let token = 'fake-jwt-token'
            setCookie('token', token, { maxAge: 60 * 60 * 24 })
          }

          return authenticated;
        } catch (error) {
          console.error('Error verifying signature', error);
          return false;
        }
      },

      signOut: async () => {
        await fetch('/api/logout');
        setState('unauthenticated')
        deleteCookie('token')
      },
    });
  }, []);
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider
        adapter={authAdapter}
        status={isDone? connected: 'loading'}
        >
          <RainbowKitProvider 
            theme={myTheme} 
            modalSize="compact">
            {children}
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}