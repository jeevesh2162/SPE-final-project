#!/bin/bash
# Jenkins Agent Setup Script

# Install Docker
sudo apt-get update
sudo apt-get install -y docker.io
sudo usermod -aG docker jenkins

# Install Java 17 (Required for Jenkins Agent)
sudo apt-get install -y openjdk-17-jre

# Download Agent JAR
curl -sO http://localhost:8080/jnlpJars/agent.jar

# Run Agent (Replace with actual secret and URL)
# java -jar agent.jar -jnlpUrl http://jenkins-server:8080/computer/agent-name/jenkins-agent.jnlp -secret <SECRET> -workDir "/var/jenkins_home"
