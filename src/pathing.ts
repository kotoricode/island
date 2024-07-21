import { Quad } from "./quad"
import { LineSegment } from "./line-segment"
import { Vector2 } from "./vector2"

class Node
{
    estimated: number

    constructor(
        public point: Vector2,
        public cost: number,
        public previous: Node | null,
        end: Vector2
    )
    {
        this.estimated = point.distance(end)
    }
}

export class Pathing
{
    private quads = new Set<Quad>()
    private outerSegments = new Set<LineSegment>()
    private connections = new Map<Vector2, Vector2[]>()

    constructor(private vertices: readonly Vector2[])
    {
    }

    markQuad(
        bottomLeftIndex: number,
        bottomRightIndex: number,
        topLeftIndex: number,
        topRightIndex: number
    ): void
    {
        const bottomLeft = this.vertices[bottomLeftIndex]
        const bottomRight = this.vertices[bottomRightIndex]
        const topLeft = this.vertices[topLeftIndex]
        const topRight = this.vertices[topRightIndex]

        const quad = new Quad(bottomLeft, bottomRight, topLeft, topRight)
        this.quads.add(quad)
    }

    markOuterSegment(ai: number, bi: number): void
    {
        const a = this.vertices[ai]
        const b = this.vertices[bi]
        const lineSegment = new LineSegment(a, b)
        this.outerSegments.add(lineSegment)
    }

    getPath(start: Vector2, end: Vector2): Vector2[] | null
    {
        const startQuad = this.getContainingQuad(start)
        const endQuad = this.getContainingQuad(end)

        if (!startQuad || !endQuad)
        {
            return null
        }

        if (startQuad === endQuad)
        {
            return [start, end]
        }

        const segment = new LineSegment(start, end)
        const intersections = this.getOuterSegmentIntersections(segment)

        if (!intersections.length)
        {
            return [start, end]
        }

        const explored = new Set<Vector2>()
        const vertices = this.vertices.slice()

        vertices.push(start)
        vertices.push(end)
        this.createConnections(vertices)

        const startNode = new Node(start, 0, null, end)
        const queue = [startNode]

        while (true)
        {
            const current = queue.shift()

            if (!current)
            {
                return null
            }

            if (this.isConnected(current.point, end))
            {
                const path = [current.point, end]
                let node = current

                while (node.previous)
                {
                    path.unshift(node.previous.point)
                    node = node.previous
                }

                return path
            }

            const connected = this.connections.get(current.point)

            if (connected)
            {
                for (const c of connected)
                {
                    if (explored.has(c))
                    {
                        continue
                    }

                    const cost = current.cost + current.point.distance(c)
                    const queued = queue.find(q => q.point === c)

                    if (!queued)
                    {
                        const node = new Node(c, cost, current, end)
                        queue.push(node)
                    }
                    else if (cost < queued.cost)
                    {
                        queued.cost = cost
                        queued.previous = current
                    }
                }

                queue.sort((a, b) => (a.cost + a.estimated) - (b.cost + b.estimated))
            }

            explored.add(current.point)
        }
    }

    private createConnections(vertices: Vector2[]): void
    {
        this.connections.clear()

        for (let i = 0; i < vertices.length; i++)
        {
            const a = vertices[i]

            for (let j = i + 1; j < vertices.length; j++)
            {
                const b = vertices[j]

                if (this.isConnected(a, b))
                {
                    this.addConnection(a, b)
                    this.addConnection(b, a)
                }
            }
        }
    }

    private isConnected(a: Vector2, b: Vector2): boolean
    {
        const segment = new LineSegment(a, b)
        const intersections = this.getOuterSegmentIntersections(segment)

        if (intersections.length < 2)
        {
            return true
        }

        for (let i = 0; i < intersections.length - 1; i++)
        {
            const first = intersections[i]
            const second = intersections[i + 1]
            const midpoint = first.clone().mix(second, 0.5)
            const quad = this.getContainingQuad(midpoint)

            if (!quad)
            {
                return false
            }
        }

        return true
    }

    private getContainingQuad(point: Vector2): Quad | null
    {
        for (const quad of this.quads)
        {
            if (quad.contains(point))
            {
                return quad
            }
        }

        return null
    }

    private addConnection(a: Vector2, b: Vector2): void
    {
        const aConnections = this.connections.get(a)

        if (aConnections)
        {
            aConnections.push(b)
        }
        else
        {
            this.connections.set(a, [b])
        }
    }

    private getOuterSegmentIntersections(segment: LineSegment): Vector2[]
    {
        const intersections: Vector2[] = []

        for (const outerSegment of this.outerSegments)
        {
            const intersection = segment.getIntersection(outerSegment)

            if (intersection)
            {
                intersections.push(intersection)
            }
        }

        return intersections
    }
}
