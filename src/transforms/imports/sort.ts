// Transform to sort import specifiers within a single import declaration
// Note: This is specifically for sorting import specifiers (e.g., import {b, a} -> import {a, b}),
// which is a safe operation that doesn't affect program behavior