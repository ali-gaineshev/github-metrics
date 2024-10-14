class Repository{
    constructor(repo_id, repo_name, repo_created_at,
                repo_url, default_branch, branches){
        this.repo_id = repo_id;
        this.repo_name = repo_name;
        this.repo_created_at = repo_created_at;
        this.repo_url = repo_url;
        this.default_branch = default_branch;
        this.branches = branches;
    }
}

module.exports = Repository;