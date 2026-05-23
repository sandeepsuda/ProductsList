pipeline {
    agent any
    
    tools {
        nodejs 'node20'
    }

    environment {                                                                                                                               
        AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_DEFAULT_REGION    = 'us-east-1'
        S3_BUCKET_NAME        = 'stockmate-products-frontend'
        CLOUDFRONT_DIST_ID    = 'EQ65T1SVZCQC3'
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

        stage('Deploy Frontend (AWS S3 + CloudFront)') {
        steps {
            echo 'Building frontend static assets...'
            sh 'npm run build'
  
            echo 'Syncing built assets to S3...'
            // --delete removes old files in S3 that no longer exist in your build folder
            sh 'aws s3 sync dist/ s3://$S3_BUCKET_NAME --delete'
  
            echo 'Invalidating CloudFront Cache...'
            // Clears CloudFront's cache so your users immediately receive the new code
            sh 'aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths "/*"'
        }
    }
    }

    post {
        always {
            echo 'Pipeline finished execution.'
        }
        success {
            echo '🎉 All services successfully deployed to Render and AWS S3 + CloudFront!'
        }
        failure {
            echo '❌ Pipeline execution failed. Please inspect build console output.'
        }
    }
}
