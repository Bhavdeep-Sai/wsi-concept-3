"# Cloud Deployments Project - Next.js App

This is my learning journey with Docker, CI/CD pipelines, and cloud deployments. I've taken a Next.js application and containerized it, automated the build process, and prepared it for cloud deployment.

## Understanding Cloud Deployments: Docker → CI/CD → AWS/Azure

### What I Learned About Docker

When I first started with Docker, I thought it was just another way to run applications. But after working with it, I realized it's much more than that - it solves the "works on my machine" problem completely.

**How I containerized this project:**

The key was understanding Docker's multi-stage builds. Instead of having one giant image with everything, I split it into stages:

1. **Dependencies stage** - This is where I install all the npm packages. Docker caches this layer, so if my package.json doesn't change, rebuilds are super fast.

2. **Build stage** - Here's where Next.js compiles everything. I learned that disabling telemetry (`NEXT_TELEMETRY_DISABLED=1`) makes builds faster in containers.

3. **Runner stage** - This is the final image that actually runs in production. I only copy what's needed, which keeps the image small (around 150MB instead of 1GB+).

One thing that took me a while to figure out was the `output: 'standalone'` configuration in `next.config.ts`. Without this, the Docker container couldn't run the app properly because Next.js needs this mode for containerized environments.

**Security considerations I learned:**
- Never run containers as root - I create a `nextjs` user with limited permissions
- Use `.dockerignore` to keep secrets and unnecessary files out of the image
- Use Alpine-based images because they're smaller and have fewer vulnerabilities

### My CI/CD Pipeline Setup

I set up GitHub Actions for continuous integration. Here's what happens automatically now:

```yaml
Push code → Checkout → Install dependencies → Lint code → Build app → Build Docker image
```

**What I found helpful:**
- Using `npm ci` instead of `npm install` - it's faster and more reliable in CI environments
- Caching Node modules between runs - this cut my build time from 3 minutes to 45 seconds
- The `workflow_dispatch` trigger lets me manually run the pipeline when testing

**Where I struggled:**
Initially, my workflow kept failing because I was trying to push to Docker Hub without setting up the secrets. I learned that you need to go to GitHub Settings > Secrets and add `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`. I added `continue-on-error: true` for now so the pipeline doesn't fail if someone doesn't have these set up yet.

### Environment Variables & Secrets Management

This was probably the most important lesson. Here's what I learned:

**For local development:**
- Use `.env.local` files (these are gitignored by default)
- Docker Compose can inject these variables

**For production:**
- Never commit secrets to Git (learned this the hard way when I almost pushed an API key)
- Use GitHub Secrets for CI/CD variables
- Cloud platforms like AWS have their own secret managers (AWS Secrets Manager, Azure Key Vault)

I created a template approach:
```bash
# .env.example (safe to commit)
DATABASE_URL=your_database_url_here
API_KEY=your_api_key_here

# .env.local (never commit this)
DATABASE_URL=postgresql://localhost:5432/mydb
API_KEY=actual_secret_key_here
```

### Deployment Architecture

Here's how the deployment flow works in my setup:

```
Developer pushes code
    ↓
GitHub Actions triggers
    ↓
Runs tests & linting
    ↓
Builds Docker image
    ↓
Pushes to Docker Hub (or AWS ECR / Azure ACR)
    ↓
Deploys to cloud service
    ↓
Application runs in container
```

**For AWS deployment**, I would use:
- **EC2** with Docker installed, or
- **Elastic Beanstalk** (easier, handles scaling automatically), or
- **ECS/Fargate** (fully managed containers)

**For Azure deployment**, options include:
- **Azure App Service** (supports Docker directly)
- **Azure Container Instances** (simple, pay-per-second)
- **Azure Kubernetes Service** (if scaling to multiple containers)

### What Went Wrong & How I Fixed It

**Problem 1: Docker build kept failing**
- Error: `Cannot find module 'next'`
- Solution: I wasn't copying `package-lock.json`, so npm couldn't install exact versions. Added it to the Dockerfile.

**Problem 2: Container ran but showed 404 errors**
- Error: Next.js couldn't find the built files
- Solution: Added `output: 'standalone'` to next.config.ts. This tells Next.js to prepare files for containerized deployment.

**Problem 3: Slow builds in CI/CD**
- Builds were taking 4-5 minutes
- Solution: Enabled Docker layer caching with `cache-from` and `cache-to`. Now builds complete in under a minute.

**Problem 4: Understanding multi-stage builds**
- My initial Dockerfile was 800MB+
- Solution: Used Alpine base image and multi-stage builds. Final image is ~150MB. Each stage has a specific job, and Docker only keeps what's needed from each stage.

### My Reflection

**What was challenging:**
Understanding how Docker layers work took me a couple of days. I kept rebuilding everything from scratch until I learned about layer caching. Also, wrapping my head around the difference between development and production environments - things like hot reload don't work the same way in containers.

**What worked well:**
Once I got the Dockerfile right, everything else fell into place. The CI/CD pipeline is actually simpler than I thought it would be. GitHub Actions has great documentation, and the YAML syntax makes sense once you understand the flow.

**What I'd improve next time:**
1. Add actual tests before the build step (right now I only have linting)
2. Set up separate staging and production environments
3. Learn Terraform or Bicep to manage cloud infrastructure as code
4. Add health checks to the Docker container
5. Implement a proper rollback strategy in case deployments fail

The biggest lesson? Cloud deployment isn't just about making your app accessible online - it's about building a reliable, automated system that can handle failures, scale when needed, and keep secrets secure. There's so much more to learn, but this foundation feels solid.

## Running This Project

### Locally with Node
```bash
cd next-app
npm install
npm run dev
```

### With Docker
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
cd next-app
docker build -t my-next-app .
docker run -p 3000:3000 my-next-app
```

Visit `http://localhost:3000` to see the app.

## Video Explanation

[Link to my video walkthrough - explaining the setup and learnings]
(Upload your video to Google Drive and add the link here)

---

**Note:** This is a learning project for understanding cloud deployments. Not everything is production-ready, but the concepts and patterns are what matter.
" 
