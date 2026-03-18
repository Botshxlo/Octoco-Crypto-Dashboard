import { Wallet as WalletIcon, Unplug, ExternalLink } from "lucide-react";
import { useMetaMask } from "@/hooks/useMetaMask";

export default function Wallet() {
  const {
    isInstalled,
    isConnected,
    isConnecting,
    account,
    balance,
    chainId,
    error,
    connect,
    disconnect,
  } = useMetaMask();

  const chainName = (id: string | null) => {
    const chains: Record<string, string> = {
      "0x1": "Ethereum Mainnet",
      "0x5": "Goerli Testnet",
      "0xaa36a7": "Sepolia Testnet",
      "0x89": "Polygon",
      "0xa86a": "Avalanche",
      "0xa4b1": "Arbitrum One",
    };
    return id ? chains[id] || `Chain ${id}` : "Unknown";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">My Wallet</h1>

      {!isInstalled ? (
        <div className="bg-secondary/50 rounded-xl p-8 text-center space-y-4">
          <WalletIcon className="w-12 h-12 mx-auto text-muted-foreground" />
          <h2 className="text-lg font-semibold">MetaMask Not Detected</h2>
          <p className="text-sm text-muted-foreground">
            Install the MetaMask browser extension to connect your wallet.
          </p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#f6851b] hover:bg-[#e2761b] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Install MetaMask
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ) : !isConnected ? (
        <div className="bg-secondary/50 rounded-xl p-8 text-center space-y-4">
          <WalletIcon className="w-12 h-12 mx-auto text-muted-foreground" />
          <h2 className="text-lg font-semibold">Connect Your Wallet</h2>
          <p className="text-sm text-muted-foreground">
            Connect your MetaMask wallet to view your assets.
          </p>
          {error && (
            <p className="text-sm text-negative bg-negative/10 rounded-lg px-4 py-2">
              {error}
            </p>
          )}
          <button
            onClick={connect}
            disabled={isConnecting}
            className="bg-[#f6851b] hover:bg-[#e2761b] disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isConnecting ? "Connecting..." : "Connect MetaMask"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Connected Wallet</h2>
              <button
                onClick={disconnect}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Unplug className="w-4 h-4" />
                Disconnect
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="font-mono text-sm break-all">{account}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Network</p>
                <p className="text-sm">{chainName(chainId)}</p>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="bg-secondary/50 rounded-xl p-6">
            <p className="text-xs text-muted-foreground mb-1">ETH Balance</p>
            <p className="text-3xl font-bold font-mono">
              {balance ? `${parseFloat(balance).toFixed(4)} ETH` : "Loading..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
