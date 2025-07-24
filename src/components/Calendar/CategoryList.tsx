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
  /**
   * When set to true a checkbox will appear before each category label.  This
   * mirrors the interactive checkbox list seen in the inspiration designs
   * where users can toggle individual calendars on or off.  The checkboxes
   * are uncontrolled – they are checked by default but do not persist state.
   */
  showCheckbox?: boolean;
}

export default function CategoryList({ items, showCheckbox = false }: CategoryListProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center space-x-2">
          {showCheckbox && (
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          )}
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-gray-700">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}