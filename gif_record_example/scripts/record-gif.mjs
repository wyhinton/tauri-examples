import { execa } from 'execa';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_DELAY = 2; // seconds
const DEFAULT_DURATION = 5; // seconds
const DEFAULT_REGION = '0,0,800,600'; // x,y,width,height
const DEFAULT_FPS = '15fps';

async function main() {
  // Parse command-line arguments
  const args = process.argv.slice(2);
  const argMap = {};

  // Parse --key=value arguments
  args.forEach(arg => {
    const match = arg.match(/^--([^=]+)=(.+)$/);
    if (match) {
      argMap[match[1]] = match[2];
    }
  });

  // Non-interactive mode - use command-line args
  const answers = {
    name: argMap.name || 'recording',
    delay: parseInt(argMap.delay || DEFAULT_DELAY),
    duration: parseInt(argMap.duration || DEFAULT_DURATION),
    region: argMap.region || DEFAULT_REGION,
  };

  console.log('🎬 Recording with parameters:');
  console.log(`   Name: ${answers.name}`);
  console.log(`   Delay: ${answers.delay}s`);
  console.log(`   Duration: ${answers.duration}s`);
  console.log(`   Region: ${answers.region}`);

  const name = answers.name;
  const delay = answers.delay;
  const duration = answers.duration;
  const region = answers.region;

  // Output to gif_output folder relative to this script
  const outputDir = path.join(__dirname, 'gif_output');
  const outputPath = path.join(outputDir, `${name}.gif`);

  console.log(`\n⏱ Starting in ${delay}s for ${duration}s...`);
  console.log(`📁 Output: ${outputPath}`);

  await new Promise(r => setTimeout(r, delay * 1000));

  console.log(`\n🎬 Recording: ${name}.gif`);

  // Construct time limit in hh:mm:ss format
  const hh = String(Math.floor(duration / 3600)).padStart(2, '0');
  const mm = String(Math.floor((duration % 3600) / 60)).padStart(2, '0');
  const ss = String(duration % 60).padStart(2, '0');
  const timespan = `${hh}:${mm}:${ss}`;

  try {
    await execa(
      'C:\\Program Files (x86)\\ScreenToGif\\ScreenToGif.exe',
      [
        '-n', // New instance
        '-o',
        's', // Open screen recorder
        '-r',
        region, // Region
        '-f',
        DEFAULT_FPS, // FPS
        '-l',
        timespan, // Duration
        '-c', // Start capture immediately
        '-save',
        outputPath, // Save to specific path
      ],
      { stdio: 'inherit' }
    );

    console.log(`\n✅ Done: ${outputPath}`);
  } catch (err) {
    console.error('❌ Recording failed:');
    console.error(err);
  } 
}

main();
