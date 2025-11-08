---
layout: default
title: Unit Tests
excerpt: Short description to include as an opening and SEO metatags.
nav_order: 2
nav_exclude: false
search_exclude: false
---
# Unit Testing

This document showcases how to write and use the jest tests and how they interface with our CI/CD pipeline.

## Github Actions

The driver of all of the tests done is our github actions workflow called `docker-image.yml` inside of the folder `.github\workflows`. Inside this file, it describes how the github action will be run, the following will be a description how it works

### Parent On Statement

This is section that is triggered by github to start any of the jobs listed later. Inside this section of the file, there is a couple sections that denote behavior.

---
#### Event Triggers

```
push:
    branches: [ "SCRUM-308" ]
pull_request:
    branches: [ "SCRUM-308" ]
```

This block denotes *when* the github action is triggered, the list of all triggers are as follows:

- **Repository Events:**
    These are actions that occur within your GitHub repository.
    - `push`: Triggered when commits are pushed to a specified branch or tag.
    - `pull_request`: Triggered when a pull request is opened, synchronized, reopened, or closed.
    - `issue`: Triggered when an issue is opened, edited, deleted, labeled, unlabeled, assigned, unassigned, locked, unlocked, or transferred.
    - `pull_request_review`: Triggered when a pull request review is submitted, edited, or dismissed.
    - `release`: Triggered when a release is published, unpublished, created, edited, deleted, or prereleased.
    - `create`: Triggered when a branch or tag is created.
    - `delete`: Triggered when a branch or tag is deleted.
    - `fork`: Triggered when a repository is forked.
    - `star`: Triggered when a user stars a repository.
    - And many other specific events related to issues, pull requests, and repository activity.
- Scheduled Events (`schedule`):
    This trigger allows you to run workflows at specific intervals using cron syntax. This is useful for recurring tasks like daily reports or weekly cleanups
- Manual Triggers (`workflow_dispatch`):
    This allows you to manually trigger a workflow from the GitHub UI or via the GitHub API. You can also define inputs for these manual triggers, allowing users to provide custom values when running the workflow.
- External Triggers (`repository_dispatch`):
    This enables you to trigger a workflow from an external system or another GitHub repository by sending a `repository_dispatch` event to the GitHub API. This is useful for integrating GitHub Actions with other services.
- Workflow Triggers (`workflow_run`):
    This trigger allows a workflow to be initiated when another specified workflow completes, either successfully or with a failure. This creates dependencies between workflows.

---
#### Workflow Dispatch

```
workflow_dispatch:
	inputs:
		run_frontend:
			description: "run the frontend tests"
			type: boolean
			default: false
		run_backend:
			description: "run the backend tests"
			type: boolean
			default: false
```

This section allows for each of the tests to be run independently. By default the values are `false` currently, *however* once a more robust suite of tests are created for the individual component the defaults will be switched to `true`.

---
### Jobs

This section of the code describes the actual jobs that are run by the github action. Each job preforms a different task to make sure existing functionality is maintained across commits.

---
#### build-images

```
build-images:
	runs-on: ubuntu-latest
		steps:
			- name: Checkout Code
			  uses: actions/checkout@v4
			
			- name: Setup Docker Compose
			  uses: docker/setup-compose-action@v1
			  with:
				  version: 'latest'

			- name: Copy Environment File
			  run: cp .env_example .env

			- name: Build Docker Images
			  run: docker compose up -d

			- name: Teardown Docker Containers
			  run: docker compose down

			- name: Save Docker Images as Artifacts
			  run: |
				$(docker save $(docker images -q) -o docker-images.tar)
```

This job is responsible for testing if the docker images build properly. The baseline for a github actions jobs is very similar to a docker container, in that they run on a specified architecture, and run in a containerized format. Github Jobs follow a step by step process, *however*, just because one step is current happening, it does not mean that another cannot start. The only things that prevent another step from starting before another is finished is any sort of blocking action. Each step will be described in detail in the following.

- `Checkout Code & Setup Docker Compose`
	- These steps are responsible for setting up certain behavior inside the environment the github action is running on. This is necessary since by default, these behaviors are not enabled on the virtual machines that run github jobs.
- `Copy Environment File`
	- This step is needed so that the docker images build properly, since environment variable are used in the compilation process. The `.env_example` file is stored in the same area as the standard .env file. 
	- **NOTE:** Only put testing variables inside the `.env_example` file, this will remain separate from from the true `.env` file.
- `Build Docker Images & Teardown Docker Containers`
	- These steps are standard docker compose commands used to build the image files, these tests to make sure that any changes made to either the docker compose, or any missing file needed for compilation isn't missing inside the repo. 
	- **NOTE:** Make sure to run the `docker compose up` command with the `-d` flag, which makes it run in detached mode. This is needed so the github job doesn't block the following jobs.
- `Save Docker Images as a Tarball`
	- This step creates a tarball of the built images so that we can artifact, which is good to have for a backup case.
- `Upload artifact`
	- This step uploads the artifact, so that you can download and exam the build images, alongside that github with store the artifact for 30 days, acting as a makeshift backup system.

---
#### test-frontend

```
test-frontend:
	runs-on: ubuntu-latest
	needs: build-images
	if: ${{ inputs.run_frontend }}
	steps:
    - name: Checkout Code
      uses: actions/checkout@v4
    
    - name: Setup Docker Compose
      uses: docker/setup-compose-action@v1
      with:
        version: 'latest'

    - name: Copy Environment File
      run: cp .env_example .env

    - name: Start Docker Containers
      run: docker compose up -d

    - name: Run Site Tests
      run: |
        echo "Running tests..."
        docker exec -i blueprint-site npm run test:frontend
```

This jobs runs the frontend tests, I am not going to go over the duplicated steps that are needed to run this job. The largest distinction is the step:

```
- name: Run Site Tests
      run: |
        echo "Running tests..."
        docker exec -i blueprint-site npm run test:frontend
```

This step runs the frontend test on the site docker container specifically. You can specify which container it is running on by changing `blueprint-site` to any of the other docker containers. Alongside that, this entire job is conditional based on this line:

`if: ${{ inputs.run_frontend }}`

This line make it so that the job is dependent on the `run_frontend` variable is set to true, which by default is set to false currently, you can read more about how that works in the **Workflow Dispatch** section.

All of the frontend tests are stored with this file structure
`Blueprint/blueprint/lib/tests/front-end`

Page tests are stored directly in the folder, while individual component tests are store in the `Blueprint/blueprint/lib/tests/front-end/components` folder, widgets also have their own section inside of `Blueprint/blueprint/lib/tests/front-end/components/widgets`

---
#### test-backend

```
test-backend:
    runs-on: ubuntu-latest
    needs: build-images
    if: ${{ inputs.run_backend }}

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Setup Docker Compose
      uses: docker/setup-compose-action@v1
      with:
        version: 'latest'

    - name: Copy Environment File
      run: cp .env_example .env

    - name: Start Docker Containers
      run: docker compose up -d

    - name: Run Backend Tests
      run: |
        echo "Running tests..."
        docker exec -i blueprint-site npm run test:backend
```

This job is similar to the previous one, but instead runs the backend tests, which are stored in a different folder on the file system:
`Blueprint/blueprint/lib/tests/back-end`

In the future these tests will be run more often, however currently the tests present are those from older tests that will be replaced in the future.

---
# Jest tests

The Jest tests are mostly reserved for frontend currently, as Jest is mostly best at testing graphical congruency, and not user input. This will be updated later on to utilize a library that is more focused on user input testing.

In the meantime an general template that will be used for all frontend tests is as follows.

```
import { render, screen } from '@testing-library/react'
import Page from '@/app/$pagename$/page'

describe('$Page$ Page', () => {
    it('Checking to see if $Page$ Page Loads', () => {
        render(<Page />);
        // Assert that a specific element or text is present on the page
        expect(screen.getByText('$Text on Screen$')).toBeInTheDocument();
    });

    // Add more tests to check for other elements, data loading, or user interactions

});
```

If you want to learn more about Jest, [Click Here](https://jestjs.io/docs/getting-started)
