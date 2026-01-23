const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: false, // 如果使用 SWC
    // 或者配置 webpack 的 Terser
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
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, 'src'),
        };
        return config;
    }
}

module.exports = nextConfig
