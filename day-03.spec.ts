import { fizzbuzz } from './day-03';
import fc from 'fast-check';

// Examples based tests

it('should be itself for 1, 32 or 121', () => {
  expect(fizzbuzz(1)).toEqual('1');
  expect(fizzbuzz(32)).toEqual('32');
  expect(fizzbuzz(121)).toEqual('121');
});

it('should be Fizz for 3, 6 or 33', () => {
  expect(fizzbuzz(3)).toEqual('Fizz');
  expect(fizzbuzz(6)).toEqual('Fizz');
  expect(fizzbuzz(33)).toEqual('Fizz');
});

it('should be Buzz for 5, 10 or 50', () => {
  expect(fizzbuzz(5)).toEqual('Buzz');
  expect(fizzbuzz(10)).toEqual('Buzz');
  expect(fizzbuzz(50)).toEqual('Buzz');
});

it('should be Fizz Buzz for 15, 30 or 150', () => {
  expect(fizzbuzz(15)).toEqual('Fizz Buzz');
  expect(fizzbuzz(30)).toEqual('Fizz Buzz');
  expect(fizzbuzz(150)).toEqual('Fizz Buzz');
});

// Property based tests

it('should print Fizz whenever divisible by 3', () => {
  fc.assert(
    fc.property(
      fc.nat().map((n) => n * 3),
      (n) => {
        expect(fizzbuzz(n)).toContain('Fizz');
      }
    )
  );
});

it('should not print Fizz when not divisible by 3', () => {
  fc.assert(
    fc.property(
      fc.oneof(
        fc.nat().map((n) => n * 3 + 1),
        fc.nat().map((n) => n * 3 + 2)
      ),
      (n) => {
        expect(fizzbuzz(n)).not.toContain('Fizz');
      }
    )
  );
});

it('should only print Fizz when divisible by 3 but not by 5', () => {
  fc.assert(
    fc.property(
      fc.oneof(
        fc
          .nat()
          .map((n) => n * 5 + 1)
          .map((n) => n * 3),
        fc
          .nat()
          .map((n) => n * 5 + 2)
          .map((n) => n * 3),
        fc
          .nat()
          .map((n) => n * 5 + 3)
          .map((n) => n * 3),
        fc
          .nat()
          .map((n) => n * 5 + 4)
          .map((n) => n * 3)
      ),
      (n) => {
        expect(fizzbuzz(n)).toBe('Fizz');
      }
    )
  );
});

it('should print Buzz whenever divisible by 5', () => {
  fc.assert(
    fc.property(
      fc.nat().map((n) => n * 5),
      (n) => {
        expect(fizzbuzz(n)).toContain('Buzz');
      }
    )
  );
});

it('should not print Buzz when not divisible by 5', () => {
  fc.assert(
    fc.property(
      fc.oneof(
        fc.nat().map((n) => n * 5 + 1),
        fc.nat().map((n) => n * 5 + 2),
        fc.nat().map((n) => n * 5 + 3),
        fc.nat().map((n) => n * 5 + 4)
      ),
      (n) => {
        expect(fizzbuzz(n)).not.toContain('Buzz');
      }
    )
  );
});

it('should only print Buzz when divisible by 5 but not by 3', () => {
  fc.assert(
    fc.property(
      fc.oneof(
        fc
          .nat()
          .map((n) => n * 3 + 1)
          .map((n) => n * 5),
        fc
          .nat()
          .map((n) => n * 3 + 2)
          .map((n) => n * 5)
      ),
      (n) => {
        expect(fizzbuzz(n)).toBe('Buzz');
      }
    )
  );
});

it('should print Fizz Buzz whenever divisible by 3 and 5', () => {
  fc.assert(
    fc.property(
      fc
        .nat()
        .map((n) => n * 3)
        .map((n) => n * 5),
      (n) => {
        expect(fizzbuzz(n)).toBe('Fizz Buzz');
      }
    )
  );
});

it('should print the value itself when not divisible by 3 and not divisible by 5', () => {
  fc.assert(
    fc.property(
      fc.oneof(
        fc.nat().map((n) => n * 15 + 1),
        fc.nat().map((n) => n * 15 + 2),
        fc.nat().map((n) => n * 15 + 4), // +3 would be divisible by 3
        fc.nat().map((n) => n * 15 + 7), // +5 would be divisible by 5, +6 would be divisible by 3
        fc.nat().map((n) => n * 15 + 8), // +9 would be divisible by 3, +10 would be divisible by 5
        fc.nat().map((n) => n * 15 + 11),
        fc.nat().map((n) => n * 15 + 13), // +12 would be divisible by 3
        fc.nat().map((n) => n * 15 + 14)
      ),
      (n) => {
        expect(fizzbuzz(n)).toBe(String(n));
      }
    )
  );
});
