## Branch state

- `master`: Develop
- `staging`: releases/**-stag
- `production`: releases/**-prod

## Note

- Num days to check recovery giveaway `dev: 1 day`, `staging: 1 day`, `production: 14 days=2 weeks`.
- [Event trigger auto remove rank and point](https://github.com/kaiser-kitchen/loyalty-point-backend/issues/41) `dev: 2 day`, `staging: 2 day`, `production: 30 days=1 month`.

## Run in Local with Docker Compose

```
docker-compose up // or docker-compose up -d
```

## Config only for server Dev

1. Setting customer domain

```
kubectl edit cm config-network --namespace knative-serving
```

```
[...]
data:
  [...]
  domainTemplate: |-
    {{if index .Annotations "custom-hostname" -}}
      {{- index .Annotations "custom-hostname" -}}
    {{else -}}
      {{- .Name}}.{{.Namespace -}}
    {{end -}}
    .{{.Domain}}
```

## Hasura

First config `.env` file in `/hasura/.env`.

Open hasura console

```
cd hasura
hasura console // or hasura console --envfile .env.staging
```

## Functions

This micro-service for hasura .

## Deploy in Cloud

1. Setting Env
2. Run Sed `env` to `kustomization.yaml` file with state. `./deploy/sed-env.sh $state`

ex:

```
./deploy/sed-env.sh dev
```

3. Use `kubectl` deploy to k8s

`kubectl apply -k deploy/$state`

ex: deploy for dev state

```
kubectl apply -k deploy/dev 
```