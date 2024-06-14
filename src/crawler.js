import { JSDOM } from 'jsdom'

function normalizeURL(url) {
    if (url === undefined) {
        throw new ReferenceError("Undefined URL passed to the normalizer!");
    } else if (url === null) {
        throw new ReferenceError("Null URL passed to the normalizer!");
    }
    
    let split_url_str = url.split('://');

    if (split_url_str.length !== 2) {
        throw new TypeError("Invalid URL passed to the normalizer!");
    }

    if (split_url_str[1][split_url_str[1].length - 1] !== '/') {
        split_url_str[1] = split_url_str[1] + '/';
    }
    
    return split_url_str[1];
}

function getURLsFromHTML(htmlBody) {
    if (htmlBody === undefined) {
        throw new ReferenceError("Undefined HTML body passed to the HTML parser!");
    } else if (htmlBody === null) {
        throw new ReferenceError("Null HTML body passed to the HTML parser!");
    }
    
    const dom = new JSDOM(htmlBody);
    const anchorList = dom.window.document.querySelectorAll("a");
    
    let URLs = [];
    for (let anchor of anchorList) {
        URLs.push(anchor.href);
    };

    return URLs;
}

export { normalizeURL, getURLsFromHTML };