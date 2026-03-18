import { useState, useCallback, useEffect } from "react";
import { BrowserProvider, formatEther } from "ethers";

interface MetaMaskState {
  isInstalled: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  account: string | null;
  balance: string | null;
  chainId: string | null;
  error: string | null;
}

export function useMetaMask() {
  const [state, setState] = useState<MetaMaskState>({
    isInstalled: false,
    isConnected: false,
    isConnecting: false,
    account: null,
    balance: null,
    chainId: null,
    error: null,
  });

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    setState((prev) => ({ ...prev, isInstalled: !!ethereum }));

    if (ethereum) {
      ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setState((prev) => ({
            ...prev,
            isConnected: false,
            account: null,
            balance: null,
          }));
        } else {
          setState((prev) => ({ ...prev, account: accounts[0] }));
          fetchBalance(accounts[0]);
        }
      });

      ethereum.on("chainChanged", (chainId: string) => {
        setState((prev) => ({ ...prev, chainId }));
      });
    }
  }, []);

  const fetchBalance = async (address: string) => {
    try {
      const ethereum = (window as any).ethereum;
      const provider = new BrowserProvider(ethereum);
      const balance = await provider.getBalance(address);
      setState((prev) => ({
        ...prev,
        balance: formatEther(balance),
      }));
    } catch {
      // Silently fail on balance fetch
    }
  };

  const connect = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      setState((prev) => ({
        ...prev,
        error: "MetaMask is not installed. Please install it from metamask.io",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const chainId = await ethereum.request({ method: "eth_chainId" });

      setState((prev) => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        account: accounts[0],
        chainId,
      }));

      await fetchBalance(accounts[0]);
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error:
          err.code === 4001
            ? "Connection rejected. Please approve the connection in MetaMask."
            : "Failed to connect to MetaMask.",
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isConnected: false,
      account: null,
      balance: null,
      chainId: null,
    }));
  }, []);

  return { ...state, connect, disconnect };
}
