module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin',
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env', // Imports will come from '@env'
          path: '.env',       // Path to your .env file
          allowUndefined: true, // Optional: Allow undefined variables
        },
      ],
    ],
  };
};
