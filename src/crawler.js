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

export { normalizeURL };