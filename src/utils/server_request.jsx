export const server_request = async (endpoint, method = 'GET', data) => {
    const server_uri = window.env.server_uri;
    const response =
        method.toUpperCase() === 'GET' ?
            await fetch(
                server_uri + endpoint,
                {
                    method: method
                }
            ) :
            await fetch(
                server_uri + endpoint,
                {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data || '')
                }
            );
    return await response.json();
};