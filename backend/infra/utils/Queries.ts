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