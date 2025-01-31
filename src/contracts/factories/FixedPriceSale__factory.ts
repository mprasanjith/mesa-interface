/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'

import type { FixedPriceSale } from '../FixedPriceSale'

export class FixedPriceSale__factory {
  static connect(address: string, signerOrProvider: Signer | Provider): FixedPriceSale {
    return new Contract(address, _abi, signerOrProvider) as FixedPriceSale
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'NewCommitment',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'NewTokenRelease',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'NewTokenWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'SaleClosed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IERC20',
        name: 'tokenIn',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'contract IERC20',
        name: 'tokenOut',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokensForSale',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startDate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'endDate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'minCommitment',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'maxCommitment',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'minRaise',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'participantList',
        type: 'address',
      },
    ],
    name: 'SaleInitialized',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'ERC20Withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'ETHWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'TEMPLATE_NAME',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'closeSale',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'commitTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'commitment',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isMinRaiseReached',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isSaleEnded',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'remainingTokensForSale',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'saleInfo',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: 'tokenIn',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: 'tokenOut',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'tokensForSale',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'startDate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endDate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minCommitment',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxCommitment',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minRaise',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'hasParticipantList',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'participantList',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'saleStatus',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokensCommitted',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isClosed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'saleSucceeded',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'initialized',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'secondsRemainingInSale',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'withdrawTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
]
