import { test, expect } from "@jest/globals";
import { normalizeURL } from "../src/crawler.js";

test('normalizeURL correctly extracts domain + path from valid URL', () => {
    const validURLs = [
        'https://blog.boot.dev/path/',
        'https://blog.boot.dev/path',
        'http://blog.boot.dev/path/',
        'http://blog.boot.dev/path'
    ];

    const correctResult = 'blog.boot.dev/path/';

    for (let validURL of validURLs) {
        expect(normalizeURL(validURL)).toBe(correctResult);
    };
    
});

test('normalizeURL throws TypeError for invalid URL', () => {
    const invalidURLs = [
        'asfagdsqewewrqwrq',
        '',
        'test://this.is.a.test.url://testing.com'
    ];

    for (let invalidURL of invalidURLs) {
        expect(() => {normalizeURL(invalidURL)}).toThrow(TypeError('Invalid URL passed to the normalizer!'));
    };
});

test('normalizeURL throws ReferenceError for null and undefined URL', () => {
    expect(() => {normalizeURL(null)}).toThrow(ReferenceError('Null URL passed to the normalizer!'));
    expect(() => {normalizeURL(undefined)}).toThrow(ReferenceError('Undefined URL passed to the normalizer!'));
})