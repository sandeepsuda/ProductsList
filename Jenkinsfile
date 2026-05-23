pipeline {
    agent any
    
    tools {
        nodejs 'node20'
    }

    environment {
        // Safe binding of credentials defined in the Jenkins credential store
        VERCEL_TOKEN      = credentials('VERCEL_TOKEN')
        VERCEL_ORG_ID     = credentials('VERCEL_ORG_ID')
        VERCEL_PROJECT_ID = credentials('VERCEL_PROJECT_ID')
        RENDER_DEPLOY_HOOK = credentials('RENDER_DEPLOY_HOOK')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing frontend dependencies...'
                sh 'npm install'

                echo 'Installing backend dependencies...'
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Lint') {
            steps {
                echo 'Running linting rules...'
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm run test:run'
            }
        }

        stage('Deploy Backend (Render)') {
            steps {
                echo 'Triggering automatic deployment on Render...'
                // Send a request to Render's Deploy Hook to pull the latest code and rebuild
                sh 'curl -X POST "$RENDER_DEPLOY_HOOK"'
            }
        }

        stage('Deploy Frontend (Vercel)') {
            steps {
                echo 'Deploying to Vercel in production mode...'
                // Non-interactive build and deployment with automatic promotion to production
                sh 'npx vercel --token $VERCEL_TOKEN --prod --yes'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished execution.'
        }
        success {
            echo '🎉 All services successfully deployed to Render and Vercel!'
        }
        failure {
            echo '❌ Pipeline execution failed. Please inspect build console output.'
        }
    }
}
