import { validateEmail, generateId, shortenString } from "./utils";
import faker from "@faker-js/faker";

describe("validateEmai", () => {
  test("returns false for non-emails", () => {
    expect(validateEmail(undefined)).toBe(false);
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail("")).toBe(false);
    expect(validateEmail("not-an-email")).toBe(false);
    expect(validateEmail("n@")).toBe(false);
  });

  test("returns true for emails", () => {
    expect(validateEmail("kody@example.com")).toBe(true);
  });
});

describe("generateId", () => {
  test("returns random id", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).toBeTypeOf("string");
    expect(id2).toBeTypeOf("string");
    expect(id1).not.toEqual(id2);
  });

  test("returns the same id when seeded", () => {
    const seed = generateId(faker.random.word());
    expect(generateId(seed)).toEqual(generateId(seed));
  });
});

describe("shortenString", () => {
  test("shorten long string", () => {
    const str = faker.random.alphaNumeric(100);
    const short = shortenString(str, 20);
    expect(short.shortened).toHaveLength(20);
    expect(short.isShortened).toBe(true);
    expect(short.shortened.endsWith("...")).toBe(true);
  });

  test("not shorten short string", () => {
    const str = faker.random.alphaNumeric(10);
    const short = shortenString(str, 20);
    expect(short.shortened).toEqual(str);
    expect(short.isShortened).toBe(false);
  });

  test("not shorten string when no max length", () => {
    const str = faker.random.alphaNumeric(100);
    const short = shortenString(str);
    expect(short.shortened).toBe(str);
    expect(short.isShortened).toBe(false);
  });

  test("can use different indicator", () => {
    const str = faker.random.alphaNumeric(100);
    const short = shortenString(str, 20, "-");
    expect(short.shortened.endsWith("-")).toBe(true);
    expect(short.shortened).toHaveLength(20);
  });
});
