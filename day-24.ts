export type Task = {
  taskId: number;
  estimatedTime: number;
  dependsOnTasks: number[];
};

export type ScheduledTask = {
  taskId: number;
  start: number;
  finish: number;
};

/**
 * Christmas is coming! Santa Claus and his elves have to produce all the presents before the D-day.
 * In order to be as efficient as possible they want to schedule and parallelize as many tasks as possible.
 *
 * So they come up with a precise list of all the tasks including their dependencies and the time they will take.
 * Now we have to suggest the ideal timetable to achieve this goal.
 *
 * @param tasks - Define the tasks to achieve.
 * Tasks should not define circular dependencies, one task cannot be dependant on itself (even indirectly).
 *
 * The following implementation is based on the one suggested at https://algs4.cs.princeton.edu/44sp/CPM.java.html.
 * It solves the "parallel precedence-constrained job scheduling problem".
 */
export function christmasFactorySchedule(tasks: Task[]): ScheduledTask[] {
  const g = buildDirectedGraphFromTasks(tasks);
  const distTo = computeAcyclicLongestPath(g);
  return tasks.map(
    (task): ScheduledTask => ({
      taskId: task.taskId,
      start: distTo[g.startVertexFor(task.taskId)],
      finish: distTo[g.finishVertexFor(task.taskId)],
    })
  );
}

type InternalTask = {
  estimatedTime: number;
  dependsOnTasks: number[];
};

type DirectedEdge = {
  from: number;
  to: number;
  weight: number;
};

type DirectedGraph = {
  source: number;
  startVertexFor: (taskId: number) => number;
  finishVertexFor: (taskId: number) => number;
  numVertex: number;
  edges: DirectedEdge[];
};

function buildDirectedGraphFromTasks(tasks: Task[]): DirectedGraph {
  const n = tasks.length;
  const source = 2 * n;
  const sink = 2 * n + 1;
  const edges = tasks
    .map(
      (task): InternalTask => ({
        estimatedTime: task.estimatedTime,
        dependsOnTasks: task.dependsOnTasks.map((taskId) =>
          tasks.findIndex((t) => t.taskId === taskId)
        ),
      })
    )
    .flatMap((task, index): DirectedEdge[] => {
      return [
        { from: source, to: index, weight: 0 },
        { from: index + n, to: sink, weight: 0 },
        { from: index, to: index + n, weight: task.estimatedTime },
        //...task.dependsOnTasks.map((dependsOnTaskId) => ({ from: index + n, to: dependsOnTaskId, weight: 0 })),
        ...task.dependsOnTasks.map((dependsOnTaskId) => ({
          from: dependsOnTaskId + n,
          to: index,
          weight: 0,
        })),
      ];
    });

  return {
    numVertex: 2 * n + 2,
    edges,
    source,
    startVertexFor: (taskId) => tasks.findIndex((t) => t.taskId === taskId),
    finishVertexFor: (taskId) =>
      tasks.findIndex((t) => t.taskId === taskId) + n,
  };
}

function computeAcyclicLongestPath(g: DirectedGraph): number[] {
  const distTo: number[] = Array(g.numVertex).fill(Number.NEGATIVE_INFINITY);
  distTo[g.source] = 0;

  for (const v of topologicalOrder(g)) {
    for (const e of g.edges.filter((e) => e.from === v)) {
      const w = e.to;
      if (distTo[w] < distTo[v] + e.weight) {
        distTo[w] = distTo[v] + e.weight;
      }
    }
  }

  return distTo;
}

function topologicalOrder(g: DirectedGraph): number[] {
  const marked = new Set<number>();
  const postOrder: number[] = [];
  for (let v = 0; v !== g.numVertex; ++v) {
    if (!marked.has(v)) {
      postDfsInternal(g, v, marked, postOrder);
    }
  }
  return postOrder.reverse();
}

function postDfsInternal(
  g: DirectedGraph,
  v: number,
  marked: Set<number>,
  acc: number[]
): void {
  marked.add(v);
  for (const adj of g.edges.filter((e) => e.from === v)) {
    if (!marked.has(adj.to)) {
      postDfsInternal(g, adj.to, marked, acc);
    }
  }
  acc.push(v);
}
