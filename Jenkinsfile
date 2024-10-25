pipeline {
    agent {
        label 'host-computer'
    }

    environment {
        MONGODB_URI = credentials('MONGODB_URI')
        JWT_SECRET = credentials('JWT_SECRET')
        DB_NAME = credentials('DB_NAME')
        EMAIL_CREDENTIALS = credentials('EMAIL_CREDENTIALS')
    }

    stages {
        stage('Debug') {
            steps {
                sh "echo ${env.GIT_BRANCH}"
            }
        }

        stage('dev') {
            when {
                expression { env.GIT_BRANCH == 'origin/dev' }
            }
            steps {
                sh '''
                    docker stop apex-frontend-dev || true && docker rm apex-frontend-dev || true
                    docker stop apex-backend-dev || true && docker rm apex-backend-dev || true
                    cd ./apex-airline-system/frontend
                    docker build \
                        --build-arg MONGODB_URI="$MONGODB_URI" \
                        --build-arg JWT_SECRET="$JWT_SECRET" \
                        --build-arg DB_NAME="$DB_NAME" \
                        -t apex-frontend .
                    docker run -d --name apex-frontend-dev -p 3001:3000 apex-frontend
                    docker run -d --name apex-backend-dev -p 3002:8080 apex-backend
                '''
            }
        }

        stage('uat') {
            when {
                expression { env.GIT_BRANCH == 'origin/uat' }
            }
            steps {
                sh '''
                    docker stop apex-frontend-uat || true && docker rm apex-frontend-uat || true
                    docker stop apex-backend-uat || true && docker rm apex-backend-uat || true
                    cd ./apex-airline-system/frontend
                    docker build \
                        --build-arg MONGODB_URI="$MONGODB_URI" \
                        --build-arg JWT_SECRET="$JWT_SECRET" \
                        --build-arg DB_NAME="$DB_NAME" \
                        -t apex-frontend .
                    docker run -d --name apex-frontend-uat -p 3003:3000 apex-frontend
                    docker run -d --name apex-backend-uat -p 3004:8080 apex-backend
                '''
            }
        }

        stage('prod') {
            when {
                expression { env.GIT_BRANCH == 'origin/main' }
            }
            steps {
                sh '''
                    docker stop apex-frontend-prod || true && docker rm apex-frontend-prod || true
                    docker stop apex-backend-prod || true && docker rm apex-backend-prod || true
                    cd ./apex-airline-system/frontend
                    docker build \
                        --build-arg MONGODB_URI="$MONGODB_URI" \
                        --build-arg JWT_SECRET="$JWT_SECRET" \
                        --build-arg DB_NAME="$DB_NAME" \
                        -t apex-frontend .
                    docker run -d --name apex-frontend-prod -p 3005:3000 apex-frontend
                    docker run -d --name apex-backend-prod -p 3006:8080 apex-backend
                '''
            }
        }
    }

    post {
        failure {
            script {
                def subject = "Build Failure in ${env.JOB_NAME} (Build #${env.BUILD_NUMBER})"
                def body = """
                    Unfortunately, the build #${env.BUILD_NUMBER} for the job ${env.JOB_NAME} has failed.
                    Job: ${env.JOB_NAME}
                    Branch: ${env.GIT_BRANCH}
                    Commit: ${env.GIT_COMMIT}
                    Build Number: ${env.BUILD_NUMBER}

                    You can view the build details here:
                    ${env.BUILD_URL}
                """

                sh """
                    curl -X POST https://api.mailersend.com/v1/email \\
                    -H 'Content-Type: application/json' \\
                    -H 'X-Requested-With: XMLHttpRequest' \\
                    -H 'Authorization: Bearer "${EMAIL_CREDENTIALS}"' \\
                    -d '{
                        "from": {
                            "email": "MS_T1HVro@trial-z3m5jgrp9eo4dpyo.mlsender.net"
                        },
                        "to": [
                            {
                                "email": "jflores@unis.edu.gt"
                            }
                        ],
                        "subject": "${subject}",
                        "text": "${body}",
                        "html": "${body}"
                    }'
                """
            }
        }
    }
}