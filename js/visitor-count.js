const api = 'https://bpkuubwj5d.execute-api.us-east-1.amazonaws.com/Prod'

const postRequest = async (url, data) => {
    url = `${api}/${url}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
};

const getRequest = async (url) => {
    url = `${api}/${url}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': api
        }
    });
    return response.json();
};

const main = () => {
    window.addEventListener('load', async () => {
        if (window.location.pathname === '/') {
            console.log('hit the root');
            // Call API to add one visitor to root page count
            let currentCount = await getRequest('root');
            console.log(`You are vistor #${currentCount}!`);
            currentCount++;
            await postRequest('root', {ViewCount: currentCount});
        } else if (window.location.pathname === '/web-resume.html') {
            console.log('hit the resume');
            // Call API to add one visitor to resume page count
        }
    });
}

main();