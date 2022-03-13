import { christmasFactorySchedule, Task } from "./day-24";
import fc from "fast-check";

// Examples based tests

it("should fully parallelize all the tasks whenever possible", () => {
  // Arrange
  const tasks: Task[] = [
    { taskId: 0, estimatedTime: 10, dependsOnTasks: [] },
    { taskId: 1, estimatedTime: 5, dependsOnTasks: [] },
    { taskId: 2, estimatedTime: 3, dependsOnTasks: [] },
    { taskId: 3, estimatedTime: 12, dependsOnTasks: [] },
  ];

  // Act
  const scheduledTasks = christmasFactorySchedule(tasks);

  // Assert
  expect(scheduledTasks).toEqual([
    { taskId: 0, start: 0, finish: 10 },
    { taskId: 1, start: 0, finish: 5 },
    { taskId: 2, start: 0, finish: 3 },
    { taskId: 3, start: 0, finish: 12 },
  ]);
});

it("should queue all tasks whenever no parallel runs are allowed", () => {
  // Arrange
  const tasks: Task[] = [
    { taskId: 0, estimatedTime: 10, dependsOnTasks: [] },
    { taskId: 1, estimatedTime: 5, dependsOnTasks: [2] },
    { taskId: 2, estimatedTime: 3, dependsOnTasks: [3] },
    { taskId: 3, estimatedTime: 12, dependsOnTasks: [0] },
  ];

  // Act
  const scheduledTasks = christmasFactorySchedule(tasks);

  // Assert
  expect(scheduledTasks).toEqual([
    { taskId: 0, start: 0, finish: 10 },
    { taskId: 1, start: 25, finish: 30 },
    { taskId: 2, start: 22, finish: 25 },
    { taskId: 3, start: 10, finish: 22 },
  ]);
});

it("should be able to handle tasks depending on the completion of many", () => {
  // Arrange
  const tasks: Task[] = [
    { taskId: 0, estimatedTime: 10, dependsOnTasks: [] },
    { taskId: 1, estimatedTime: 5, dependsOnTasks: [2] },
    { taskId: 2, estimatedTime: 3, dependsOnTasks: [0, 3] },
    { taskId: 3, estimatedTime: 12, dependsOnTasks: [] },
  ];

  // Act
  const scheduledTasks = christmasFactorySchedule(tasks);

  // Assert
  expect(scheduledTasks).toEqual([
    { taskId: 0, start: 0, finish: 10 },
    { taskId: 1, start: 15, finish: 20 },
    { taskId: 2, start: 12, finish: 15 },
    { taskId: 3, start: 0, finish: 12 },
  ]);
});

it("should be able to handle complex tasks with many dependencies", () => {
  // Arrange
  const tasks: Task[] = [
    { taskId: 0, estimatedTime: 10, dependsOnTasks: [] },
    { taskId: 1, estimatedTime: 5, dependsOnTasks: [2] },
    { taskId: 2, estimatedTime: 3, dependsOnTasks: [0, 3] },
    { taskId: 3, estimatedTime: 12, dependsOnTasks: [4] },
    { taskId: 4, estimatedTime: 1, dependsOnTasks: [] },
    { taskId: 5, estimatedTime: 6, dependsOnTasks: [0] },
    { taskId: 6, estimatedTime: 8, dependsOnTasks: [2, 5] },
    { taskId: 7, estimatedTime: 9, dependsOnTasks: [1, 6] },
  ];

  // Act
  const scheduledTasks = christmasFactorySchedule(tasks);

  // Assert
  expect(scheduledTasks).toEqual([
    { taskId: 0, start: 0, finish: 10 },
    { taskId: 1, start: 16, finish: 21 },
    { taskId: 2, start: 13, finish: 16 },
    { taskId: 3, start: 1, finish: 13 },
    { taskId: 4, start: 0, finish: 1 },
    { taskId: 5, start: 10, finish: 16 },
    { taskId: 6, start: 16, finish: 24 },
    { taskId: 7, start: 24, finish: 33 },
  ]);
});

// Property based tests

it("should keep all the tasks for the scheduled plan", () => {
  fc.assert(
    fc.property(tasksArbitrary(), (tasks) => {
      // Arrange / Act
      const schedule = christmasFactorySchedule(tasks);

      // Assert
      expect(schedule).toHaveLength(tasks.length);
      const tasksFromSchedule = new Set(schedule.map((t) => t.taskId));
      const tasksFromRequest = new Set(tasks.map((t) => t.taskId));
      expect(tasksFromSchedule).toEqual(tasksFromRequest);
    })
  );
});

it("should not extend or reduce the duration of tasks", () => {
  fc.assert(
    fc.property(tasksArbitrary(), (tasks) => {
      // Arrange / Act
      const schedule = christmasFactorySchedule(tasks);

      // Assert
      for (const scheduledTask of schedule) {
        const task = tasks.find((t) => t.taskId === scheduledTask.taskId);
        expect(scheduledTask.finish - scheduledTask.start).toBe(
          task.estimatedTime
        );
      }
    })
  );
});

it("should not start any task before all its dependencies ended", () => {
  fc.assert(
    fc.property(tasksArbitrary(), (tasks) => {
      // Arrange / Act
      const schedule = christmasFactorySchedule(tasks);

      // Assert
      for (const scheduledTask of schedule) {
        const dependencies = tasks.find(
          (t) => t.taskId === scheduledTask.taskId
        )!.dependsOnTasks;
        for (const depTaskId of dependencies) {
          const depScheduledTask = schedule.find((s) => s.taskId === depTaskId);
          expect(scheduledTask.start).toBeGreaterThanOrEqual(
            depScheduledTask.finish
          );
        }
      }
    })
  );
});

it("should start tasks as soon as possible", () => {
  fc.assert(
    fc.property(tasksArbitrary(), (tasks) => {
      // Arrange / Act
      const schedule = christmasFactorySchedule(tasks);

      // Assert
      for (const scheduledTask of schedule) {
        const dependencies = tasks.find(
          (t) => t.taskId === scheduledTask.taskId
        )!.dependsOnTasks;
        const finishTimeDependencies = dependencies.map((depTaskId) => {
          const depScheduledTask = schedule.find((s) => s.taskId === depTaskId);
          return depScheduledTask.finish;
        });
        const expectedStart =
          finishTimeDependencies.length !== 0
            ? Math.max(...finishTimeDependencies)
            : 0;
        expect(scheduledTask.start).toBe(expectedStart);
      }
    })
  );
});

// Helpers

function tasksArbitrary(): fc.Arbitrary<Task[]> {
  return fc
    .tuple(
      tasksLayerArbitrary(0), // tasks with ids in 0 to 9, without any dependencies
      tasksLayerArbitrary(1), // tasks with ids in 10 to 19, with possible dependencies onto 0 to 9
      tasksLayerArbitrary(2), // tasks with ids in 20 to 29, with possible dependencies onto 0 to 19
      tasksLayerArbitrary(3) // tasks with ids in 30 to 39, with possible dependencies onto 0 to 29
    )
    .map((layers: Task[][]): Task[] => {
      // Merge all the layers together
      const requestedTasks = layers.flat();
      // List all the ids of tasks used as dependencies of others
      const tasksIdDependencies = [
        ...new Set(requestedTasks.flatMap((t) => t.dependsOnTasks)),
      ];
      // Create missing tasks (for dependencies)
      const missingTasks = tasksIdDependencies
        .filter(
          (taskId) =>
            requestedTasks.find((t) => t.taskId === taskId) === undefined
        )
        .map((taskId) => ({ taskId, estimatedTime: 0, dependsOnTasks: [] }));
      // Return the tasks
      return [...requestedTasks, ...missingTasks];
    });
}

function tasksLayerArbitrary(layer: number): fc.Arbitrary<Task[]> {
  return fc.set(
    fc.record<Task>({
      taskId: fc.integer({ min: layer * 10, max: layer * 10 + 9 }),
      estimatedTime: fc.nat(),
      // Curret layer can have dependencies onto any other previous layer
      dependsOnTasks:
        layer !== 0
          ? fc.set(fc.integer({ min: 0, max: (layer - 1) * 10 + 9 }))
          : fc.constant([]),
    }),
    { compare: (taskA, taskB) => taskA.taskId === taskB.taskId }
  );
}
