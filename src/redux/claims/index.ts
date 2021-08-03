// External
import { ContractTransaction } from 'ethers'

// Interface
import { Action } from 'redux'

// interface

import { ClaimState } from 'src/hooks/useTokenClaim'
import { GetFixedPriceSaleCommitmentsByUser_fixedPriceSaleCommitments_sale } from 'src/subgraph/__generated__/GetFixedPriceSaleCommitmentsByUser'

export enum ActionTypes {
  SET_CLAIM_STATUS = 'SET_CLAIM_STATUS',
}

export interface ClaimStatePerSale {
  sale: GetFixedPriceSaleCommitmentsByUser_fixedPriceSaleCommitments_sale
  claimToken: ClaimState
  transaction: ContractTransaction | null
  error: Error | null
}

interface ClaimAction extends Action<ActionTypes.SET_CLAIM_STATUS> {
  payload: ClaimStatePerSale
}

export type ClaimActionTypes = ClaimAction

export interface ClaimTokensState {
  claims: ClaimStatePerSale[]
}

export const setClaimStatus = (payload: ClaimStatePerSale): ClaimAction => ({
  type: ActionTypes.SET_CLAIM_STATUS,
  payload,
})

export const defaultState: ClaimTokensState = { claims: [] }

const eventExists = (events: ClaimStatePerSale[], event: ClaimStatePerSale) => {
  return events.some(e => e.sale.id === event.sale.id)
}

export function reducer(state: ClaimTokensState = defaultState, action: ClaimActionTypes): ClaimTokensState {
  switch (action.type) {
    case ActionTypes.SET_CLAIM_STATUS:
      return {
        claims: eventExists(state.claims, action.payload)
          ? state.claims.map((element: ClaimStatePerSale) => {
              if (element.sale.id === action.payload.sale.id) {
                return {
                  ...element,
                  claimToken: action.payload.claimToken,
                }
              }
              return element
            })
          : [...state.claims, action.payload],
      }
    default:
      return state
  }
}