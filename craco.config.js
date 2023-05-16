const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@root': path.resolve(__dirname, 'src')
        },
    },
    typescript: {
        enableTypeChecking: true /* (default value) */,
    },
};
