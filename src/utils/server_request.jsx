export const server_request = async (endpoint, method = 'GET', data) => {
    const server_url = window.env.server_url;
    const response =
        method.toUpperCase() === 'GET' ?
            await fetch(
                server_url + endpoint,
                {
                    method: method
                }
            ) :
            await fetch(
                server_url + endpoint,
                {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data || '')
                }
            );
    return await response.json();
}