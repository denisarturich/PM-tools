// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "pm-tools",
      script: "dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      },
      env_production: {
        NODE_ENV: "production",
        PORT: "3000"
      },
      // Restart policy
      max_restarts: 10,
      min_uptime: "10s",
      // Logging
      log_file: "logs/pm2.log",
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      // Memory and performance
      max_memory_restart: "1G",
      // Health monitoring
      kill_timeout: 3000
    }
  ]
};