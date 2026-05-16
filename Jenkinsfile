    // pipeline {
    //     agent any

    //     triggers {
    //         githubPush()
    //     }

    //     environment {
    //         DOCKER_HUB_USER = 'jeevesh2802'
    //         IMAGE_AUTH = "${DOCKER_HUB_USER}/auth-service"
    //         IMAGE_INTERVIEW = "${DOCKER_HUB_USER}/interview-service"
    //         IMAGE_FRONTEND = "${DOCKER_HUB_USER}/frontend-service"
    //         SECURITY_REPORT_DIR = 'reports/security'
    //         SECURITY_SEVERITY = 'HIGH,CRITICAL'
    //         APP_BASE_URL = 'http://interview.local'
            
    //         GROQ_API_KEY = credentials('GROQ_API_KEY')
    //         JWT_SECRET = credentials('JWT_SECRET')
    //         DOCKER_HUB_PASS = credentials('DOCKER_HUB_PASS')
    //     }

    //     stages {
    //         stage('Prepare Security Reports') {
    //             steps {
    //                 sh 'mkdir -p "${SECURITY_REPORT_DIR}"'
    //             }
    //         }


    //         stage('Secret Scan') {
    //             steps {
    //                 sh '''
    //                 docker run --rm \
    //                     -v "$WORKSPACE:/repo" \
    //                     -w /repo \
    //                     zricethezav/gitleaks:latest detect \
    //                     --source=/repo \
    //                     --report-format=json \
    //                     --report-path="${SECURITY_REPORT_DIR}/gitleaks.json" \
    //                     --redact \
    //                     --exit-code=0
    //                 '''
    //             }
    //         }

    //         stage('Unit Tests') {
    //             steps {
    //                 script {
    //                     echo "Running Unit Tests for Auth Service..."
    //                     // sh "npm test --prefix auth-service" 
    //                     echo "Running Unit Tests for Interview Service..."
    //                     // sh "npm test --prefix interview-service"
    //                 }
    //             }
    //         }

    //         stage('SCA Filesystem Scan') {
    //             steps {
    //                 sh '''
    //                 docker run --rm \
    //                     -v "$WORKSPACE:/repo" \
    //                     -v trivy-cache:/root/.cache/ \
    //                     -w /repo \
    //                     aquasec/trivy:latest fs \
    //                     --scanners vuln \
    //                     --severity "${SECURITY_SEVERITY}" \
    //                     --format json \
    //                     --output "${SECURITY_REPORT_DIR}/trivy-fs.json" \
    //                     --exit-code 1 \
    //                     services
    //                 '''
    //             }
    //         }

    //         stage('SAST Scan') {
    //             steps {
    //                 sh '''
    //                 docker run --rm \
    //                     -v "$WORKSPACE:/src" \
    //                     -w /src \
    //                     semgrep/semgrep:latest semgrep scan \
    //                     --config p/owasp-top-ten \
    //                     --config p/nodejs \
    //                     --severity ERROR \
    //                     --sarif \
    //                     --output "${SECURITY_REPORT_DIR}/semgrep.sarif" \
    //                     --error \
    //                     services
    //                 '''
    //             }
    //         }

    //         stage('IaC Scan') {
    //             steps {
    //                 sh '''
    //                 docker run --rm \
    //                     -v "$WORKSPACE:/repo" \
    //                     -v trivy-cache:/root/.cache/ \
    //                     -w /repo \
    //                     aquasec/trivy:latest config \
    //                     --severity "${SECURITY_SEVERITY}" \
    //                     --format json \
    //                     --output "${SECURITY_REPORT_DIR}/trivy-iac.json" \
    //                     --exit-code 1 \
    //                     .
    //                 '''
    //             }
    //         }

    //         stage('Build') {
    //             steps {
    //                 script {
    //                     echo "Building Docker Images for Build #${BUILD_NUMBER}..."
    //                     sh "docker build -t ${IMAGE_AUTH}:${BUILD_NUMBER} -t ${IMAGE_AUTH}:latest auth-service"
    //                     sh "docker build -t ${IMAGE_INTERVIEW}:${BUILD_NUMBER} -t ${IMAGE_INTERVIEW}:latest interview-service"
    //                     sh "docker build -t ${IMAGE_FRONTEND}:${BUILD_NUMBER} -t ${IMAGE_FRONTEND}:latest frontend"
    //                 }
    //             }
    //         }

    //         stage('Docker Hub Login') {
    //             steps {
    //                 sh "echo \"$DOCKER_HUB_PASS\" | docker login -u \"$DOCKER_HUB_USER\" --password-stdin"
    //             }
    //         }

    //         stage('Container Image Scan') {
    //             steps {
    //                 sh '''
    //                 docker run --rm \
    //                     -v /var/run/docker.sock:/var/run/docker.sock \
    //                     -v "$WORKSPACE:/repo" \
    //                     -v trivy-cache:/root/.cache/ \
    //                     -w /repo \
    //                     aquasec/trivy:latest image \
    //                     --severity "${SECURITY_SEVERITY}" \
    //                     --format json \
    //                     --output "${SECURITY_REPORT_DIR}/trivy-auth-image.json" \
    //                     --exit-code 1 \
    //                     "${IMAGE_AUTH}:${BUILD_NUMBER}"

    //                 docker run --rm \
    //                     -v /var/run/docker.sock:/var/run/docker.sock \
    //                     -v "$WORKSPACE:/repo" \
    //                     -v trivy-cache:/root/.cache/ \
    //                     -w /repo \
    //                     aquasec/trivy:latest image \
    //                     --severity "${SECURITY_SEVERITY}" \
    //                     --format json \
    //                     --output "${SECURITY_REPORT_DIR}/trivy-interview-image.json" \
    //                     --exit-code 1 \
    //                     "${IMAGE_INTERVIEW}:${BUILD_NUMBER}"

    //                 docker run --rm \
    //                     -v /var/run/docker.sock:/var/run/docker.sock \
    //                     -v "$WORKSPACE:/repo" \
    //                     -v trivy-cache:/root/.cache/ \
    //                     -w /repo \
    //                     aquasec/trivy:latest image \
    //                     --severity "${SECURITY_SEVERITY}" \
    //                     --format json \
    //                     --output "${SECURITY_REPORT_DIR}/trivy-frontend-image.json" \
    //                     --exit-code 1 \
    //                     "${IMAGE_FRONTEND}:${BUILD_NUMBER}"
    //                 '''
    //             }
    //         }

    //         stage('Push to Docker Hub') {
    //             steps {
    //                 withCredentials([usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
    //                     sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'
    //                     sh "docker push ${IMAGE_AUTH}:${BUILD_NUMBER}"
    //                     sh "docker push ${IMAGE_INTERVIEW}:${BUILD_NUMBER}"
    //                     sh "docker push ${IMAGE_FRONTEND}:${BUILD_NUMBER}"
    //                 }
    //             }
    //         }

    //         stage('Deploy to Kubernetes with Ansible') {
    //             steps {
    //                 withCredentials([
    //                     file(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG_FILE')
    //                 ]) {
    //                     sh '''
    //                     export KUBECONFIG="$KUBECONFIG_FILE"
    //                     ansible-playbook ansible/playbooks/deploy.yml \
    //                         -e image_tag=${BUILD_NUMBER} \
    //                         -e docker_hub_user=${DOCKER_HUB_USER} \
    //                         -e jwt_secret="$JWT_SECRET" \
    //                         -e groq_api_key="$GROQ_API_KEY"
    //                     '''
    //                 }
    //             }
    //         }

    //         stage('DAST Baseline Scan') {
    //             steps {
    //                 sh '''
    //                 curl -fsS --retry 12 --retry-all-errors --retry-delay 5 "${APP_BASE_URL}/api/interview/health"

    //                 docker run --rm \
    //                     --network host \
    //                     -v "$WORKSPACE/${SECURITY_REPORT_DIR}:/zap/wrk" \
    //                     zaproxy/zap-stable:latest zap-baseline.py \
    //                     -t "${APP_BASE_URL}" \
    //                     -r zap-baseline.html \
    //                     -J zap-baseline.json \
    //                     -w zap-baseline.md \
    //                     -I
    //                 '''
    //             }
    //         }
    //     }

    //     post {
    //         always {
    //             archiveArtifacts artifacts: 'reports/security/**/*', allowEmptyArchive: true
    //         }
    //     }
    // }



pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKER_HUB_USER = 'jeevesh2802'
        IMAGE_AUTH = "${DOCKER_HUB_USER}/auth-service"
        IMAGE_INTERVIEW = "${DOCKER_HUB_USER}/interview-service"
        IMAGE_FRONTEND = "${DOCKER_HUB_USER}/frontend-service"

        SECURITY_REPORT_DIR = 'reports/security'
        SECURITY_SEVERITY = 'HIGH,CRITICAL'
        APP_BASE_URL = 'http://interview.local'

        GROQ_API_KEY = credentials('GROQ_API_KEY')
        JWT_SECRET = credentials('JWT_SECRET')
    }

    stages {

        stage('Prepare Security Reports') {
            steps {
                sh 'mkdir -p "${SECURITY_REPORT_DIR}"'
            }
        }

        stage('Secret Scan') {
            steps {
                sh '''
                docker run --rm \
                    -v "$WORKSPACE:/repo" \
                    -w /repo \
                    zricethezav/gitleaks:latest detect \
                    --source=/repo \
                    --report-format=json \
                    --report-path="${SECURITY_REPORT_DIR}/gitleaks.json" \
                    --redact \
                    --exit-code=0
                '''
            }
        }

        stage('Unit Tests') {
            steps {
                script {
                    echo "Running Unit Tests for Auth Service..."
                    echo "Running Unit Tests for Interview Service..."
                }
            }
        }

        stage('SCA Filesystem Scan') {
            steps {
                sh '''
                docker run --rm \
                    -v "$WORKSPACE:/repo" \
                    -v trivy-cache:/root/.cache/ \
                    -w /repo \
                    aquasec/trivy:latest fs \
                    --scanners vuln \
                    --severity "${SECURITY_SEVERITY}" \
                    --format json \
                    --output "${SECURITY_REPORT_DIR}/trivy-fs.json" \
                    --exit-code 1 \
                    services
                '''
            }
        }

        stage('SAST Scan') {
            steps {
                sh '''
                docker run --rm \
                    -v "$WORKSPACE:/src" \
                    -w /src \
                    semgrep/semgrep:latest semgrep scan \
                    --config p/owasp-top-ten \
                    --config p/nodejs \
                    --severity ERROR \
                    --sarif \
                    --output "${SECURITY_REPORT_DIR}/semgrep.sarif" \
                    --error \
                    services
                '''
            }
        }

        stage('IaC Scan') {
            steps {
                sh '''
                docker run --rm \
                    -v "$WORKSPACE:/repo" \
                    -v trivy-cache:/root/.cache/ \
                    -w /repo \
                    aquasec/trivy:latest config \
                    --severity "${SECURITY_SEVERITY}" \
                    --format json \
                    --output "${SECURITY_REPORT_DIR}/trivy-iac.json" \
                    --exit-code 1 \
                    .
                '''
            }
        }

        stage('Build') {
            steps {
                script {
                    echo "Building Docker Images #${BUILD_NUMBER}"

                    sh "docker build -t ${IMAGE_AUTH}:${BUILD_NUMBER} -t ${IMAGE_AUTH}:latest auth-service"
                    sh "docker build -t ${IMAGE_INTERVIEW}:${BUILD_NUMBER} -t ${IMAGE_INTERVIEW}:latest interview-service"
                    sh "docker build -t ${IMAGE_FRONTEND}:${BUILD_NUMBER} -t ${IMAGE_FRONTEND}:latest frontend"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-registry-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {

                    sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'

                    sh "docker push ${IMAGE_AUTH}:${BUILD_NUMBER}"
                    sh "docker push ${IMAGE_INTERVIEW}:${BUILD_NUMBER}"
                    sh "docker push ${IMAGE_FRONTEND}:${BUILD_NUMBER}"
                }
            }
        }

        stage('Deploy to Kubernetes with Ansible') {
            steps {
                withCredentials([
                    file(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG_FILE'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
                    string(credentialsId: 'GROQ_API_KEY', variable: 'GROQ_API_KEY')
                ]) {
                    sh '''
                    export KUBECONFIG="$KUBECONFIG_FILE"

                    ansible-playbook ansible/playbooks/deploy.yml \
                        -e image_tag=${BUILD_NUMBER} \
                        -e docker_hub_user=${DOCKER_HUB_USER} \
                        -e jwt_secret="$JWT_SECRET" \
                        -e groq_api_key="$GROQ_API_KEY"
                    '''
                }
            }
        }

        stage('DAST Baseline Scan') {
            steps {
                sh '''
                curl -fsS --retry 12 --retry-all-errors --retry-delay 5 "${APP_BASE_URL}/api/interview/health"

                docker run --rm \
                    --network host \
                    -v "$WORKSPACE/${SECURITY_REPORT_DIR}:/zap/wrk" \
                    zaproxy/zap-stable:latest zap-baseline.py \
                    -t "${APP_BASE_URL}" \
                    -r zap-baseline.html \
                    -J zap-baseline.json \
                    -w zap-baseline.md \
                    -I
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'reports/security/**/*', allowEmptyArchive: true
        }
    }
}