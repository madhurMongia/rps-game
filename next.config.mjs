/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler : {
            styledComponents: {
                "ssr": true,
                "displayName": true,
                "preprocess": false
            },
    }
};

export default nextConfig;
