
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: false,
    webpack: (config) => {
        if (config.optimization.minimizer) {
        config.optimization.minimizer.forEach(minimizer => {
            if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options.terserOptions = {
                ...minimizer.options.terserOptions,
                compress: {
                ...minimizer.options.terserOptions?.compress,
                }
            };
            }
        });
        }
        return config;
    }
}

module.exports = nextConfig
