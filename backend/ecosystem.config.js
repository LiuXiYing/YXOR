module.exports = {
    apps: [
        {
            name: "yxor-backend",
            script: "./server.js",
            env: {
                NODE_ENV: "production",
                PORT: 3001
            },
            instances: "max",
            exec_mode: "cluster",
            error_file: "./logs/err.log",
            out_file: "./logs/out.log",
            log_file: "./logs/combined.outerr.log",
            time_format: "YYYY-MM-DD HH:mm:ss Z"
        }
    ]
};
