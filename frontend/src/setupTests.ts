/**
 * テストセットアップファイル
 */

import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock fetch for API tests
Object.defineProperty(globalThis, "fetch", {
  value: vi.fn(),
  writable: true,
});

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
});
