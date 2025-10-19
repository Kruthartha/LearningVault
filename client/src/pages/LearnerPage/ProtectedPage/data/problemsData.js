// src/data/problemsData.js

// We use an object where the key is the problem's slug for easy lookups.
export const problemsData = {
  // Problem 1: Two Sum
  "two-sum": {
    id: 1,
    slug: "two-sum",
    functionName: "twoSum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    acceptance: 49.2,
    likes: 15234,
    dislikes: 892,
    premium: false,
    tags: ["Array", "Hash Table"],
    companies: ["Google", "Amazon", "Microsoft", "Facebook", "Apple"],
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    examples: [
      {
        input: `nums = [2,7,11,15], target = 9`,
        output: `[0,1]`,
        explanation: `Because nums[0] + nums[1] == 9, we return [0, 1].`,
      },
      {
        input: `nums = [3,2,4], target = 6`,
        output: `[1,2]`,
        explanation: `Because nums[1] + nums[2] == 6, we return [1, 2].`,
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    followUp:
      "Can you come up with an algorithm that is less than O(n²) time complexity?",
    starterCode: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your solution here\n    \n};`,
    publicTestCases: [
      { id: 1, input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { id: 2, input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
    ],

    // --- ADD THIS NEW ARRAY for locked test cases ---
    hiddenTestCases: [
      { id: 3, input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
      {
        id: 4,
        input: { nums: [-1, -2, -3, -4, -5], target: -8 },
        expected: [2, 4],
      },
      // Add more complex edge cases here
    ],
  },

  // Problem 2: Valid Parentheses
  "valid-parentheses": {
    id: 2,
    slug: "valid-parentheses",
    functionName:"addTwoNumbers",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "String",
    acceptance: 40.8,
    likes: 12890,
    dislikes: 571,
    premium: false,
    tags: ["String", "Stack"],
    companies: ["Google", "Facebook", "Bloomberg", "Amazon"],
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.`,
    examples: [
      {
        input: `s = "()"`,
        output: `true`,
        explanation: `The brackets are matched and in the correct order.`,
      },
      {
        input: `s = "()[]{}"`,
        output: `true`,
        explanation: `All bracket types are matched correctly.`,
      },
      {
        input: `s = "(]"`,
        output: `false`,
        explanation: `The open bracket '(' is incorrectly closed by ']'.`,
      },
    ],
    constraints: [
      "1 ≤ s.length ≤ 10⁴",
      "s consists of parentheses only '()[]{}'.",
    ],
    followUp: null,
    starterCode: `/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    // Write your solution here\n    \n};`,
  },

  // Problem 3: Add Two Numbers
  "add-two-numbers": {
    id: 3,
    slug: "add-two-numbers",
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    acceptance: 39.5,
    likes: 18450,
    dislikes: 3780,
    premium: false,
    tags: ["Linked List", "Math", "Recursion"],
    companies: ["Microsoft", "Meta", "Adobe", "ByteDance"],
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list. You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    examples: [
      {
        input: `l1 = [2,4,3], l2 = [5,6,4]`,
        output: `[7,0,8]`,
        explanation: `342 + 465 = 807.`,
      },
      {
        input: `l1 = [0], l2 = [0]`,
        output: `[0]`,
        explanation: `0 + 0 = 0.`,
      },
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 ≤ Node.val ≤ 9",
      "It is guaranteed that the list represents a number that does not have leading zeros.",
    ],
    followUp:
      "What if the digits are stored in forward order instead of reverse?",
    starterCode: `/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n * this.val = (val===undefined ? 0 : val)\n * this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nvar addTwoNumbers = function(l1, l2) {\n    // Write your solution here\n    \n};`,
    testCases: [
      { id: 1, input: { s: "()" }, expected: true },
      { id: 2, input: { s: "()[]{}" }, expected: true },
      { id: 3, input: { s: "(]" }, expected: false },
      { id: 4, input: { s: "([)]" }, expected: false },
    ],
  },
};
