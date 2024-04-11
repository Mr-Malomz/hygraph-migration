import 'dotenv/config';
import { GraphQLClient, gql } from 'graphql-request';
import csv from 'csvtojson';

const client = new GraphQLClient(process.env.HYGRAPH_ENDPOINT, {
	headers: {
		authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`,
	},
});

// Function to create the mutation for creating the author
function createAuthorMutation(authorData) {
	const mutation = gql`
    mutation createAuthor {
      createAuthor(
        data: {
          name: "${authorData.name}" 
          location: "${authorData.location}"
        }
      ) {
        id
        name
      }
    }
  `;
	return mutation;
}

// Function to create the mutation for creating a post
function createPostMutation(postData, authorId) {
	const date = new Date(postData.date).toISOString();
	const mutation = gql`
    mutation createPost {
      createPost(
        data: {
          title: "${postData.title}"
          date: "${date}"
          author: { connect: { id: "${authorId}" } }
        }
      ) {
        id
        title
      }
    }
  `;
	return mutation;
}

const run = async () => {
	const authorList = await csv().fromFile('src/data/news_author.csv');
	const postList = await csv().fromFile('src/data/news_posts.csv');
	let authorId = null;

	// Create the author
	const authorMutation = createAuthorMutation(authorList[0]);
	await client.request(authorMutation).then((response) => {
		authorId = response.createAuthor.id;
		console.log(`Author created with ID: ${authorId}`);
	});

	// Create posts
	postList.forEach((postData, index) => {
		setTimeout(() => {
			console.log(`Running mutation ${index + 1} of ${postList.length}`);

			const postMutation = createPostMutation(postData, authorId);
			client.request(postMutation).then((response) => {
				console.log(response);
			});
		}, (index + 1) * 1000);
	});
};

run();
