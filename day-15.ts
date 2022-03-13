export type RaceParticipants = [number, number, number, number, number];

/**
 * 25 Horses Puzzle
 * >  Let’s say that you have 25 horses, and you want to pick the fastest 3 horses out of those 25.
 * >  In each race, only 5 horses can run at the same time because there are only 5 tracks.
 * >  What is the minimum number of races required to find the 3 fastest horses without using a stopwatch?
 *
 * Find the podium!
 * See https://matt-croak.medium.com/google-interview-25-horses-c982d0a9b3af for more details.
 *
 * @param runRace - Run a race with the received participants. Outputs the final ranking. In case of equality the participant with the smallest id wins.
 *
 * @returns
 * Ordered top three.
 */
export function racePodium(
  runRace: (...participants: RaceParticipants) => RaceParticipants
): [number, number, number] {
  const raceResults: RaceParticipants[] = [];

  // We start with one run per candidate first
  //   c0  c1  c2  c3  c4  <-- race #1
  //   c5  c6  c7  c8  c9  <-- race #2
  //  ...
  for (let index = 0; index !== 5; ++index) {
    const ca = index * 5;
    const cb = index * 5 + 1;
    const cc = index * 5 + 2;
    const cd = index * 5 + 3;
    const ce = index * 5 + 4;
    raceResults.push(runRace(ca, cb, cc, cd, ce));
  }

  // Run a race against all the winners
  raceResults.push(
    runRace(
      raceResults[0][0],
      raceResults[1][0],
      raceResults[2][0],
      raceResults[3][0],
      raceResults[4][0]
    )
  );
  const winnersOriginalRaces = raceResults[5].map((p) => Math.floor(p / 5));

  // Based on the race right before we know that the only eligible candidates for a second place are:
  // - raceResults[5][1]
  // - raceResults[winnersOriginalRaces[0]][1]
  // For a third place are:
  // - raceResults[5][2]
  // - raceResults[winnersOriginalRaces[0]][2]
  // - raceResults[winnersOriginalRaces[1]][1]
  // + the one of the ones for second place
  raceResults.push(
    runRace(
      raceResults[5][1],
      raceResults[winnersOriginalRaces[0]][1],
      raceResults[5][2],
      raceResults[winnersOriginalRaces[0]][2],
      raceResults[winnersOriginalRaces[1]][1]
    )
  );

  return [raceResults[5][0], raceResults[6][0], raceResults[6][1]];
}
