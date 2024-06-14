import { normalizeURL, getURLsFromHTML } from './src/crawler.js';


async function main() {
    const cli_args = process.argv.slice(2);
    if (cli_args.length !== 1) {
        throw new Error("Invalid set of args for crawler, just enter the base URL");
    } 
    const base_url = cli_args[0];
    console.log(`Starting to crawl ${base_url}...`);
    
    let allEmbeddedPages;
    try {
        allEmbeddedPages = await crawlPage(base_url, base_url, {});
    } catch(err) {
        console.log(`An error occured while fetching the webpage ${base_url}.\n${err.message}`);
    }
    printReport(allEmbeddedPages);
    
}

main();

async function crawlPage(base_url, current_url, pages) {
    
    const normalizedCurrentURL = normalizeURL(current_url);
    const normalizedBaseURL = normalizeURL(base_url);
    
    if (!normalizedCurrentURL.includes(normalizedBaseURL)) {
        return pages;
    }
    if (pages[normalizedCurrentURL] !== undefined) {
        pages[normalizedCurrentURL]++;
        return pages;
    }
    else {
        pages[normalizedCurrentURL] = 1;
    }
    
    console.log(`Crawling ${current_url}...`);
    const response = await fetch(current_url);
    const responseContentType = response.headers.get('Content-Type').split(';')[0];
    if (response.status >= 400) {
        console.log(`${response.status} raised by the HTTP request to ${current_url}!`);
        return pages;
    }
    if (responseContentType !== 'text/html') {
        console.log(`NotSupportedError from ${current_url} ==> HTML bodies with content type ${responseContentType} aren't supported.`);
        return pages;
    }

    const responseText = await response.text();
    const child_urls = getURLsFromHTML(responseText, base_url);
    for (let child_url of child_urls) {
        await crawlPage(current_url, child_url, pages);
    }
    return pages;
}


function printReport(pages) {

    let sortable = [];
    for (let page in pages) {
        sortable.push([page, pages[page]]);
    }
    
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });

    console.log('========REPORT=======');
    for (let item of sortable) {
        console.log(`**-- Found ${item[1]} internal links to ${item[0]}`)
    }
}
