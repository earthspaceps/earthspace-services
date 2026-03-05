const { spawnSync } = require('child_process');
const path = require('path');

const clientDir = path.join(__dirname, 'client');
const viteJs = path.resolve(clientDir, 'node_modules', 'vite', 'bin', 'vite.js');

try {
    console.log('🚀 Starting client build (Shell-less) in:', clientDir);
    const result = spawnSync('node', [viteJs, 'build'], {
        cwd: clientDir,
        stdio: 'inherit'
    });

    if (result.status !== 0) {
        throw new Error(`Process exited with code ${result.status}`);
    }
    console.log('✅ Build successful!');
} catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
}
