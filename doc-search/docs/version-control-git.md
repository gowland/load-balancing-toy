# Version Control with Git

Git is a distributed version control system that tracks changes in source code during software development. It enables collaboration among developers and maintains a complete history of project changes.

## Core Concepts

### Repository
A Git repository contains all project files and the complete history of changes.

### Commit
A snapshot of your project at a specific point in time, with a unique identifier and commit message.

### Branch
A lightweight, movable pointer to a specific commit, allowing parallel development.

### Merge
Combining changes from different branches into a single branch.

## Essential Git Commands

### Basic Operations
```bash
git init                    # Initialize a new repository
git clone <url>            # Clone an existing repository
git add <file>             # Stage changes for commit
git commit -m "message"    # Commit staged changes
git push                   # Upload changes to remote repository
git pull                   # Download and merge remote changes
```

### Branching
```bash
git branch                 # List branches
git branch <name>          # Create new branch
git checkout <branch>      # Switch to branch
git merge <branch>         # Merge branch into current branch
git branch -d <branch>     # Delete branch
```

## Branching Strategies

### Git Flow
- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: Individual feature development
- **release/***: Prepare new releases
- **hotfix/***: Quick production fixes

### GitHub Flow
- **main**: Always deployable
- **feature branches**: Short-lived branches for new features
- **Pull requests**: Code review and discussion before merging

## Best Practices

- Write clear, descriptive commit messages
- Make atomic commits (one logical change per commit)
- Use branches for feature development
- Regular commits to avoid losing work
- Pull before pushing to avoid conflicts
- Use .gitignore to exclude unnecessary files