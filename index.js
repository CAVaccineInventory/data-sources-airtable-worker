require("dotenv").config();

const AsyncAirtable = require('asyncairtable');
const issues = require('./issues')


const asyncAirtable = new AsyncAirtable(process.env.AIRTABLE_KEY, process.env.AIRTABLE_BASE);
const TABLE_NAME = "Data Sources"

async function createIssues() {
	console.log('Starting create issues task...')
	
	const approvedRecords = await asyncAirtable.select(TABLE_NAME, {
		filterByFormula: 'Stage = "Approved"'
	});

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

		// TODO: add backoff-retry to airtable update. Without this, highly
		// parallel jobs tend to overwhelm the airtable API throttling,
		// resulting in issues being created but not noted in airtable.
		// Alternatively, restructure to diminish airtable calls.
		let res = asyncAirtable.updateRecord(TABLE_NAME, {
			id: r.id, fields: {
				fetch_issue_id: fetchNum.toString(),
				parse_issue_id: parseNum.toString(),
				normalize_issue_id: normalizeNum.toString()
			}
		});

		console.log(`Issues successfully created for ${runnerPath}.`)
	})
}


(async () => {
	createIssues()
})();