// https://example.com/callback?code=...&state=...
const processURL = url => {
    const queries = {}
    url.indexOf('?') !== -1 && url.substring(url.indexOf('?') + 1)
        .split('&')
        .map(queryString => {
            const [key, val] = queryString.split('=');
            queries[key] = decodeURIComponent(val);
        });
    return queries;
}

export default processURL;