import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { PRODUCTS } from "@/lib/catalog";
import { MAX_COMPARE, ShopperProvider, useShopper } from "@/lib/shopper";

const wrapper = ShopperProvider;
const hs = PRODUCTS.slice(0, 5).map((p) => p.h);

describe("vergelijken en eerder bekeken", () => {
  beforeEach(() => localStorage.clear());

  it("laat maximaal 3 producten toe in de vergelijking", () => {
    const { result } = renderHook(() => useShopper(), { wrapper });
    act(() => void result.current.toggleCompare(hs[0]!));
    act(() => void result.current.toggleCompare(hs[1]!));
    act(() => void result.current.toggleCompare(hs[2]!));
    let added = true;
    act(() => {
      added = result.current.toggleCompare(hs[3]!);
    });
    expect(added).toBe(false);
    expect(result.current.compare).toHaveLength(MAX_COMPARE);
    act(() => void result.current.toggleCompare(hs[0]!));
    expect(result.current.inCompare(hs[0]!)).toBe(false);
  });

  it("onthoudt recent bekeken producten, nieuwste eerst, zonder dubbelen", () => {
    const { result } = renderHook(() => useShopper(), { wrapper });
    act(() => result.current.markViewed(hs[0]!));
    act(() => result.current.markViewed(hs[1]!));
    act(() => result.current.markViewed(hs[0]!));
    expect(result.current.recent).toEqual([hs[0], hs[1]]);
  });
});
