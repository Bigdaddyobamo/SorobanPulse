import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "../src/components/EmptyState";

describe("EmptyState", () => {
  it("renders the default message", () => {
    render(<EmptyState />);
    expect(screen.getByText("No events found")).toBeTruthy();
  });

  it("renders a custom message", () => {
    render(<EmptyState message="Custom message" />);
    expect(screen.getByText("Custom message")).toBeTruthy();
  });

  it("renders the action button when provided", async () => {
    const onAction = vi.fn();
    render(<EmptyState message="No data" actionLabel="Clear" onAction={onAction} />);
    const btn = screen.getByText("Clear");
    expect(btn).toBeTruthy();
    await userEvent.click(btn);
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("does not render the action button when not provided", () => {
    render(<EmptyState message="No data" />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});