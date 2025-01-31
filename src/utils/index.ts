/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Externals
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import dayjs, { Dayjs } from 'dayjs'

// Interface
import { Sale, SaleType, FairSale, FixedPriceSale, SaleDetails } from 'src/interfaces/Sale'

//svg
import Omen from 'src/assets/svg/Omen.svg'
import Dai from 'src/assets/svg/DAI.svg'
import { BigNumberish, BigNumber } from 'ethers'
import { GetAllBidsBySaleId_fixedPriceSale } from 'src/subgraph/__generated__/GetAllBidsBySaleId'
import { FixedPriceSaleCommitmentStatus } from 'src/subgraph/__generated__/globalTypes'

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string | null): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

/** sums up all the purchases of a single user from a single sale and returns the status, total amount and account string*/
export const aggregatePurchases = (bids: any[], account: string | null | undefined, sale?: any) => {
  const reduceTotalAmount = bids.reduce((accumulator: BigNumber, purchases: any) => {
    return BigNumber.from(accumulator).add(purchases.amount)
  }, BigNumber.from(0))

  return {
    user: {
      address: account!,
    },
    amount: reduceTotalAmount,
    status: bids.length > 0 ? bids[0].status : undefined,
    sale: sale,
  }
}

// helpers
export const getZeros = (decimals: number) => {
  let zeros = '0'
  while (zeros.length < 256) {
    zeros += zeros
  }
  if (decimals >= 0 && decimals <= 256 && !(decimals % 1)) {
    return '1' + zeros.substring(0, decimals)
  }

  throw new Error('invalid decimal')
}

export const fromBigDecimalToBigInt = (input: string, decimal = 18): string => {
  // regex split the string between decimals and exponential
  // reform into BigInt string

  const number = String(input)

  const fraction = number.match(/(?<=\.)(.*)/)

  const whole = number.match(/(.*)(?=\.)/)

  const addedZeros = getZeros(decimal)

  let value = number + addedZeros.slice(number.length)

  if (whole != null) {
    value = whole[1]
  }

  if (fraction != null && whole != null) {
    const zeros = addedZeros.slice(fraction[1].length + 1)
    value = whole[1] + fraction[1] + zeros
  }

  return value
}

export const formatDecimal = (bigDecimal: string, decimal = 18): BigNumber => {
  return BigNumber.from(fromBigDecimalToBigInt(bigDecimal, decimal))
}

// query mocks

const getFairSale = (): FairSale => ({
  id: '0x141',
  createdAt: 1585481341,
  updatedAt: null,
  deletedAt: null,
  status: 'closed',
  startDate: 1585654141,
  endDate: 1617193741,
  tokensForSale: BigNumber.from(5000),
  name: 'Omen',
  tokenIn: {
    id: '0x141',
    name: 'DAI',
    icon: Dai,
    address: '0x',
    decimals: 18,
    symbol: 'DAI',
  },
  tokenOut: {
    id: '0x141',
    name: 'Omen',
    icon: Omen,
    address: '0x',
    decimals: 18,
    symbol: 'DXD',
  },
  minBidAmount: formatDecimal('10.000000000000000000'),
  bids: [],
  type: 'FairSale',
  minFundingThreshold: 100,
})

export const getFixedPriceSales = (): FixedPriceSale => ({
  id: '0x141',
  createdAt: 1585481341,
  updatedAt: null,
  deletedAt: null,
  status: 'closed',
  startDate: 1585654141,
  endDate: 1617193741,
  name: 'Omen',
  type: 'FixedPriceSale',
  tokenPrice: BigNumber.from(100),
  sellAmount: BigNumber.from('0x2A'),
  soldAmount: BigNumber.from(5000),
  minRaise: BigNumber.from(200),
  tokenIn: {
    id: '0x141',
    name: 'DAI',
    icon: Dai,
    address: '0x',
    decimals: 18,
    symbol: 'DAI',
  },
  tokenOut: {
    id: '0x141',
    name: 'Omen',
    icon: Omen,
    address: '0x',
    decimals: 18,
    symbol: 'DXD',
  },
  minCommitment: 2,
  maxCommitment: 20,
  bids: [],
})

const baseCommitments = (): GetAllBidsBySaleId_fixedPriceSale => ({
  id: '0x141',
  __typename: 'FixedPriceSale',
  soldAmount: '15000000000000000000',
  commitments: [
    {
      __typename: 'FixedPriceSaleCommitment',
      id: '0x141',
      status: FixedPriceSaleCommitmentStatus.SUBMITTED,
      amount: '150000000',
      sale: {
        __typename: 'FixedPriceSale',
        id: '0x141',
        tokenPrice: '14342343242',
      },
      user: {
        __typename: 'FixedPriceSaleUser',
        address: '362873668463264',
      },
    },
  ],
})

export const getCommitments = (a?: Partial<GetAllBidsBySaleId_fixedPriceSale>) => ({
  ...baseCommitments,
  ...a,
})

export const getSaleDefault = (a?: Partial<Sale>, saletype: SaleType = 'FairSale') =>
  saletype == 'FixedPriceSale'
    ? {
        ...getFixedPriceSales(),
        ...a,
      }
    : {
        ...getFairSale(),
        ...a,
      }

// Sale details mocks
export const getSaleDetails = (): SaleDetails => ({
  description: [
    {
      title: 'Sale Description title',
      p: 'Sale description content',
    },
  ],
  website: {
    url: 'https://exwhyzed.finance',
  },
  socials: [
    {
      name: 'Telegram',
      link: 'https://exwhyzed.finance/telegram',
    },
    {
      name: 'Some Other Social',
      link: 'https://exwhyzed.finance/other-social',
      icon: 'https://exwhyzed.finance/other-social.png',
    },
  ],
})

export const getSaleDetailsDefault = (a?: Partial<SaleDetails>) => ({
  ...getSaleDetails(),
  ...a,
})

// resize window mock function
export const resizeWindow = (x: number, y: number) => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: x })
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: y })
  window.dispatchEvent(new Event('resize'))
}

// variables
export const addHours = (dayjsInstance: Dayjs, hours: number) => dayjsInstance.clone().add(hours, 'h')
export const utcDate = dayjs(new Date().toUTCString())
export const dateUTC = dayjs.unix(utcDate.unix())

// helpers

export const formatBigInt = (number: BigNumberish, decimals = 18): number => {
  // big number checks & convert if not
  let value: BigNumberish = BigNumber.from(number)

  const addedZeros = getZeros(decimals)

  // negative check
  const negative = value.lt(BigNumber.from(0))

  if (negative) {
    value = value.mul(BigNumber.from(-1))
  }

  let fraction = value.mod(addedZeros).toString()
  while (fraction.length < addedZeros.length - 1) {
    fraction = '0' + fraction
  }

  fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)![1]

  const whole = value.div(addedZeros).toString()

  value = whole + '.' + fraction

  if (negative) {
    value = '-' + value
  }

  return Number(value)
}

// Fix javascripts accuracy issues with small numbers
export const fixRounding = (value: number, precision: number): number => {
  const power = Math.pow(10, precision || 0)
  return Math.round(value * power) / power
}

// Convert price in SC to buyer price
// SC tokenPrice = amount of tokenOut for 1 tokenIn
// More understandable price = amount of tokenIn for 1 tokenOut
export const convertToBuyerPrice = (price: number): number => {
  return 1 / price
}
