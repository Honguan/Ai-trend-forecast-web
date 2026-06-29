import test from "node:test";
import assert from "node:assert/strict";
import { popularInstruments } from "../lib/instruments";
import type { AssetType } from "../lib/types";

const assetTypes: AssetType[] = ["stock", "etf", "index", "forex", "crypto", "metal", "commodity"];

test("popular instruments include every supported asset type", () => {
  const present = new Set(popularInstruments.map((instrument) => instrument.assetType));
  for (const assetType of assetTypes) assert.equal(present.has(assetType), true);
});

test("popular instruments have unique symbols and required fields", () => {
  const symbols = new Set<string>();
  for (const instrument of popularInstruments) {
    assert.ok(instrument.symbol);
    assert.ok(instrument.name);
    assert.ok(instrument.group);
    assert.equal(symbols.has(instrument.symbol), false);
    symbols.add(instrument.symbol);
  }
});
