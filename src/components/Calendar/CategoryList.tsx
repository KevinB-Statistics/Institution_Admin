"use client";

import React from "react";

/**
 * CategoryList renders a simple list of calendar categories with color bullets.
 * This mirrors the "My Calendars" section in the inspiration design and helps
 * users quickly identify the types of events shown in the calendar. While this
 * component does not implement filtering, its presence supports future
 * enhancements such as toggling category visibility.
 *
 * Props:
 * - items: An array of objects with a `label` and `color` property.
 */
export interface CategoryItem {
  label: string;
  color: string;
}

export interface CategoryListProps {
  items: CategoryItem[];
}

export default function CategoryList({ items }: CategoryListProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center">
          <span
            className="inline-block w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-gray-700">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}