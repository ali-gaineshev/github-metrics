class Query{

    constructor(){}

    static retrieve_all_repos(affiliation, end_cursor)
    {
        return `
        query($owner: String!)
        {
            repositoryOwner(login: $owner)
            {
                ... on User
                {
                    repositories(first: 10, after: ${end_cursor}, affiliations : ${affiliation})
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
                            repo_updated_at: updatedAt
                            repo_url: url
                            repo_fork_count: forkCount 
                            repo_is_empty: isEmpty 
                            repo_is_forked: isFork 
                            repo_is_private: isPrivate 
                            defaultBranchRef 
                            {
                                default_branch_name: name
                            }
                            issues(first: 100, after: null)
                            {
                                totalCount
                                nodes{
                                    author
                                    {
                                      login
                                    }
                                    assignees(first: 5, after: null)
                                    {
                                        nodes
                                        {
                                            login
                                        }
                                    }
                                    is_closed: closed
                                    
                               }
                            }
                            pullRequests (first: 100, after: null)
                            {
                                totalCount
                                nodes{
                                    author
                                    {
                                      login
                                    }
                                    assignees(first: 5, after: null)
                                    {
                                        nodes
                                        {
                                            login
                                        }
                                    }
                                    closed 
                                    merged
                                    mergedBy 
                                    {
                                        login
                                    }
                               }
                            }
                            refs(first: 100, refPrefix: "refs/heads/")
                            {
                                branches: nodes
                                {
                                    name
                                    id
                                }
                            }
                            releases(first: 100, after: null)
                            {
                                totalCount
                            }
                        }
                    }
                }
            }
        }
        `;
    }

    static retrieve_all_repos_and_branches(affiliation, end_cursor)
    {
        return `
        query($owner: String!)
        {
            repositoryOwner(login: $owner)
            {
                ... on User
                {
                    repositories(first: 10, after: ${end_cursor}, affiliations : ${affiliation})
                    {
                        repo_total_count: totalCount
                        repo_page_info: pageInfo
                        {
                            hasNextPage
                            endCursor
                        }
                        repos: nodes
                        {
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