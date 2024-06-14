import { JSDOM } from 'jsdom'

function normalizeURL(url) {
    if (url === undefined) {
        throw new ReferenceError("Undefined URL passed to the normalizer!");
    } else if (url === null) {
        throw new ReferenceError("Null URL passed to the normalizer!");
    }
    
    let split_url_str = url.split('://');

    if (split_url_str.length < 2) {
        if (split_url_str[0][split_url_str[0].length - 1] != '/') {
            return split_url_str[0] + '/';
        }
        return split_url_str[0];
    }

    if (split_url_str[1][split_url_str[1].length - 1] !== '/') {
        split_url_str[1] = split_url_str[1] + '/';
    }
    
    return split_url_str[1];
}

function getURLsFromHTML(htmlBody, base_url) {
    if (htmlBody === undefined) {
        throw new ReferenceError("Undefined HTML body passed to the HTML parser!");
    } else if (htmlBody === null) {
        throw new ReferenceError("Null HTML body passed to the HTML parser!");
    }
    
    const dom = new JSDOM(htmlBody);
    const anchorList = dom.window.document.querySelectorAll("a");
    
    let URLs = [];
    for (let anchor of anchorList) {
        const href = anchor.href;
        const is_relative_url = (!href.includes('https:') && !href.includes('http:') && !base_url.includes(href)) || href == '/';  
        if (is_relative_url) {
            if (base_url[base_url.length - 1] == '/' && href[0] == '/') {
                URLs.push(base_url + href.slice(1));
            } else if (base_url[base_url.length - 1] == '/' && href[0] != '/') {
                URLs.push(base_url + href);
            } else if (base_url[base_url.length - 1] != '/' && href[0] == '/') {
                URLs.push(base_url + href);
            } else {
                URLs.push(base_url + '/' + href);
            }
            continue;
        }
        URLs.push(href);
    };
    return URLs;
}

export { normalizeURL, getURLsFromHTML };