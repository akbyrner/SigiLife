module.exports = {
  apps: [
    {
      name: 'sigilife',
      script: 'dist/server/index.js',
      cwd: '/home/ec2-user/SigiLife',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'mysql://root:root:tuple12%21%23@sigilife.cpoei0kow51s.us-east-2.rds.amazonaws.com:3306/sigilife_prod',
        SESSION_SECRET: '6133ae4665471824739d603404026ce263db3af3805d0530e44d10ea8eabe5d0',
      }
    }
  ]
};