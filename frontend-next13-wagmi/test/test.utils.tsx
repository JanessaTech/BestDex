import React from "react";
import { render as rtlRender } from '@testing-library/react';
import { WagmiProvider} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/config/wagmi';

jest.mock('@rainbow-me/rainbowkit', () => ({
    RainbowKitProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    darkTheme: () => ({}),
}));

const MockAuthenticationProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const MockContextUtilProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

export function render(ui: React.ReactElement, options = {}) {
    function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <MockAuthenticationProvider>
                <MockContextUtilProvider>
                  {children}
                </MockContextUtilProvider>
            </MockAuthenticationProvider>
          </QueryClientProvider>
        </WagmiProvider>
      );
    }
    return rtlRender(ui, { wrapper: Wrapper, ...options });
  }
  
export * from '@testing-library/react';
