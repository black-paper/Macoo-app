/**
 * Buttonコンポーネントのテスト
 */

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button from "../Button";

describe("Button", () => {
  it("正しくレンダリングされる", () => {
    const { getByRole } = render(<Button>テストボタン</Button>);
    expect(getByRole("button")).toHaveTextContent("テストボタン");
  });

  it("onClick ハンドラーが呼ばれる", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const { getByRole } = render(
      <Button onClick={handleClick}>クリック</Button>
    );

    await user.click(getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("disabled 状態で動作する", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const { getByRole } = render(
      <Button onClick={handleClick} disabled>
        無効ボタン
      </Button>
    );

    const button = getByRole("button");
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("variant に応じて適切なスタイルが適用される", () => {
    const { rerender, getByRole } = render(
      <Button variant="primary">Primary</Button>
    );
    expect(getByRole("button")).toHaveClass("bg-primary-600");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(getByRole("button")).toHaveClass("bg-gray-200");

    rerender(<Button variant="outline">Outline</Button>);
    expect(getByRole("button")).toHaveClass("border-2", "border-primary-600");
  });

  it("size に応じて適切なスタイルが適用される", () => {
    const { rerender, getByRole } = render(<Button size="sm">Small</Button>);
    expect(getByRole("button")).toHaveClass("px-3", "py-1");

    rerender(<Button size="lg">Large</Button>);
    expect(getByRole("button")).toHaveClass("px-8", "py-4");
  });
});
