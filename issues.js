const fs = require('fs')
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
	auth: process.env.GITHUB_KEY
})

const fetchContents = fs.readFileSync('./templates/fetch.md', 'utf8');
const parseContents = fs.readFileSync('./templates/normalize.md', 'utf8');
const normalizeContents = fs.readFileSync('./templates/parse.md', 'utf8');


const user = process.env.GH_USER
const repo = process.env.REPO

async function createFetchIssue(runnerPath, url) {
	console.log(`Creating fetch issue for ${runnerPath}...`)
	const issue = await octokit.rest.issues.create({
		owner: user,
		repo: repo,
		title: `fetch ${runnerPath}`,
		body: fetchContents.replace(/\[url\]/g, url).replace(/\[runnerPath\]/g, runnerPath),
		labels: ['runner/fetch']
	})
	return issue.data.number
}

async function createParseIssue(runnerPath, blockedBy) {
	console.log(`Creating parse issue for ${runnerPath}...`)
	const issue = await octokit.rest.issues.create({
		owner: user,
		repo: repo,
		title: `parse ${runnerPath}`,
		body: parseContents.replace(/\[runnerPath\]/g, runnerPath).replace(/\[issueNumber\]/g, blockedBy),
		labels: ['runner/parse']
	})
	return issue.data.number
}

async function createNormalizeIssue(runnerPath, blockedBy) {
	console.log(`Creating normalize issue for ${runnerPath}...`)
	const issue = await octokit.rest.issues.create({
		owner: user,
		repo: repo,
		title: `normalize ${runnerPath}`,
		body: normalizeContents.replace(/\[runnerPath\]/g, runnerPath).replace(/\[issueNumber\]/g, blockedBy),
		labels: ['runner/normalize']
	})
	return issue.data.number
}

module.exports = {
	createFetchIssue: createFetchIssue,
	createParseIssue: createParseIssue,
	createNormalizeIssue: createNormalizeIssue
}