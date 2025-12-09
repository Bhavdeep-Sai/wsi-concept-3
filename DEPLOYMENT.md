# Deployment Guide

## Prerequisites
- Docker installed on your machine
- GitHub account with this repo
- Docker Hub account (or AWS ECR / Azure ACR)
- AWS account or Azure account (for cloud deployment)

## Step-by-Step Deployment

### 1. Local Testing with Docker

First, test the Docker setup locally:

```bash
# Build the image
cd next-app
docker build -t next-app:local .

# Run the container
docker run -p 3000:3000 next-app:local

# Or use Docker Compose (easier)
cd ..
docker-compose up --build
```

Visit http://localhost:3000 - if it works, you're good to go!

### 2. Setting up GitHub Secrets

For CI/CD to work, add these secrets to your GitHub repo:

1. Go to your repo on GitHub
2. Click Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add these secrets:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token
   - (Optional) `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` for AWS
   - (Optional) `AZURE_CREDENTIALS` for Azure

### 3. Push to GitHub

```bash
git add .
git commit -m "Add Docker and CI/CD configuration"
git push origin main
```

The GitHub Actions workflow will automatically run!

### 4. Deploying to AWS

#### Option A: AWS Elastic Beanstalk (Easiest)

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize EB:
```bash
eb init -p docker next-app
```

3. Create environment and deploy:
```bash
eb create next-app-env
eb deploy
```

#### Option B: AWS EC2 with Docker

1. Launch an EC2 instance (Ubuntu recommended)
2. SSH into the instance
3. Install Docker:
```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
```

4. Pull and run your image:
```bash
sudo docker pull yourusername/next-app:latest
sudo docker run -d -p 80:3000 yourusername/next-app:latest
```

### 5. Deploying to Azure

#### Option A: Azure App Service

1. Install Azure CLI
2. Login:
```bash
az login
```

3. Create resource group:
```bash
az group create --name nextapp-rg --location eastus
```

4. Deploy container:
```bash
az webapp create --resource-group nextapp-rg \
  --plan myAppServicePlan \
  --name my-next-app \
  --deployment-container-image-name yourusername/next-app:latest
```

#### Option B: Azure Container Instances

```bash
az container create \
  --resource-group nextapp-rg \
  --name next-app \
  --image yourusername/next-app:latest \
  --dns-name-label my-next-app \
  --ports 3000
```

## Environment Variables in Production

Never hardcode secrets! Use environment variable injection:

### For Docker:
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="your_db_url" \
  -e API_KEY="your_api_key" \
  next-app:latest
```

### For AWS Elastic Beanstalk:
Add via EB console: Configuration > Software > Environment properties

### For Azure App Service:
Add via portal: Configuration > Application settings

## Monitoring & Troubleshooting

### Check container logs:
```bash
docker logs <container_id>
```

### Check if container is running:
```bash
docker ps
```

### Access container shell:
```bash
docker exec -it <container_id> sh
```

### AWS CloudWatch:
Logs are automatically sent to CloudWatch when using ECS/Beanstalk

### Azure Monitor:
Enable Application Insights for detailed monitoring

## Rolling Back

If deployment fails:

**Docker:**
```bash
docker pull yourusername/next-app:previous-version
docker run -p 3000:3000 yourusername/next-app:previous-version
```

**AWS EB:**
```bash
eb deploy --version previous-version-label
```

**Azure:**
```bash
az webapp deployment source config --name my-next-app \
  --resource-group nextapp-rg \
  --slot-swap previous-slot-name
```

## Common Issues

**Issue: Container exits immediately**
- Check logs with `docker logs <container_id>`
- Usually means the app crashed - check your build process

**Issue: Can't connect to deployed app**
- Check security groups (AWS) or NSG rules (Azure)
- Ensure port 80/443 is open
- Verify container is actually running

**Issue: Environment variables not working**
- Make sure they're prefixed correctly (NEXT_PUBLIC_ for client-side)
- Check if they're actually being passed to the container

---

Remember: Always test in a staging environment before production!
