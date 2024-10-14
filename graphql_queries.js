class Query{

    constructor(){}

    static retrieve_all_repos_and_branches(end_cursor)
    {
        return `
        query($owner: String!)
        {
            repositoryOwner(login: $owner)
            {
                ... on User
                {
                    repositories(first: 10, after: ${end_cursor}, affiliations : OWNER)
                    {
                        repo_total_count: totalCount
                        repo_page_info: pageInfo
                        {
                            hasNextPage
                            endCursor
                        }
                        repos: nodes
                        {
                            repo_id: id
                            repo_name: name
                            repo_created_at: createdAt
                            repo_url: url
                            defaultBranchRef 
                            {
                                default_branch_name: name
                                }
                            refs(first: 100, refPrefix: "refs/heads/")
                            {
                                branches: nodes
                                {
                                    name
                                    id
                                }
                            }
                        }
                    }
                }
            }
        }
        `
    }
}

module.exports = Query;