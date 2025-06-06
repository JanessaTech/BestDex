'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { 
    RainbowKitProvider, 
    darkTheme,
    RainbowKitAuthenticationProvider,
    type AuthenticationStatus} from '@rainbow-me/rainbowkit';

import { config } from '../config/wagmi';
import { useEffect, useMemo, useState } from 'react';
import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit';
import { createSiweMessage } from 'viem/siwe';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>('loading')

  useEffect(() => {
    if (typeof window !== undefined) {
      const auth = (localStorage.getItem('auth') || 'unauthenticated') as AuthenticationStatus
      setAuthStatus(auth)
    }
  }, [authStatus])

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
        console.log('verify .................')
        try {
          const response = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, signature }),
          });

          const authenticated = Boolean(response.ok);

          if (authenticated) {
            const  auth = authenticated ? 'authenticated' : 'unauthenticated'
            setAuthStatus(auth);
            localStorage.setItem('auth', auth)
          }

          return authenticated;
        } catch (error) {
          console.error('Error verifying signature', error);
          return false;
        }
      },

      signOut: async () => {
        await fetch('/api/logout');
        setAuthStatus('unauthenticated');
        localStorage.setItem('auth', 'unauthenticated')
      },
    });
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider
        adapter={authAdapter}
        status={authStatus}
        >
          <RainbowKitProvider 
            theme={darkTheme()} 
            modalSize="compact">
            {children}
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}