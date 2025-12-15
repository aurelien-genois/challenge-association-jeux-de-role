function sumRange(number: number): number {
  if (number === 1) {
    return 1;
  } else {
    return number + sumRange(number - 1);
  }
}

function power(number: number, exp: number): number {
  if (exp === 0) {
    return 1;
  } else {
    return number * power(number, exp - 1);
  }
}

function factorial(number: number): number {
  if (number === 1) {
    return 1;
  } else {
    return number * factorial(number - 1);
  }
}

function all(arr: number[], fn: (number: number) => Boolean): Boolean {
  if (arr.length === 0) {
    return true; // ? not sure
  } else if (!fn(arr[0])) {
    // every should be true, if one false : stop recursive : false bottom-up
    return false;
  } else {
    // if one true, try next one
    arr.shift();
    return all(arr, fn);
  }
}
const allAreLessThanSeven = all([0, 2, 3, 5, 2, 1, 8], function (num) {
  return num < 7;
});

function productOfArray(arr: number[]): number {
  if (arr.length === 0) {
    return 1;
  } else {
    const currNb = arr[0];
    arr.shift();
    return currNb * productOfArray(arr);
  }
}

function contains(obj: Record<string, unknown>, value: unknown): Boolean {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      if (typeof obj[prop] === "object" && typeof obj[prop] !== null) {
        // recursion here, if object
        if (contains(obj[prop] as Record<string, unknown>, value)) {
          return true; // return true only if round the value (bubble up), else continue next prop
        }
      } else {
        if (obj[prop] === value) {
          return true; // return true only if found the value, else continue to next prop
        }
      }
    }
  }

  // if obj empty or no value found, return false
  return false;
}
var nestedObject = {
  data: {
    info: {
      stuff: {
        thing: {
          moreStuff: {
            magicNumber: 44,
            something: "foo2",
          },
        },
      },
      thing: {
        moreStuff: {
          magicNumber: 66,
          something: "bar",
        },
      },
    },
  },
};

function sumIntegers(arr: Array<unknown>): number {
  var copy = arr.slice() as Array<unknown>;

  if (copy.length === 0) {
    return 0;
  } else {
    if (Number.isInteger(arr[0])) {
      const currNb = arr[0];
      copy.shift();
      return currNb + sumIntegers(copy);
    } else if (Array.isArray(copy[0])) {
      const currTotal = sumIntegers(copy[0]);
      copy.shift();
      return currTotal + sumIntegers(copy);
    }
  }

  return 0;
}
function totalIntegers(arr: Array<unknown>): number {
  var copy = arr.slice() as Array<unknown>;

  if (copy.length === 0) {
    return 0;
  } else {
    if (Number.isInteger(arr[0])) {
      copy.shift();
      return 1 + totalIntegers(copy);
    } else if (Array.isArray(copy[0])) {
      const currTotal = totalIntegers(copy[0]);
      copy.shift();
      return currTotal + totalIntegers(copy);
    }
  }

  return 0;
}
const arrayTest = [[[5], 3], 0, 2, ["foo"], [], [4, [5, 6]]];

function sumSquares(arr: Array<unknown>): number {
  var copy = arr.slice() as Array<unknown>;

  if (copy.length === 0) {
    return 0;
  } else {
    if (Number.isInteger(arr[0])) {
      const currNb = arr[0] as number;
      const currSquare = currNb * currNb;
      copy.shift();
      return currSquare + sumSquares(copy);
    } else if (Array.isArray(copy[0])) {
      const currTotal = sumSquares(copy[0]);
      copy.shift();
      return currTotal + sumSquares(copy);
    }
  }

  return 0;
}
var l = [1, 2, 3] as Array<unknown>;
l = [[1, 2], 3];
l = [[[[[[[[[1]]]]]]]]];
l = [10, [[10], 10], [10]];

function replicate(nTimes: number, num: number): number[] {
  if (nTimes <= 0) {
    return []; // base case empty if no repetition
  } else if (nTimes === 1) {
    return [num]; // base case return the first element (no repetition)
  } else {
    return [num].concat(replicate(nTimes - 1, num));
  }
}

console.log(replicate(3, 5));
console.log(replicate(1, 69));
console.log(replicate(-2, 6));
