// lib/course-utils.js

/**
 * Converts a string to a URL-friendly slug.
 * - Lowercases the string
 * - Removes special characters
 * - Replaces spaces and multiple hyphens with single hyphens
 * - Trims leading/trailing hyphens
 * @param {string} str - The string to slugify
 * @returns {string} The slugified string
 */
export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
}
