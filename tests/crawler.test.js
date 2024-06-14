import { test, expect } from "@jest/globals";
import { normalizeURL, getURLsFromHTML } from "../src/crawler.js";
// These tests are broken btw
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
    ];

    for (let invalidURL of invalidURLs) {
        expect(() => {normalizeURL(invalidURL)}).toThrow(TypeError('Invalid URL passed to the normalizer!'));
    };
});

test('normalizeURL throws ReferenceError for null and undefined URL', () => {
    expect(() => {normalizeURL(null)}).toThrow(ReferenceError('Null URL passed to the normalizer!'));
    expect(() => {normalizeURL(undefined)}).toThrow(ReferenceError('Undefined URL passed to the normalizer!'));
});


test('getURLsFromHTML throws ReferenceError for null and undefined HTML body', () => {
    expect(() => {getURLsFromHTML(null)}).toThrow(ReferenceError('Null HTML body passed to the HTML parser!'));
    expect(() => {getURLsFromHTML(undefined)}).toThrow(ReferenceError('Undefined HTML body passed to the HTML parser!'));
});

test('getURLsFromHTML correctly extracts href properties from all anchor elements in HTML body', () => {
    const validHTMLBodies = [
  `<body><a href="https://www.example.com">Link Text</a></body>`,
  `<body><a href="https://www.example.com/page1">Page 1</a><a href="https://www.another.com/page2">Page 2</a><a href="http://localhost:3000/internal">Internal Link</a></body>`,
  `<body><a href="">Empty Link</a></body>`,
  `<body><a>Missing Href</a></body>`,
  `<body><a href="https://www.example.com/page#fragment">Link to Fragment</a></body>`,
  `<body><a href="mailto:someone@example.com">Contact Us</a></body>`,
  `<body><a href="./relative/path.html">Relative Link</a></body>`,
  `<body><p>This is a paragraph with an <a href="https://www.example.com/nested">anchor inside</a>.</p></body>`,
  `<body><a href="https://www.example.com" disabled>Disabled Link</a></body>`,
  `<html></html>`,
  ];
  const resultsForHTMLBodies = [
    ['https://www.example.com/'],
    ['https://www.example.com/page1', 'https://www.another.com/page2', 'http://localhost:3000/internal'],
    [''],
    [''],
    ['https://www.example.com/page#fragment'],
    ['mailto:someone@example.com'],
    ['./relative/path.html'],
    ['https://www.example.com/nested'],
    ['https://www.example.com/'],
    []
  ];
  for (let i = 0; i < validHTMLBodies.length; i++) {
    const received_val = getURLsFromHTML(validHTMLBodies[i]);
    const expected_val = resultsForHTMLBodies[i];
    expect(received_val).toEqual(expected_val);
  };
});