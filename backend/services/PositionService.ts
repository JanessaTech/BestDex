import logger from "../helpers/logger";
import { PositionService } from "./types/TypesInService";

class PositionServiceImpl implements PositionService {
    async getPositions(chainId: number, owner: `0x${string}`) {

    }
}

const positionService = new PositionServiceImpl()
export default positionService