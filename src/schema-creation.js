import 'dotenv/config';
import {
	Client,
	SimpleFieldType,
	RelationalFieldType,
} from '@hygraph/management-sdk';

const client = new Client({
	authToken: process.env.HYGRAPH_TOKEN,
	endpoint: process.env.HYGRAPH_ENDPOINT,
});

// create model for news post and authors
client.createModel({
	apiId: 'Post',
	apiIdPlural: 'Posts',
	displayName: 'Post',
});

client.createModel({
	apiId: 'Author',
	apiIdPlural: 'Authors',
	displayName: 'Author',
});

// add fields to post
client.createSimpleField({
	apiId: 'title',
	displayName: 'Title',
	modelApiId: 'Post',
	type: SimpleFieldType.String,
});

client.createSimpleField({
	apiId: 'date',
	displayName: 'Date',
	modelApiId: 'Post',
	type: SimpleFieldType.Date,
});

// add fields to author
client.createSimpleField({
	apiId: 'name',
	displayName: 'Name',
	modelApiId: 'Author',
	type: SimpleFieldType.String,
});

client.createSimpleField({
	apiId: 'location',
	displayName: 'Location',
	modelApiId: 'Author',
	type: SimpleFieldType.String,
});

// add relation to News for Author posts
client.createRelationalField({
	parentApiId: 'Post',
	apiId: 'author',
	displayName: 'Written By',
	type: RelationalFieldType.Relation,
	reverseField: {
		modelApiId: 'Author',
		apiId: 'posts',
		displayName: 'Posts',
		isList: true,
	},
});

client.run();
