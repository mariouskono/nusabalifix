const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Path = require('path');
const { spawn } = require('child_process');

async function getRekomendasiFromPython(kategori, kabupaten_kota, rating_min, top_n=20) {
  return new Promise((resolve, reject) => {
    const input = JSON.stringify({ kategori, kabupaten_kota, rating_min, top_n });

    // Try multiple Python executables for better compatibility
    const pythonExecutables = ['python3', 'python', '/usr/local/bin/python3', '/usr/bin/python3'];
    let pythonCmd = 'python3'; // Default to python3
    
    // Check which python executable is available
    for (const cmd of pythonExecutables) {
      try {
        require('child_process').execSync(`which ${cmd}`, { stdio: 'ignore' });
        pythonCmd = cmd;
        console.log(`Using Python executable: ${pythonCmd}`);
        break;
      } catch (e) {
        // Continue to next executable
      }
    }

    // Correct the path to recomendation.py - it should be in the same directory as server.js
    const scriptPath = Path.join(__dirname, 'recomendation.py');
    console.log(`Attempting to run: ${pythonCmd} ${scriptPath}`);

    const py = spawn(pythonCmd, [scriptPath], { 
      cwd: __dirname, // Change from ../backend to current directory
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdoutData = '';
    let stderrData = '';

    py.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    py.stderr.on('data', (chunk) => {
      stderrData += chunk.toString();
      console.warn('[PY WARNING]', chunk.toString());
    });

    py.on('error', (error) => {
      console.error('Python process error:', error);
      reject({ error: `Python execution failed: ${error.message}`, log: stderrData });
    });

    py.on('close', (code) => {
      console.log(`Python process exited with code: ${code}`);
      if (code !== 0) {
        reject({ error: `Python script exited with code ${code}`, log: stderrData || stdoutData });
        return;
      }

      try {
        const lines = stdoutData.trim().split('\n');
        let result;
        for (let i = lines.length - 1; i >= 0; i--) {
          try {
            result = JSON.parse(lines[i]);
            break;
          } catch {}
        }
        if (result !== undefined) {
          resolve(result);
        } else {
          reject({ error: 'Gagal parsing hasil rekomendasi.', log: stderrData || stdoutData });
        }
      } catch (e) {
        reject({ error: 'Gagal parsing hasil rekomendasi.', log: stderrData || stdoutData });
      }
    });

    py.stdin.write(input);
    py.stdin.end();
  });
}

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080, // Changed from 3000 to 8080 to match your setup
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*']
      },
      files: {
        relativeTo: Path.join(__dirname, '../frontend')
      }
    }
  });

  await server.register(Inert);

  // Add a health check endpoint
  server.route({
    method: 'GET',
    path: '/health',
    handler: async (request, h) => {
      return h.response({ status: 'OK', timestamp: new Date().toISOString() }).code(200);
    }
  });

  server.route({
    method: 'POST',
    path: '/rekomendasi',
    handler: async (request, h) => {
      const { kategori, kabupaten_kota, rating_min, top_n } = request.payload;

      console.log(`Menerima request: kategori=${kategori}, kabupaten_kota=${kabupaten_kota}, rating_min=${rating_min}, top_n=${top_n}`);

      try {
        const rekomendasi = await getRekomendasiFromPython(
          kategori,
          kabupaten_kota,
          rating_min,
          top_n || 20
        );
        return h.response(rekomendasi).code(200);
      } catch (error) {
        console.error('Error in /rekomendasi handler:', error);
        return h.response({ 
          message: 'Terjadi kesalahan dalam memproses rekomendasi.',
          error: error.error || error.message,
          details: error.log || ''
        }).code(500);
      }
    }
  });

  await server.start();
  console.log('✅ Server running at:', server.info.uri);
};

// Handle uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

init();