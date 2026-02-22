import React from 'react';
import {render, screen, fireEvent, waitFor} from '../../test.utils'
import SwapHome from '@/components/swap/SwapHome';

// Mock all external dependences
jest.mock('@/config/wagmi', () => ({
    config: {
      chains: [],
      connectors: [],
      transports: {},
    },
    projectId: 'mock-project-id',
}));
jest.mock('wagmi', () => ({
    __esModule: true,
    WagmiProvider: ({ children, config }: any) => <>{children}</>,
    useChainId: jest.fn(),
    useSwitchChain: jest.fn(),
}));

jest.mock('@/config/store', () => ({
    useUpdateSetting: jest.fn(),
}));

jest.mock('@/components/common/NetworkOption', () => {
    return function MockNetworkOption(props: any) {
      return <div data-testid="network-option" {...props}>NetworkOption</div>;
    };
});

const tokenUSD = {chainId: 1, name: 'USD Coin', symbol: 'USDC', alias: 'usdc', decimal: 6, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'}
const tokenETH = {chainId: 1, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'}

jest.mock('@/components/common/TokenOption', () => {
    return function MockTokenOption(props: any) {
      const { curToken, updateToken, onOpenChange } = props;
      return (
        <div data-testid="token-option">
          <span>TokenOption</span>
          {curToken && <span data-testid="selected-token">{curToken.symbol}</span>}
          <button onClick={() => updateToken?.(tokenETH)}>
            Select ETH
          </button>
          <button onClick={() => updateToken?.(tokenUSD)}>
            Select USDC
          </button>
          <button onClick={() => onOpenChange?.(true)}>Open</button>
        </div>
      );
    };
  });

jest.mock('@/components/swap/SwapInput', () => {
    return function MockSwapInput(props: any) {
        const { onChange, amount, hidden } = props;
        if (hidden) return null;
        return (
        <input
            data-testid="swap-input"
            value={amount}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="Amount"
        />
        );
    };
});
  
jest.mock('@/components/swap/Quotes', () => {
    return function MockQuotes(props: any) {
      return <div data-testid="quotes">Quotes Component</div>;
    };
  });
  
jest.mock('@/components/common/Setting', () => {
    return function MockSetting(props: any) {
        return <div data-testid="setting">Setting</div>;
    };
});
  

jest.mock('sonner', () => ({
    toast: {
      warning: jest.fn(),
    },
}));

jest.mock('@/lib/svgs/svg_arrow_updown', () => 'svg-arrow-updown');
jest.mock('@/lib/svgs/svg_left', () => 'svg-left');

import { useChainId, useSwitchChain } from 'wagmi';
import { useUpdateSetting } from '@/config/store';
import { toast } from 'sonner';

const mockUseChainId = useChainId as unknown as jest.Mock;
const mockUseSwitchChain = useSwitchChain as unknown as jest.Mock;
const mockUseUpdateSetting = useUpdateSetting as unknown as jest.Mock;

describe('SwapHome', () => {
    const mockChains = [
        { id: 1, name: 'Ethereum' },
        { id: 137, name: 'Polygon' },
    ];
    const mockSwitchChain = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseChainId.mockReturnValue(1)
        mockUseSwitchChain.mockReturnValue({
            chains: mockChains,
            switchChain: mockSwitchChain,
        });
        mockUseUpdateSetting.mockReturnValue({
            slipage: 0.3,
            deadline: 10,
        });
    })
    
    test('button is disabled initially, enabled after selecting tokens and entering amount', () => {
        render(<SwapHome/>)
        const button = screen.getByRole('button', { name: /get quotes/i });
        expect(button).toBeDisabled(); 

        const ethButtons = screen.getAllByRole('button', { name: /select eth/i });
        const usdcButtons = screen.getAllByRole('button', { name: /select usdc/i });

        // from token
        fireEvent.click(ethButtons[0]);
        expect(button).toBeDisabled();

        fireEvent.click(usdcButtons[1]);
        expect(button).toBeDisabled();

        const input = screen.getByTestId('swap-input');
        fireEvent.change(input, { target: { value: '200' } });
        expect(button).not.toBeDisabled();
    })

    test('clicking Get Quotes navigates to step 2 and renders Quotes component', () => {
        render(<SwapHome />);

        const ethButtons = screen.getAllByRole('button', { name: /select eth/i });
        const usdcButtons = screen.getAllByRole('button', { name: /select usdc/i });

        fireEvent.click(ethButtons[0]);
        fireEvent.click(usdcButtons[1]);

        const input = screen.getByTestId('swap-input');
        fireEvent.change(input, { target: { value: '200' } });

        const button = screen.getByRole('button', { name: /get quotes/i });
        fireEvent.click(button);

        expect(screen.getByTestId('quotes')).toBeInTheDocument();
        expect(screen.queryByTestId('network-option')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /get quotes/i })).not.toBeInTheDocument();
    })


})



