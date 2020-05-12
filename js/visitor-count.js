

const main = () => {
    const api = 'https://bpkuubwj5d.execute-api.us-east-1.amazonaws.com/Prod/page';

    const putRequest = async (url, data) => {
        url = `${api}/${url}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    };

    const getRequest = async (url) => {
        url = `${api}/${url}`;
        console.log(`URL: ${url}`);
        const response = await fetch(url, {
            method: 'GET'
        });
        return response.json();
    };
    window.addEventListener('load', async () => {
        if (window.location.pathname === '/') {
            // Call API to add one visitor to root page count
            let currentCount = await getRequest('root');
            console.log(`You are vistor #${currentCount}!`);
            currentCount++;
            await putRequest('root', { ViewCount: currentCount });
        } else if (window.location.pathname === '/web-resume.html') {
            // Call API to add one visitor to resume page count
            let currentCount = await getRequest('resume');
            console.log(`You are vistor #${currentCount}!`);
            currentCount++;
            await putRequest('resume', { ViewCount: currentCount});
        }
    });
}

main();