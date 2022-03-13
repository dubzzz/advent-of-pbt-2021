import { racePodium, RaceParticipants } from "./day-15";
import fc from "fast-check";

// Examples based tests

it("should find the right podium for a given race", () => {
  // Arrange
  // prettier-ignore
  const speeds = [
    14,  1,  8, 19, 23,
    13, 17, 10,  3,  5,
     2, 21, 22,  9, 11,
    20,  7, 16, 24, 18,
     0, 15, 12,  6,  4
  ];
  const compareParticipants = (pa: number, pb: number) => {
    if (speeds[pa] !== speeds[pb]) return speeds[pb] - speeds[pa];
    else return pa - pb;
  };
  const runRace = (...participants: RaceParticipants): RaceParticipants => {
    return participants.sort(compareParticipants);
  };

  // Act
  const podium = racePodium(runRace);

  // Assert
  expect(podium).toEqual([18, 4, 12]);
});

// Property based tests

it("should predict the right podium", () => {
  fc.assert(
    fc.property(
      fc.array(fc.nat(), { minLength: 25, maxLength: 25 }),
      (speeds) => {
        // Arrange
        const compareParticipants = (pa: number, pb: number) => {
          if (speeds[pa] !== speeds[pb]) return speeds[pb] - speeds[pa];
          else return pa - pb;
        };
        const runRace = (
          ...participants: RaceParticipants
        ): RaceParticipants => {
          return participants.sort(compareParticipants);
        };

        // Act
        const podium = racePodium(runRace);

        // Assert
        const rankedParticipants = [...Array(25)]
          .map((_, i) => i)
          .sort(compareParticipants);
        const expectedPodium = rankedParticipants.slice(0, 3);
        expect(podium).toEqual(expectedPodium);
      }
    )
  );
});

it("should never do more than 7 races", () => {
  fc.assert(
    fc.property(
      fc.array(fc.nat(), { minLength: 25, maxLength: 25 }),
      (speeds) => {
        // Arrange
        const compareParticipants = (pa: number, pb: number) => {
          if (speeds[pa] !== speeds[pb]) return speeds[pb] - speeds[pa];
          else return pa - pb;
        };
        const runRace = jest.fn(
          (...participants: RaceParticipants): RaceParticipants => {
            return participants.sort(compareParticipants);
          }
        );

        // Act
        racePodium(runRace);

        // Assert
        expect(runRace.mock.calls.length).toBeLessThanOrEqual(7);
      }
    )
  );
});
