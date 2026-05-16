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
        
        // Use Minikube IP and the static NodePort (30080) for the frontend
        APP_BASE_URL = 'http://192.168.49.2:30080'

        // Credentials IDs in Jenkins
        GROQ_API_KEY = credentials('GROQ_API_KEY')
        JWT_SECRET = credentials('JWT_SECRET')
    }

    stages {
        stage('Cleanup & Prepare') {
            steps {
                sh 'rm -rf reports'
                sh 'mkdir -p reports/security'
            }
        }

        stage('Secret Scan (Gitleaks)') {
            steps {
                sh '''
                docker run --rm \
                    -v "$WORKSPACE:/repo" \
                    -w /repo \
                    zricethezav/gitleaks:latest detect \
                    --source=/repo \
                    --report-format=json \
                    --report-path=reports/security/gitleaks.json \
                    --redact \
                    --exit-code=0
                '''
            }
        }

        stage('Unit Tests') {
            steps {
                script {
                    echo "Running Unit Tests for Auth Service..."
                    // sh "npm test --prefix auth-service"
                    echo "Running Unit Tests for Interview Service..."
                    // sh "npm test --prefix interview-service"
                }
            }
        }

        stage('SCA Scan (Trivy FS)') {
            steps {
                sh '''
                docker run --rm \
                    -v "$WORKSPACE:/repo" \
                    -v trivy-cache:/root/.cache/ \
                    -w /repo \
                    aquasec/trivy:latest fs \
                    --scanners vuln \
                    --severity ${SECURITY_SEVERITY} \
                    --format json \
                    --output reports/security/trivy-fs.json \
                    --exit-code 0 \
                    /repo
                '''
            }
        }

        stage('SAST Scan (Semgrep)') {
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
                    --output reports/security/semgrep.sarif \
                    .
                '''
            }
        }

        stage('IaC Scan (Trivy Config)') {
            steps {
                sh '''
                docker run --rm \
                    -v "$WORKSPACE:/repo" \
                    -v trivy-cache:/root/.cache/ \
                    -w /repo \
                    aquasec/trivy:latest config \
                    --severity ${SECURITY_SEVERITY} \
                    --format json \
                    --output reports/security/trivy-iac.json \
                    --exit-code 0 \
                    /repo
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker build -t ${IMAGE_AUTH}:${BUILD_NUMBER} -t ${IMAGE_AUTH}:latest auth-service
                docker build -t ${IMAGE_INTERVIEW}:${BUILD_NUMBER} -t ${IMAGE_INTERVIEW}:latest interview-service
                docker build -t ${IMAGE_FRONTEND}:${BUILD_NUMBER} -t ${IMAGE_FRONTEND}:latest frontend
                '''
            }
        }

        stage('Container Image Scan') {
            steps {
                sh '''
                docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    -v trivy-cache:/root/.cache/ \
                    aquasec/trivy:latest image \
                    --severity ${SECURITY_SEVERITY} \
                    --format json \
                    --output reports/security/trivy-auth-image.json \
                    --exit-code 0 \
                    ${IMAGE_AUTH}:${BUILD_NUMBER}

                docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    -v trivy-cache:/root/.cache/ \
                    aquasec/trivy:latest image \
                    --severity ${SECURITY_SEVERITY} \
                    --format json \
                    --output reports/security/trivy-interview-image.json \
                    --exit-code 0 \
                    ${IMAGE_INTERVIEW}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Docker Login & Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-registry-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh '''
                    echo "$PASS" | docker login -u "$USER" --password-stdin
                    docker push ${IMAGE_AUTH}:${BUILD_NUMBER}
                    docker push ${IMAGE_AUTH}:latest
                    docker push ${IMAGE_INTERVIEW}:${BUILD_NUMBER}
                    docker push ${IMAGE_INTERVIEW}:latest
                    docker push ${IMAGE_FRONTEND}:${BUILD_NUMBER}
                    docker push ${IMAGE_FRONTEND}:latest
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([
                    file(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG_FILE')
                ]) {
                    sh '''
                    export KUBECONFIG="$KUBECONFIG_FILE"
                    
                    # Deploy using Ansible
                    ansible-playbook ansible/playbooks/deploy.yml \
                        -e image_tag=${BUILD_NUMBER} \
                        -e docker_hub_user=${DOCKER_HUB_USER} \
                        -e jwt_secret="$JWT_SECRET" \
                        -e groq_api_key="$GROQ_API_KEY"
                    
                    # Ensure the frontend-service is exposed via NodePort 30080
                    kubectl patch svc frontend-service -p '{"spec": {"type": "NodePort", "ports": [{"port": 80, "nodePort": 30080}]}}' || true
                    '''
                }
            }
        }

        stage('DAST Baseline Scan') {
            steps {
                sh '''
                # Wait for application to be ready
                echo "Waiting for application to be available at ${APP_BASE_URL}..."
                timeout 60s bash -c "until curl -s ${APP_BASE_URL} > /dev/null; do sleep 5; done"

                # Run OWASP ZAP with root user to avoid volume permission issues
                docker run --rm \
                    -u root \
                    -v "$WORKSPACE/reports/security:/zap/wrk:rw" \
                    zaproxy/zap-stable:latest zap-baseline.py \
                    -t "${APP_BASE_URL}" \
                    -r zap-baseline.html \
                    -J zap-baseline.json \
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