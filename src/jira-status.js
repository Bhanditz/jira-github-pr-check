// © 2016 and later: Unicode, Inc. and others.
// License & terms of use: http://www.unicode.org/copyright.html#License

"use strict";

if (process.env.JIRA_USERNAME && process.env.JIRA_PASSWORD) {
	var jira = new (require("jira-connector"))({
		host: process.env.JIRA_URL,
		basic_auth: {
			username: process.env.JIRA_USERNAME,
			password: process.env.JIRA_PASSWORD
		}
	});
} else {
	var jira = new (require("jira-connector"))({
		host: process.env.JIRA_URL,
	});
}

async function getStatus(issueKey) {
	return new Promise((resolve, reject) => {
		jira.issue.getIssue({
			issueKey
		}, (err, issue) => {
			if (err && err.errorMessages && /does not exist/.test(err.errorMessages[0])) {
				resolve(null);
			} else if (err) {
				reject(err);
			} else if (issue.fields) {
				resolve(issue.fields.status.name);
			} else {
				resolve(null);
			}
		});
	});
}

function getUrl(issueKey) {
	return "https://" + process.env.JIRA_URL + "/browse/" + issueKey;
}

module.exports = {
	getStatus,
	getUrl
};
