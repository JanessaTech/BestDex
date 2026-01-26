import { gql } from 'graphql-request'

export const positionListQuery = gql`
        query GetPositions($owner: String!, $first: Int, $skip: Int) {
            factories {
            id
            }
            positions(
            where: {owner: $owner}
            orderDirection: desc
            orderBy: id
            first: $first
            skip: $skip
            ) {
            id
            tickLower {
                tickIdx
            }
            tickUpper {
                tickIdx
            }
            token0 {
                symbol
                id
                name
                decimals
            }
            liquidity
            pool {
                feeTier
            }
            token1 {
                symbol
                id
                name
                decimals
            }
            owner
            }
        }`;

const positionListQuery_1 = gql`
        query GetPositions($owner: String!, $first: Int, $skip: Int) {
            factories {
            id
            }
            positions(
            where: {owner: $owner}
            orderDirection: desc
            orderBy: id
            first: $first
            skip: $skip
            ) {
            id
            tickLower {
                tickIdx
            }
            tickUpper {
                tickIdx
            }
            token0 {
                symbol
                id
                name
                decimals
            }
            liquidity
            pool {
                feeTier
            }
            token1 {
                symbol
                id
                name
                decimals
            }
            owner
            }
        }`;    
const positionListQuery_42161 = gql`
     query GetPositions($owner: String!, $first: Int, $skip: Int) {
        positions(
            where: {owner: $owner}
            orderDirection: desc
            orderBy: id
            first: $first
            skip: $skip
        ) {
            id
            tickLower
            tickUpper
            owner
            pool {
            feeTier
            }
            token0 {
            symbol
            name
            id
            decimals
            }
            token1 {
            decimals
            id
            name
            symbol
            }
          }
     }`

export const chainPositionQueryMapping : { [chainId: number]: string} = {
    1: positionListQuery_1, // Ethereum Mainnet
    8453: '', // Base
    56: '', // BNB Smart Chain,
    42161: positionListQuery_42161,  // Arbitrum
    42220: '', // Celo
    11155111: '', // Ethereum Sepolia
    84532: '' // Base Sepolia
}