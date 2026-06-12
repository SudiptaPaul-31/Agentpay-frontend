import { act, render } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

function Probe({ value, delay, onChange }: { value: string; delay: number; onChange: (v: string) => void }) {
  const debounced = useDebounce(value, delay);
  onChange(debounced);
  return null;
}

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const cb = jest.fn();
    render(<Probe value="a" delay={100} onChange={cb} />);
    expect(cb).toHaveBeenLastCalledWith("a");
  });

  it("debounces subsequent updates", () => {
    const cb = jest.fn();
    const { rerender } = render(<Probe value="a" delay={300} onChange={cb} />);
    rerender(<Probe value="b" delay={300} onChange={cb} />);
    expect(cb).not.toHaveBeenLastCalledWith("b"); // still showing previous
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(cb).toHaveBeenLastCalledWith("b");
  });
});
