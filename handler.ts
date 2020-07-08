exports.handler = async function (event: any) {
    console.log('request:', JSON.stringify(event, undefined, 2));
    const current_time = Date.now().toLocaleString();
    const body = {
        message: `Hello, the current time is ${current_time}`,
    };
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(body),
    };
};
