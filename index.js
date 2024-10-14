require('dotenv').config(); // read env file
const Query = require('./graphql_queries')
const Repository = require('./repository')
const github_token = process.env.BEARER_TOKEN;
const github_endpoint = "https://api.github.com/graphql";
const github_owner = "ali-gaineshev"

// Set headers for requests
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${github_token}`,
}

function make_request(query, variables) {
    return fetch(github_endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    })
}
async function retrieve_data(end_cursor){
    const query = Query.retrieve_all_repos_and_branches(end_cursor)
    const variables = {"owner": github_owner}
    let data = {}
    try {
        // Await the result of request
        const response = await make_request(query, variables);
        data = await response.json();
        if(data == null || data.status != null){
            //error
            console.log(data)
            return {};
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return data;
}

async function main(){
    let next_page_exists = true;
    let cursor = null;
    const all_repos = [];
    while(next_page_exists)
    {
        const data = await retrieve_data(cursor)
        if(data == null || Object.keys(data).length === 0){
            return;
        }
        try {
            const raw_info = data.data.repositoryOwner.repositories;
            const repo_total_count = raw_info.repo_total_count;
            const repo_page_info = raw_info.repo_page_info;
            if(!repo_page_info.hasNextPage){
                next_page_exists = false
            }else{
                cursor = '"' + repo_page_info.endCursor + '"'; //because cursor is supposed to be wrapped in a string
            }

            const raw_repos = raw_info.repos;
            for(index in raw_repos){
                repo = raw_repos[index];
                all_repos.push(
                    new Repository(
                        repo.repo_id,
                        repo.repo_name,
                        repo.repo_created_at,
                        repo.repo_url,
                        repo.defaultBranchRef === null ? null : repo.defaultBranchRef.default_branch_name,
                        repo.refs.branches
                    )
                );
            }

        }catch(error){
            console.error('Error:', error);
            return;
        }

    }
    console.log(all_repos[0].branches);
}

main();