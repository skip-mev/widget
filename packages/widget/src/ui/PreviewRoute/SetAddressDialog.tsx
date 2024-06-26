import { fromBech32 } from '@cosmjs/encoding';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Chain } from '@skip-go/core';
import { PublicKey } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import { FaKeyboard } from 'react-icons/fa';
import { MdCheck, MdClose } from 'react-icons/md';
import { isAddress } from 'viem';

import { WalletListItem } from '../WalletModal/WalletListItem';
import { ChainAddresses, SetChainAddressesParam } from './types';
import { useMakeWallets } from '../../hooks/use-make-wallets';
import { TrackWalletCtx } from '../../store/track-wallet';
import { Dialog } from '../Dialog/Dialog';
import { DialogContent } from '../Dialog/DialogContent';
import { cn } from '../../utils/ui';
import { useSwapWidgetUIStore } from '../../store/swap-widget';
import { css } from '@emotion/css';

export const SetAddressDialog = ({
  open,
  onOpen,
  chain,
  index,
  signRequired,
  isDestination,
  chainAddresses,
  setChainAddresses,
}: {
  open: boolean;
  onOpen: (v: boolean) => void;
  chain: Chain;
  index: number;
  signRequired: boolean;
  isDestination: boolean;
  chainAddresses: ChainAddresses;
  setChainAddresses: (v: SetChainAddressesParam) => void;
}) => {
  const { chainType, chainID, bech32Prefix } = chain;
  const { makeWallets } = useMakeWallets();
  const wallets = makeWallets(chainID);

  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const currentChainAddress = chainAddresses[index];

  const validateAddress = (address: string) => {
    if (chainType === 'cosmos') {
      try {
        const { prefix } = fromBech32(address);

        return bech32Prefix === prefix;
      } catch {
        return false;
      }
    }
    if (chainType === 'evm') {
      try {
        return isAddress(address);
      } catch (error) {
        return false;
      }
    }
    if (chainType === 'svm') {
      try {
        const pk = new PublicKey(address);
        return PublicKey.isOnCurve(pk);
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  const placeholder = useMemo(() => {
    if (chainType === 'cosmos') {
      return `${bech32Prefix}1...`;
    }
    if (chainType === 'evm') {
      return '0x...';
    }
    if (chainType === 'svm') {
      return 'Enter solanma address...';
    }
    return 'Enter address...';
  }, [chainType, bech32Prefix]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isValid = useMemo(() => validateAddress(address), [address]);

  const save = () => {
    setChainAddresses({
      index,
      chainID,
      chainType: chain?.chainType as TrackWalletCtx,
      address,
      source: 'input',
    });
    setIsEditing(false);
    onOpen(false);
  };

  const cancel = () => {
    setAddress(chainAddresses[index]?.address || '');
    setIsEditing(false);
  };
  return (
    <Dialog onOpenChange={(v) => onOpen(v)} open={open} key={chainID}>
      <DialogContent>
        <div className="flex h-full flex-col px-6 pb-2 pt-6 font-jost">
          <div className="relative flex justify-between">
            <button
              className={cn(
                'flex h-8 w-8 items-center justify-between rounded-full transition-colors hover:bg-neutral-100'
              )}
              onClick={() => onOpen(false)}
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <p className="text-center text-xl font-bold capitalize">
              Set {isDestination ? 'Destination' : 'Recovery'} Address
            </p>
            <img
              className="object-contain"
              src={chain.logoURI || 'https://api.dicebear.com/6.x/shapes/svg'}
              alt={chain.chainName}
              height={28}
              width={28}
            />
          </div>

          <ScrollArea.Root
            className={cn(
              'relative isolate flex-grow overflow-hidden',
              'before:absolute before:inset-x-0 before:bottom-0 before:z-10 before:h-2',
              'before:bg-gradient-to-t before:from-white before:to-transparent'
            )}
          >
            <ScrollArea.Viewport className="h-full w-full py-4">
              {chainType &&
                wallets.map((wallet) => {
                  // currently only svm chainType that have isAvailable
                  return (
                    <WalletListItem
                      key={wallet.walletName}
                      chainType={chainType}
                      walletName={wallet.walletName}
                      className={cn(
                        'group relative mb-2 data-[unsupported=true]:opacity-30',
                        'data-[unsupported=true]:before:absolute data-[unsupported=true]:before:inset-0 data-[unsupported=true]:before:cursor-not-allowed'
                      )}
                    >
                      <button
                        className={cn(
                          'flex w-full items-center gap-2 rounded-lg p-2 transition-colors focus:-outline-offset-2',
                          `group-hover:opacity-90`
                          // currentChainAddress &&
                          //   currentChainAddress.source !== 'input' &&
                          //   currentChainAddress.source?.walletName ===
                          //     wallet.walletName &&
                          //   css`
                          //     border: 1px solid
                          //       ${useSwapWidgetUIStore.getState().colors
                          //         .primary};
                          //   `
                        )}
                        onClick={async () => {
                          const resAddress = await wallet.getAddress?.({
                            signRequired,
                            context: isDestination ? 'destination' : 'recovery',
                          });
                          if (resAddress) {
                            setAddress(resAddress);
                            onOpen(false);
                            setChainAddresses({
                              index,
                              chainID,
                              chainType: chain?.chainType as TrackWalletCtx,
                              address: resAddress,
                              source: wallet,
                            });
                          }
                        }}
                        disabled={
                          chainType === 'svm' && wallet.isAvailable !== true
                        }
                      >
                        {wallet.walletInfo.logo && (
                          <img
                            height={36}
                            width={36}
                            alt={wallet.walletPrettyName}
                            className="h-9 w-9 object-contain"
                            src={
                              typeof wallet.walletInfo.logo === 'string'
                                ? wallet.walletInfo.logo
                                : wallet.walletInfo.logo.major
                            }
                            aria-hidden="true"
                          />
                        )}
                        <p className="flex-1 text-left font-semibold">
                          {wallet.walletPrettyName === 'Leap Cosmos MetaMask'
                            ? 'Metamask (Leap Snap)'
                            : wallet.walletPrettyName}
                        </p>
                      </button>

                      {chainType === 'svm' && wallet.isAvailable !== true && (
                        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-lg bg-[#c2c2c2]/20 px-2.5 py-1 text-xs font-semibold text-[#909090] transition-colors focus:outline-none group-hover:bg-[#c2c2c2]/30">
                          Not Installed
                        </div>
                      )}
                    </WalletListItem>
                  );
                })}
              {!signRequired && (
                <div className="group relative mb-2 data-[unsupported=true]:opacity-30">
                  {isEditing ? (
                    <div className="flex items-center space-x-2 py-2">
                      <input
                        type="text"
                        className={cn(
                          `w-full rounded-md border px-2 py-1 text-black`,
                          !isValid && 'border-red-500'
                        )}
                        placeholder={placeholder}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <button
                        className={cn(
                          'flex w-12 items-center justify-center rounded-md border-2 text-sm text-white',
                          'disabled:cursor-not-allowed disabled:opacity-50',

                          css`
                            border-color: ${useSwapWidgetUIStore.getState()
                              .colors.primary};
                            background-color: ${useSwapWidgetUIStore.getState()
                              .colors.primary};
                          `
                        )}
                        onClick={() => save()}
                        disabled={!isValid}
                      >
                        <MdCheck className="size-6" />
                      </button>
                      <button
                        className={cn(
                          'flex w-12 items-center justify-center rounded-md border-2',
                          css`
                            border-color: ${useSwapWidgetUIStore.getState()
                              .colors.primary};
                            color: ${useSwapWidgetUIStore.getState().colors
                              .primary};
                          `
                        )}
                        onClick={() => cancel()}
                      >
                        <MdClose className="size-6" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg p-2 py-3 transition-colors focus:-outline-offset-2'
                      )}
                    >
                      <FaKeyboard className="mx-[6px] h-[24px] w-[24px] text-neutral-400" />
                      <p className="flex-1 text-left font-semibold">
                        Set Manually
                      </p>
                    </button>
                  )}
                </div>
              )}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              className="z-20 flex touch-none select-none py-4 transition-colors ease-out data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col"
              orientation="vertical"
            >
              <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-neutral-500/50 transition-colors before:absolute before:left-1/2 before:top-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:bg-neutral-500" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Root>
        </div>
      </DialogContent>
    </Dialog>
  );
};
