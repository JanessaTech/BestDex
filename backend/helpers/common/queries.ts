import { gql } from 'graphql-request'

export const positionListQuery = gql`
        query GetPositions($owner: String!) {
            factories {
            id
            }
            positions(
            where: {owner: $owner}
            orderDirection: desc
            orderBy: id
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
            }
            pool {
                feeTier
            }
            token1 {
                symbol
                id
            }
            owner
            }
        }`;