const path = require('path');
const { execSync } = require('child_process');

const triggerFileName = process.argv[2];

if (!triggerFileName) {
  console.error('Error: Please provide the file name (e.g., "npm run db:setup-trigger example.trigger.ts").');
  process.exit(1);
}

// we should replace the ' ' characters to '\ ', and we should use double \\ two actually says we want to keep one '\'
const cur_dirname = __dirname.replaceAll(' ', '\\ ');
const triggerFilePath = path.resolve(cur_dirname, '../triggers', triggerFileName);

try {
  execSync(`npx ts-node ${triggerFilePath}`, { stdio: 'inherit' });
  console.log(`Setup Trigger in file path "${triggerFilePath}" successfully.`);
} catch (error) {
  console.error(`Failed to execute trigger in file path "${triggerFilePath}".`);
  console.error(error.message);
  process.exit(1);
}