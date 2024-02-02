# Overview

1. [Technology used](#1-technology-used)

2. [Folder structure](#2-folder-structure)

3. [Settings](#2-Settings)

4. [Release](#3-Release)

### 1. Technology used

- [Hasura Engine](https://hasura.io/) for creating secure GraphQL APIs from databases
- [@google-cloud/functions-framework](https://github.com/GoogleCloudPlatform/functions-framework-nodejs): FaaS (Function as a service) framework for writing portable Node.js functions
- [Kubernetes](https://kubernetes.io/) : ##### Automated container deployment, scaling, and management
- [Knative](https://knative.dev/): Run container as Serverless on Kubernetes
- [Kong for Kubernetes:](https://github.com/Kong/kubernetes-ingress-controller) API Gateway for kantive/k8s
- [Amazon Cognito - Simple and Secure User Sign Up &amp; Sign In | Amazon Web Services (AWS)](https://aws.amazon.com/cognito/?nc1=h_ls)
- [Amazon EKS | Managed Kubernetes Service](https://aws.amazon.com/eks/?whats-new-cards.sort-by=item.additionalFields.postDateTime&whats-new-cards.sort-order=desc&eks-blogs.sort-by=item.additionalFields.createdDate&eks-blogs.sort-order=desc)
- [Amazon ECR | Docker Container Registry](https://aws.amazon.com/ecr)
- [Amazon RDS | Cloud Relational Database ](https://aws.amazon.com/rds)
- [AWS Lambda – Serverless Compute](https://aws.amazon.com/lambda/?nc2=h_ql_prod_serv_lbd)
- somes service in Aws

### 2. Folder structure

- `.github`: Config github action to deploy develop,staging,production

- `app`: Deploy static web supports guide and app link (Google/Apple)

- `data`:  Image and some code update image and hotfix (Because no admin ui)

- `deploy` : Config k8s kustomize for deploy dev,stag,prod

- `docs`: Docs for api and development

- `functions` : FaaS support Hasura Actions and Triggers (Some api functions)

- `hasura`: Config, migrations, metadata, seeds for Hasura

### 3. Settings

#### Local

Using docker-compose `docker-compose.yaml` to deploy local dev

#### Server ( See the infra documentation for how to setup )

1. Create services from Aws:  Cognito, Eks, ecr, rds, lamda...

2. Put Aws config to [Github Action Secrets](https://github.com/kaiser-kitchen/loyalty-point-backend/settings/secrets/actions). using prefix `DEV_`, `STAG_`,`PROD_` for states.

3. K8s 
   
   folder `deploy/base` is base k8s config all services. `deploy/stag|prod` config overwright in `deploy/base`

4. Deploy to `Stag` and `Prod` using `Github Action` 
   
   See [Config Deploy Staging ](../.github/workflows/deploy-staging.yml) , See [Config Deploy Production](../.github/workflows/deploy-production.yml)
   
   Flow Step: 
   
   - Checkout Source code
   
   - Notify slack: deploy start
   
   - Configure AWS credentials
   
   - Login to Amazon ECR
   
   - Build and Push docker functions image to Amazon ECR
   
   - Build and Push docker app image to Amazon ECR
   
   - Sync Env: Sync env from Github Secret to K8s Configs
   
   - Trigger deploy:  using k8s cli deploy all services
   
   - Apply hasura migrations
   
   - Apply hasura metadata
   
   - Notify slack: deploy status 

### 4.Release

Using Github Action to Deploy via branches format: 

- Staging: `releases/**-stag`

- Production: `releases/**-prod`

Gitflow to Deploy

For example: Current version 1.1.0, now will upgrade to 1.1.1

   

###### Staging:

- In master branch, Pull and rebase with remote master (update the latest version)

- Checkout to branch `releases/1.1.0-stag`

- Checkout new branch `releases/1.1.1-stag` from `releases/1.1.0-stag`

- Rebase branch `releases/1.1.1-stag` with `master`

- Push branch `releases/1.1.1-stag` to github

- Now `Github Action` auto run with flow as defined above



###### Production:

- Checkout to old version branch `releases/1.1.0-prod`

- Checkout new branch `releases/1.1.1-prod` from `releases/1.1.0-prod`

- Rebase new branch `releases/1.1.1-prod` with staging branch `releases/1.1.1-stag`

- Push branch `releases/1.1.1-prod` to github

- Now `Github Action` auto run with flow as defined above
