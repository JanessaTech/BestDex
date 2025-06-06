import { Providers } from "@/components/providers";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
 
  return (
    <div>
      new dex. Janessa, win, win, win
        <Providers>
          <ConnectButton accountStatus='address'/>
        </Providers>
    </div>
  );
}
