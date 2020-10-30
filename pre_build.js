const fetch = require('node-fetch');
const cheerio = require('cheerio');

const fetch_charts = async () => {
    const charts = [];
    const response = await fetch('https://spotifycharts.com/');
    if (!response.ok) {
        throw new Error("Cannot get country list.");
    }
    const body = await response.text();
    const $ = cheerio.load(body);
    const country_list = $('div.responsive-select[data-type=country] ul li');
    for (let i = 0; i < country_list.length; i++) {
        const li = country_list.eq(i);
        const country_code = li.data('value');
        const country_name = li.text();
        const tracks = []
        // const chart_url = `https://spotifycharts.com/regional/${country_code}/daily/latest`
        // const chart_res = await fetch(chart_url);
        // if (!chart_res.ok) {
        //     console.log(`Cannot get chart for ${country_name}`);
        //     continue
        // }
        // const chart_page = await chart_res.text();
        // const chart_page_query = cheerio.load(chart_page);
        // const track_list = chart_page_query('.chart-table-image a');
        // track_list.each(function (i, element) {
        //     // do not use arrow function here
        //     // pay attention to 'this' when using arrow function
        //     tracks.push(chart_page_query(this).attr('href').split('/').pop());
        // })
        // console.log(`${country_name} Done`);
        charts.push([country_code, country_name, tracks]);
    }
    return charts;
}
module.exports.fetch_charts = fetch_charts;