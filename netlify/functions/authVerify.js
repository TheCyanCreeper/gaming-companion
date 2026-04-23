export const handler = async (event) => {
    const queryParams = event.queryStringParameters;
    const verifyParams = new URLSearchParams(queryParams);
    verifyParams.set('openid.mode', 'check_authentication');

    try {
        const verifyResponse = await fetch('https://steamcommunity.com/openid/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: verifyParams.toString(),
        });

        const verificationText = await verifyResponse.text();

        if (verificationText.includes('is_valid:true')) {
            const claimedId = queryParams['openid.claimed_id'];
            const steamId = claimedId.split('/').pop(); 

            return {
                statusCode: 302,
                headers: {
                    Location: `/?login_success=${steamId}`,
                },
            };
        } else {
            return {
                statusCode: 302,
                headers: { Location: '/?login_error=true' },
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 302,
            headers: { Location: '/?login_error=true' },
        };
    }
};