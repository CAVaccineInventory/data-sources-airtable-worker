require("dotenv").config();

const AirtablePlus = require("airtable-plus");
const issues = require('./issues')


const airtable = new AirtablePlus({
	baseID: process.env.AIRTABLE_BASE,
	apiKey: process.env.AIRTABLE_KEY,
	tableName: "Data Sources",
});

async function createIssues() {
	console.log('Starting create issues task...')

	const approvedRecords = await airtable.read({
		filterByFormula: 'Stage = "Approved"'
	})

	approvedRecords.forEach(async (r) => {
		let fields = r.fields

		let banned_fields = ['fetch_issue_id', 'parse_issue_id', 'normalize_issue_id']
		let required_fields = ['Runner Path', 'Source Link']

		for (const field of banned_fields) {
			if (fields.hasOwnProperty(field)) {
				console.log(`Record ${r.id} already has field ${field}, bailing!`)
				return
			}
		}

		for (const field of required_fields) {
			if (!fields.hasOwnProperty(field)) {
				console.log(`Record ${r.id} doesn't have field ${field}, bailing!`)
				return
			}
		}

		let runnerPath = fields['Runner Path']
		let url = fields['Source Link']

		// make issue
		let fetchNum = await issues.createFetchIssue(runnerPath, url)
		let parseNum = await issues.createParseIssue(runnerPath, fetchNum)
		let normalizeNum = await issues.createNormalizeIssue(runnerPath, parseNum)

		let res = await airtable.update(r.id, {
			fetch_issue_id: fetchNum.toString(),
			parse_issue_id: parseNum.toString(),
			normalize_issue_id: normalizeNum.toString()
		})

		console.log(`Issues successfully created for ${runnerPath}.`)
	})
}


(async () => {
	createIssues()
})();