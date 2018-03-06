const path = require('path');
const {
    spawn,
    fork,
} = require('child_process');
const fs = require('fs');

const nodeModulesBin = `${__dirname}/../node_modules/.bin/`;
let httpServerBin = 'http-server.cmd';
// if (fs.statSync(httpServer))
try {
    fs.statSync(nodeModulesBin + httpServerBin)
} catch (e) {
    httpServerBin = 'http-server';
}

const httpServer = spawn(httpServerBin, [`${__dirname}/../public`, '-c-1'], {
    cwd: nodeModulesBin,
});

httpServer.stdout.on('data', function (data) {
    process.stdout.write(data);
});

httpServer.stderr.on('data', function (data) {
    process.stderr.write(data);
});

httpServer.on('exit', function (code) {
    console.log('HTTP server process exited with code ' + code.toString());
});


class Watcher {
    constructor(path) {
        this.path = path;
        this.lastFiles = {};
        this.lastCount = 0;
    }

    run(callback) {
        const paths = [this.path];
        const currentFiles = {};
        let currentCount = 0;
        while (paths.length) {
            const path = paths.shift();
            const files = fs.readdirSync(path);
            let i = files.length;
            while (i--) {
                const file = `${path}/${files[i]}`
                const stat = fs.lstatSync(file);
                if (stat.isDirectory()) {
                    paths.push(file)
                } else {
                    currentFiles[file] = stat.mtime.getTime();
                    currentCount++;
                }
            }
        }
        if (currentCount != this.lastCount) {
            callback();
        } else {
            for (const key in currentFiles) {
                if (this.lastFiles[key] != currentFiles[key]) {
                    callback();
                    break;
                }
            }
        }
        this.lastFiles = currentFiles;
        this.lastCount = currentCount;
        setTimeout(() => {
            this.run(callback);
        }, 100);
    }
}
let gameServer;
const spawnGameServer = () => {
    if (gameServer) {
        gameServer.kill();
    }
    gameServer = fork(`${__dirname}/server/main.js`);

    gameServer.on('error', function (data) {
        console.log('Game server error', data);
    });

    gameServer.on('exit', function (code) {
        console.log('Game server process exited with code', code);
    });
}

new Watcher(__dirname).run(() => {
    spawnGameServer();
});

process.on('SIGINT', () => {
    if (gameServer) {
        gameServer.kill();
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    if (gameServer) {
        gameServer.kill();
    }
    process.exit(0);
});

process.on('exit', () => {
    if (gameServer) {
        gameServer.kill();
    }
    process.stdout.write('Exiting...\n\n');
});