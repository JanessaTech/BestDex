
class RouterGraph {
    #adj = new Map()
    constructor(data) {
        for (let i = 0; i < data.length; i++) {
            this.#adj.set(data[i], [])
        }
    }

    addEdge(s, v) {
        this.#adj.get(s).push(v)
        this.#adj.get(v).push(s)
    }

    adj(v) {
        return this.#adj.get(v)
    }

    getAdj() {
        return this.#adj
    }
}

class DepthFirstSearch {
    #router
    #marked = new Map()
    #paths = []
    constructor(router){
        this.#router = router
        for (const [key, _] of router.getAdj()) {
            this.#marked[key] = false
        }
    }

    getMarked() {
        return this.#marked
    }

    findPaths(s, e) {
        let path = [s]
        this.dfs(s, e, path)
    }

    dfs(s, e, path) {
        this.#marked[s] = true
        if (s === e) {
            this.#paths.push([...path])
        } else {
            const kids = this.#router.adj(s)
            for (const k of kids) {
                if (this.#marked[k] === false) {
                    path.push(k)
                    this.dfs(k, e, path)
                    path.pop()
                }
            } 
        }
        this.#marked[s] = false
    }

    paths() {
        return this.#paths
    }

    shortestPath() {
        return this.#paths.sort(function(x, y) {
            if (x.length < y.length) return -1
            if (x.length > y.length) return 1
            return 0
        })[0]
    }
}

function findPaths(s, e) {
    const dfs = new DepthFirstSearch(router)
    dfs.findPaths(s, e)
    const path = dfs.shortestPath()
    console.log(`${s} -> ${e} : `, path)
}

const data = ['DAI', 'USDC', 'WETH', 'WBTC', 'ZRX', '1INCH']
const router = new RouterGraph(data)
router.addEdge('DAI', 'USDC')
router.addEdge('DAI', 'WETH')
router.addEdge('DAI', '1INCH')
router.addEdge('USDC', 'WETH')
router.addEdge('USDC', 'WBTC')
router.addEdge('USDC', '1INCH')
router.addEdge('WETH', 'ZRX')
router.addEdge('WETH', '1INCH')

findPaths('DAI', 'USDC')
findPaths('DAI', 'WETH')
findPaths('DAI', 'WBTC')
findPaths('DAI', 'ZRX')
findPaths('DAI', '1INCH')

findPaths('USDC', 'DAI')
findPaths('USDC', 'WETH')
findPaths('USDC', 'WBTC')
findPaths('USDC', 'ZRX')
findPaths('USDC', '1INCH')

findPaths('WETH', 'DAI')
findPaths('WETH', 'USDC')
findPaths('WETH', 'WBTC')
findPaths('WETH', 'ZRX')
findPaths('WETH', '1INCH')

findPaths('WBTC', 'DAI')
findPaths('WBTC', 'USDC')
findPaths('WBTC', 'WETH')
findPaths('WBTC', 'ZRX')
findPaths('WBTC', '1INCH')

findPaths('ZRX', 'DAI')
findPaths('ZRX', 'USDC')
findPaths('ZRX', 'WETH')
findPaths('ZRX', 'WBTC')
findPaths('ZRX', '1INCH')

findPaths('1INCH', 'DAI')
findPaths('1INCH', 'USDC')
findPaths('1INCH', 'WETH')
findPaths('1INCH', 'WBTC')
findPaths('1INCH', 'ZRX')





