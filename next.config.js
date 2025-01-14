// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ["pdf-parse"],
    },
    webpack: (config, { isServer }) => {
      // If it's server-side code (API routes), exclude onnxruntime-node from Webpack bundling
      if (isServer) {
        config.externals.push('onnxruntime-node');
      }
  
      // Add a rule for handling .node files using node-loader
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader', // Ensure Webpack knows how to handle .node files
      });
  
      return config;
    },
  };
  
  module.exports = nextConfig;

//   /** @type {import('next').NextConfig} */
// const nextConfig = {
//     experimental: {
//       serverComponentsExternalPackages: ["pdf-parse", "@huggingface/transformers"],
//     },
//     webpack: (config, { isServer }) => {
//       // Handle client-side bundling
//       if (!isServer) {
//         config.resolve.fallback = {
//           ...config.resolve.fallback,
//           "onnxruntime-node": false,
//           "pdf-parse": false,
//         };
//       } else {
//         // Server-side externals
//         config.externals.push('onnxruntime-node');
//       }
  
//       // Add rule for .node files
//       config.module.rules.push({
//         test: /\.node$/,
//         use: 'node-loader',
//         type: 'javascript/auto',
//       });
  
//       return config;
//     },
//     // Add this to help with the micromatch error
//     pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
//   };
  
//   module.exports = nextConfig;