export default {
    root: '.',
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: 'index.html',
          map: 'map.html',
          driverStats: 'driverWithStats.html',
        },
      },
    },
  };
  