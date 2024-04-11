import 'dotenv/config';
import { GraphQLClient, gql } from 'graphql-request';
import csv from 'csvtojson';

const client = new GraphQLClient(process.env.HYGRAPH_ENDPOINT, {
	headers: {
		authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`,
	},
});

function createImageMutation(data) {
	const mutation = gql`
		mutation assetUpload {
			createAsset(
				data: {
					uploadUrl: "${data.url}"
				}
			) {
				id
				url
			}
		}
	`;
	return mutation;
}

const processQueue = async (data) => {
	try {
		console.log(`[PROCESSING]: ${data.id}`);
		const assetMutation = createImageMutation(data);
		await client.request(assetMutation).then((response) => {
			console.log(response);
		});
		console.log(`[SUCCESS]: ${data.id}`);
	} catch (error) {
		console.error(`[ERROR]: ${data.id} - ${error.message}`);
	}
};

const run = async () => {
	try {
		const data = await csv().fromFile('src/data/news_images.csv');

		for (const obj of data) {
			await processQueue(obj);
		}
	} catch (error) {
		console.error(error);
	}
};

run();
