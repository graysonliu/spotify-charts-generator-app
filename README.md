![](https://github.com/graysonliu/spotify-charts-generator-static/workflows/build/badge.svg)

https://graysonliu.github.io/spotify-charts-generator-static/

# spotify-charts-generator-static

This is a Spotify web app purely hosted on Github Pages. It can help you create playlists based on daily charts from [Spotify Charts](https://spotifycharts.com).

Since Github Pages is purely static and this web app has no back end, necessary information like client secret can only be obtained from the web app itself at runtime. Therefore, we injected those information into the web page at build time using [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin):

```js
plugins: [
    ...
    new HtmlWebpackPlugin({
        template: "./src/template.ejs",
        ...
        // inject environment variables into pages at build time
        window: {
            env: {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                redirect_uri: process.env.REDIRECT_URL,
                scopes: process.env.SCOPES,
                charts: charts
            }
        }
        ...
    }),
    ...
]
```
Also, because of denied access in CORS policy of [Spotify Charts](https://spotifycharts.com), we cannot get charts data at runtime, meaning that charts data should also be injected into the page at build time. To make sure that we have the latest charts data, this app will be rebuilt every 6 hours as scheduled in Github Actions. Overall, we provide four environment variables at build time that will be injected into the web page, as well as the charts data that is fetched by [pre_build.js](https://github.com/graysonliu/spotify-charts-generator-static/blob/master/pre_build.js).

The injection is achieved by following snippet in [template.ejs](https://github.com/graysonliu/spotify-charts-generator-static/blob/master/src/template.ejs):

```html
<!-- inject environment variables into pages at build time -->
<script type="text/javascript">
    <% for (key in htmlWebpackPlugin.options.window) { %>
    window['<%= key %>'] = <%= JSON.stringify(htmlWebpackPlugin.options.window[key]) %>;
    <% } %>
</script>
```

**Warning**

The client secret of a Spotify Web App is **not** supposed to be exposed, but it is exposed in this app because the only way to get the client secret in this purely static app is to inject it into the web page. In practice, we should have a back end that handles the authorization process.
