# Video Script Guide (3-5 minutes)

## Introduction (30 seconds)
"Hey! So for this project, I worked on understanding cloud deployments - basically taking an app from my computer and getting it running in the cloud using Docker and CI/CD pipelines. Let me walk you through what I learned."

## Part 1: Docker Setup (60-90 seconds)

**Show your screen with Dockerfile open**

"So the first thing I did was containerize my Next.js app using Docker. This Dockerfile might look complicated, but it's actually pretty logical once you break it down.

I'm using what's called a multi-stage build - see these different FROM statements? Each one is a stage. 

The first stage just installs dependencies. The second stage builds the app. And the final stage - the runner - is what actually runs in production. This keeps the final image really small, about 150MB instead of like a gigabyte.

One thing that took me forever to figure out - see this 'output: standalone' in the config? Without that, Next.js won't work properly in a Docker container. I spent hours debugging before I found that out.

Also, I'm creating a non-root user here for security. Running as root in containers is apparently a really bad practice."

## Part 2: CI/CD Pipeline (60-90 seconds)

**Show GitHub Actions workflow file**

"Next, I set up this GitHub Actions workflow for CI/CD. Basically, every time I push code now, this automated pipeline runs.

It checks out the code, installs dependencies, runs the linter to check code quality, builds the app, and then builds a Docker image.

The cool part is the caching - see this 'cache' configuration? This makes builds way faster because it reuses stuff that hasn't changed.

I also learned about GitHub Secrets the hard way. You can't just put your Docker Hub password in the code - you have to add it as a secret in the repo settings. Otherwise, anyone could grab your credentials."

## Part 3: What Went Wrong (60 seconds)

**Can show terminal or just talk through it**

"Let me tell you what broke along the way, because that's where I learned the most.

First, my Docker builds kept failing with 'cannot find module' errors. Turns out I wasn't copying the package-lock.json file, so npm couldn't install the exact versions.

Second, even when the build worked, I'd get 404 errors when running the container. That was the standalone output mode issue I mentioned earlier.

Third, my builds were taking like 5 minutes initially. Learning about Docker layer caching and how to order the Dockerfile instructions properly brought that down to under a minute.

Each of these problems taught me something important about how containers and builds actually work."

## Part 4: Deployment & Reflection (45-60 seconds)

**Show DEPLOYMENT.md or architecture diagram if you made one**

"For actual deployment, I documented the process for both AWS and Azure. You could use Elastic Beanstalk on AWS or App Service on Azure - both of them can run Docker containers directly.

The key things I learned are:
- Separate your dev and production environments
- Never commit secrets to Git
- Use environment variables for configuration
- Always test locally with Docker before deploying

What would I do differently next time? Definitely add actual tests before the build step. Right now I only have linting. Also, setting up a proper staging environment before production would be smart.

The biggest takeaway? Cloud deployment isn't just about getting code online - it's about building a reliable, automated system that handles failures gracefully and keeps secrets secure."

## Conclusion (15-30 seconds)

"So yeah, that's my understanding of the Docker to CI/CD to cloud deployment pipeline. There's definitely way more to learn - like Kubernetes for orchestrating multiple containers, or infrastructure as code with Terraform - but this foundation feels solid. Thanks for watching!"

---

## Tips for Recording:

1. **Be conversational** - Talk like you're explaining to a friend, not reading a script
2. **Show your screen** - Open the files as you talk about them
3. **Don't worry about perfection** - A few "um"s and pauses show it's authentic
4. **Mention struggles** - Talking about what went wrong shows real learning
5. **Keep it to 3-5 minutes** - No need to explain every line of code
6. **End with your main takeaway** - What's the one big thing you learned?

## What to Have Open:
- `next-app/Dockerfile`
- `.github/workflows/deploy.yml`
- `next.config.ts` (to show the standalone config)
- `README.md` (to reference your documentation)
- Maybe terminal showing `docker build` or `docker-compose up`

## Recording Tools:
- **Windows**: Xbox Game Bar (Win + G) - built-in
- **OBS Studio**: Free, professional
- **Loom**: Easy, automatically uploads

## After Recording:
1. Upload to Google Drive
2. Set sharing to "Anyone with the link can view"
3. Add the link to your README.md where it says "[Link to my video walkthrough]"

Good luck! Remember, the goal is to show understanding, not to be perfect. Your mistakes and how you solved them are actually the most valuable part.
