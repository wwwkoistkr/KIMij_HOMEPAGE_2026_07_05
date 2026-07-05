module.exports = {
  apps: [
    {
      name: 'kns-global',
      script: 'npx',
      args: 'wrangler dev --port 3000 --ip 0.0.0.0 --local',
      cwd: '/home/user/webapp',
      env: { NODE_ENV: 'development' },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
};
