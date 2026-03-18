import { useState } from "react";
import {
  Wallet as WalletIcon,
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  Shield,
  Zap,
  ArrowUpRight,
  Unplug,
} from "lucide-react";
import { useMetaMask } from "@/hooks/useMetaMask";
import { cn } from "@/lib/utils";

const CHAIN_NAMES: Record<string, string> = {
  "0x1": "Ethereum Mainnet",
  "0x5": "Goerli Testnet",
  "0xaa36a7": "Sepolia Testnet",
  "0x89": "Polygon Mainnet",
  "0xa86a": "Avalanche",
  "0xa4b1": "Arbitrum One",
};

const CHAIN_COLORS: Record<string, string> = {
  "0x1": "from-blue-500 to-indigo-600",
  "0x89": "from-purple-500 to-violet-600",
  "0xaa36a7": "from-amber-500 to-orange-600",
  "0x5": "from-cyan-500 to-teal-600",
};

function MetaMaskIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M32.9582 1L19.8241 10.7183L22.2665 4.99099L32.9582 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.04858 1L15.0707 10.8094L12.7337 4.99099L2.04858 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28.2292 23.5334L24.7346 29.1333L32.2173 31.1999L34.3582 23.6533L28.2292 23.5334Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0.655273 23.6533L2.78291 31.1999L10.2656 29.1333L6.77093 23.5334L0.655273 23.6533Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.91174 14.5149L7.83203 17.6817L15.2126 18.0284L14.9583 10.0684L9.91174 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25.0883 14.5149L19.9609 9.97754L19.8242 18.0284L27.1681 17.6817L25.0883 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.2656 29.1333L14.7561 26.9333L10.8961 23.7067L10.2656 29.1333Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.2437 26.9333L24.7342 29.1333L24.1037 23.7067L20.2437 26.9333Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
          <Icon className="size-6 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

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

  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          My Wallet
        </h1>
        <p className="mt-2 text-muted-foreground">
          Connect your wallet to view balances and manage your crypto assets
        </p>
      </div>

      {/* Main Card */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl shadow-black/5">
        {!isInstalled ? (
          <div className="p-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-xl" />
                <div className="relative rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-5">
                  <AlertTriangle className="size-10 text-amber-500" />
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-foreground">MetaMask Required</h2>
              <p className="mb-8 max-w-md text-muted-foreground">
                To connect your wallet and manage your crypto assets, you need to install the MetaMask browser extension.
              </p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 h-12 bg-gradient-to-r from-metamask to-amber-500 px-8 text-white rounded-lg shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 font-medium"
              >
                <MetaMaskIcon className="size-6" />
                Install MetaMask
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        ) : !isConnected ? (
          <div className="p-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-xl" />
                <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 p-5">
                  <WalletIcon className="size-10 text-primary" />
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-foreground">Connect Your Wallet</h2>
              <p className="mb-8 max-w-md text-muted-foreground">
                Connect your MetaMask wallet to view your balances, track your portfolio, and interact with the blockchain.
              </p>
              {error && (
                <p className="mb-4 text-sm text-negative bg-negative/10 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}
              <button
                onClick={connect}
                disabled={isConnecting}
                className="inline-flex items-center gap-3 h-12 bg-gradient-to-r from-metamask to-amber-500 px-8 text-white rounded-lg shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 font-medium disabled:opacity-70"
              >
                {isConnecting ? (
                  <>
                    <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <MetaMaskIcon className="size-6" />
                    Connect MetaMask
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            {/* Connected Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-positive/30 blur-md" />
                  <div className="relative rounded-full bg-positive/10 p-3">
                    <CheckCircle className="size-6 text-positive" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Wallet Connected</h2>
                  <p className="text-sm text-muted-foreground">
                    Your MetaMask wallet is successfully connected
                  </p>
                </div>
              </div>
              <button
                onClick={disconnect}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Unplug className="size-4" />
                Disconnect
              </button>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="group overflow-hidden rounded-xl border border-border/50 bg-secondary/30 p-5 transition-all duration-200 hover:border-primary/30">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Wallet Address
                </p>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-lg text-foreground">
                    {account ? truncateAddress(account) : ""}
                  </span>
                  <button
                    onClick={copyAddress}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                      copied
                        ? "bg-positive/10 text-positive"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="size-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Network */}
              <div className="overflow-hidden rounded-xl border border-border/50 bg-secondary/30 p-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Network
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "size-3 rounded-full bg-gradient-to-r",
                      chainId
                        ? CHAIN_COLORS[chainId] || "from-gray-500 to-gray-600"
                        : "from-gray-500 to-gray-600"
                    )}
                  />
                  <span className="text-lg font-semibold text-foreground">
                    {chainId ? CHAIN_NAMES[chainId] || `Chain ID: ${chainId}` : "Unknown"}
                  </span>
                </div>
              </div>

              {/* Balance */}
              <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-6">
                <div className="absolute right-4 top-4 opacity-10">
                  <svg width="80" height="80" viewBox="0 0 80 80" className="text-primary">
                    <path fill="currentColor" d="M40 0l40 40-40 40L0 40z" />
                  </svg>
                </div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  ETH Balance
                </p>
                <p className="font-mono text-4xl font-bold tracking-tight text-foreground">
                  {balance ? parseFloat(balance).toFixed(4) : "0.0000"}{" "}
                  <span className="text-xl text-muted-foreground">ETH</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            {account && (
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-secondary/50 px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-secondary"
                >
                  View on Etherscan
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Features Section */}
      {!isConnected && (
        <div className="grid gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={Shield}
            title="Secure"
            description="Your keys, your crypto. We never store your private keys."
          />
          <FeatureCard
            icon={Zap}
            title="Fast"
            description="Connect instantly and start tracking your assets."
          />
          <FeatureCard
            icon={WalletIcon}
            title="Multi-chain"
            description="Support for Ethereum, Polygon, and more networks."
          />
        </div>
      )}
    </div>
  );
}
