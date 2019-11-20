class Path {
  constructor (cost, node) {
    /** @member {Number} cost */
    this.cost = cost
    /** @member {Node} node */
    this.node = node
  }
}

class Node {
  /**
   * @param {String} name
   * @param {Array<Path>} paths
   */
  constructor (name, paths = []) {
    /** @member {String} */
    this.name = name
    /** @member {Array<Path>} paths */
    this.paths = paths
    /** @member {Number} totalCost */
    this.distance = Infinity
    /** @member {Node} visitedFrom */
    this.visitedFrom = null
    /** @member {Boolean} visited */
    this.visited = false
  }

  /**
   * @param {Node} node
   * @param {Number} cost
   */
  addOrientedPath (node, cost) {
    const current = this.paths.findIndex(n => n.node === node)
    if (current !== -1) {
      this.paths.splice(current, 1)
    }
    this.paths.push(new Path(cost, node))
  }

  /**
   * @param {Node} node
   * @param {Number} cost
   */
  addNonOrientedPath (node, cost) {
    this.addOrientedPath(node, cost)
    node.addOrientedPath(this, cost)
  }

  /**
   * Calculates the new distance for each node
   * Already visited nodes shouldn't be updated
   * The {@Path Node}s returned are the nodes which were never calculated before
   * @returns {Node[]|null}
   */
  calcNeighboursTentativeDistance () {
    const pathsNotVisited = this.paths.filter(path => !path.node.visited)
    if (!pathsNotVisited) return null

    for (const path of pathsNotVisited) {
      const neighbourDistance = path.node.distance
      const fromThisNodeDistance = this.distance + path.cost

      if (neighbourDistance > fromThisNodeDistance) {
        path.node.distance = fromThisNodeDistance
        path.node.visitedFrom = this
      }
    }

    const nodesUpdated = pathsNotVisited.map(path => path.node)
    return nodesUpdated
  }
}

class Dijkstra {
  /**
   * Calculates the shortest path, and returns a list of nodes
   * that we need to go through to have the path
   * @param {Node} startNode
   * @param {Node} endNode
   * @returns {Array<Node>}
   */
  static shortestPathFirst (startNode, endNode) {
    if (startNode === endNode) return []

    startNode.distance = 0
    let node = startNode

    while (node !== endNode) {
      const nodes = node.calcNeighboursTentativeDistance()
      node.visited = true
      node = nodes.reduce((prev, current) => prev.distance < current.distance ? prev : current)
    }

    return this.generatePath(node)
  }

  /**
   * Generates the path from an endNode to the startNode
   * it uses the `visitedFrom` property to navigate backwards
   * to the starting point
   * @param {Node} endNode
   * @returns {Node[]}
   */
  static generatePath (endNode) {
    const result = this.recursiveGetVisitedFromNodes(endNode)
    return result.reverse()
  }

  static recursiveGetVisitedFromNodes (endNode, listOfNodes = [endNode]) {
    if (endNode.visitedFrom == null) return listOfNodes
    listOfNodes.push(endNode.visitedFrom)
    return this.recursiveGetVisitedFromNodes(endNode.visitedFrom, listOfNodes)
  }

  /**
   * Print the path like a linked list
   * @param {Node[]} listOfNodes
   */
  /* istanbul ignore next */
  static printPath (listOfNodes) {
    let out = ''
    for (const n of listOfNodes) {
      out += `(${n.name}, ${n.distance}) => `
    }
    out += 'x'
    console.log(out)
  }
}

module.exports = { Dijkstra, Path, Node}
