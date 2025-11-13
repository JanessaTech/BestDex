import { request, gql } from 'graphql-request'

const endpoint = 'https://gateway.thegraph.com/api/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV';
const query = gql`
query GetPositions($ownerAddress: String!) {
    factories {
      id
    }
    positions(
      where: {owner: $ownerAddress}
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

const headers = {
    Authorization: 'Bearer eada99c8eee80663db1e909b89c14a3f',
};

type PositionInfoType = {
    tokenId: string;
    tickLower: number;
    tickUpper: number;
    token0: `0x${string}`;
    token1: `0x${string}`;
    owner: `0x${string}`;
    fee: number
}

async function fetchData() {
    try {
        const data = await request(endpoint, query, {ownerAddress: "0x3cae6f9ea9a3870781b5bf81e19b99ee9054d0b5"}, headers);
        const positions: PositionInfoType[] = []
        for (let pos of data['positions']) {
            const tokenId = pos['id']
            const owner = pos['owner']
            const fee = Number(pos['pool']['feeTier'])
            const token0 = pos['token0']['id']
            const token1 = pos['token1']['id']
            const tickLower = Number(pos['tickLower']['tickIdx'])
            const tickUpper = Number(pos['tickUpper']['tickIdx'])
            positions.push({tokenId: tokenId, tickLower: tickLower, tickUpper: tickUpper, token0: token0, token1: token1, fee: fee, owner: owner})
        }
        console.log(data);
        console.log(positions)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
}

fetchData()

//npx hardhat run scripts\getpostions_graph.ts