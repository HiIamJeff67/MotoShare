# MotoShare - a ride-sharing software

# Please use this branch to place and store the test stuff.

## The following shows some example commands about how to manage this github branch
1. To Initialize the github in local side : 
```
git init
```
2. To get the status of local workspace : 
```
git status
```
3. To add changes in currently local branch(save) : 
```
git add .
```
4. To commit changes you just added : 
```
git commit -m "commit_message"
```
5. To set remote repository with a given url : 
```
git remote add some_name remote_repository_url
// git remote add origin https://github.com/HiIamJeff67/MotoShare.git
```
6. To push commit to the github branch : 
```
git push -u some_name github-branch
// git push -u origin main
```
7. To push from local different name branch to the specified github branch : 
```
git push --force some_name local_branch:github_branch
// git push --force origin main:feature-branch-test
```
