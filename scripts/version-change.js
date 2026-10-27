import fs from 'fs'
import child_process from 'child_process';

let prototypePatchNotes = "";
let prototypeReleaseNotes = "";
let packageJsonPath = "package.json"
let packageLockJsonPath = "package-lock.json"
let moduleJsonPath = "src/module.json"
let releaseNotesPath = "src/release-notes.md"
let patchNotesPath = "src/patch-notes.md"

let version = process.argv[2];
if (!version) {
    const branch = child_process.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    version = branch.substring(branch.indexOf("-") + 1);
    console.log(`Modifying version to: ${version}`);
}

let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
packageJson.version = version;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, undefined, "    "));

let packageLockJson = JSON.parse(fs.readFileSync(packageLockJsonPath, "utf8"));
packageLockJson.version = version;
packageLockJson.packages[""].version = version;
fs.writeFileSync(packageLockJsonPath, JSON.stringify(packageLockJson, undefined, "\t"));

let moduleJson = JSON.parse(fs.readFileSync(moduleJsonPath, "utf8"));
moduleJson.version = version;
// Derive owner/repo from the origin remote so forks publish to their own releases
const originUrl = child_process.execSync('git remote get-url origin').toString().trim();
const repoPath = originUrl.replace(/^.*github\.com[:/]/, "").replace(/\.git$/, "");
let moduleDownloadLink = `https://github.com/${repoPath}/releases/download/release-${version}/cosmere-automated-actions-release-${version}.zip`
moduleJson.download = moduleDownloadLink;
fs.writeFileSync(moduleJsonPath, JSON.stringify(moduleJson, undefined, "    "));