import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UsagePage from "./page";

describe("UsagePage", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("renders both Record and Query landmarks", () => {
    render(<UsagePage />);
    expect(screen.getByRole("heading", { name: /Usage metering/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Record usage/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Query usage/i })).toBeInTheDocument();
  });

  it("POSTs to /api/v1/usage and shows the new total on success", async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ agent: "a", serviceId: "s", total: 42 }),
    } as unknown as Response);

    render(<UsagePage />);
    fireEvent.change(screen.getAllByLabelText(/^Agent$/i)[0], { target: { value: "a" } });
    fireEvent.change(screen.getAllByLabelText(/^Service ID$/i)[0], {
      target: { value: "s" },
    });
    fireEvent.change(screen.getByLabelText(/^Requests$/i), { target: { value: "42" } });
    fireEvent.click(screen.getByRole("button", { name: /Record/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/New total: 42/);
    });
  });

  it("surfaces a backend invalid_request as a role=alert", async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "invalid_request", message: "boom" }),
    } as unknown as Response);

    render(<UsagePage />);
    fireEvent.change(screen.getAllByLabelText(/^Agent$/i)[0], { target: { value: "a" } });
    fireEvent.change(screen.getAllByLabelText(/^Service ID$/i)[0], {
      target: { value: "s" },
    });
    fireEvent.change(screen.getByLabelText(/^Requests$/i), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: /Record/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("boom");
    });
  });

  it("does not POST when requests parses to a non-integer", async () => {
    const mockFetch = jest.fn();
    globalThis.fetch = mockFetch as unknown as typeof globalThis.fetch;

    render(<UsagePage />);
    fireEvent.change(screen.getAllByLabelText(/^Agent$/i)[0], { target: { value: "a" } });
    fireEvent.change(screen.getAllByLabelText(/^Service ID$/i)[0], {
      target: { value: "s" },
    });
    // 1.5 is a positive number but not an integer — the component's onRecord
    // guard should set an error and never call fetch. Submitting the form
    // directly bypasses any HTML5 number-input nuance in jsdom.
    const requestsInput = screen.getByLabelText(/^Requests$/i);
    fireEvent.change(requestsInput, { target: { value: "1.5" } });
    const form = requestsInput.closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /requests must be a positive integer/
      );
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
