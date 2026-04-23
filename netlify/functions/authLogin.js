export const handler = async (event) => {
    const host = event.headers.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const realm = `${protocol}://${host}`;
    const returnTo = `${realm}/.netlify/functions/authVerify`;

    const params = new URLSearchParams({
        'openid.ns': 'http://specs.openid.net/auth/2.0',
        'openid.mode': 'checkid_setup',
        'openid.return_to': returnTo,
        'openid.realm': realm,
        'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    });

    return {
        statusCode: 302,
        headers: {
            Location: `https://steamcommunity.com/openid/login?${params.toString()}`,
        },
    };
};