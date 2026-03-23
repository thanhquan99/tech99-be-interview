/**
 * Implementation A — Mathematical Formula (Gauss's formula)
 * Time complexity:  O(1) — single arithmetic operation regardless of n
 * Space complexity: O(1) — no extra memory used
 */
function sum_to_n_a(n: number): number {
  return (n * (n + 1)) / 2;
}

/**
 * Implementation B — Iterative Loop
 * Time complexity:  O(n) — loops through every integer from 1 to n
 * Space complexity: O(1) — only a single accumulator variable
 */
function sum_to_n_b(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Implementation C — Recursion
 * Time complexity:  O(n) — one recursive call per integer from n down to 0
 * Space complexity: O(n) — each call occupies a frame on the call stack
 */
function sum_to_n_c(n: number): number {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
}
