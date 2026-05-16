# HashiCorp Vault Setup Guide for Scholar's Study

Follow these steps to integrate HashiCorp Vault with your Jenkins CI/CD pipeline.

## 1. Install & Initialize Vault
If you are running locally for testing:
```bash
# Install Vault
sudo apt-get update && sudo apt-get install vault

# Start Vault in Dev Mode (Not for production!)
vault server -dev -dev-listen-address="0.0.0.0:8200"
```
*Note the Root Token provided in the console.*

## 2. Configure Vault KV Storage
Open a new terminal and set the Vault address:
```bash
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='your_root_token'

# Enable Key-Value Engine v2
vault secrets enable -path=secret kv-v2

# Store Scholar's Study Secrets
vault kv put secret/scholar-study/api-keys \
    groq_key="gsk_your_actual_groq_api_key" \
    jwt_secret="your_secure_jwt_secret_123"
```

## 3. Configure AppRole for Jenkins
AppRole is the secure way for Jenkins to authenticate with Vault.

```bash
# Enable AppRole Auth
vault auth enable approle

# Create a Policy for Jenkins
cat <<EOF > jenkins-policy.hcl
path "secret/data/scholar-study/*" {
  capabilities = ["read"]
}
EOF

vault policy write scholar-study-policy jenkins-policy.hcl

# Create the AppRole
vault write auth/approle/role/scholar-study-role \
    token_policies="scholar-study-policy" \
    token_ttl=1h \
    token_max_ttl=4h

# Get RoleID and SecretID (Store these in Jenkins)
vault read auth/approle/role/scholar-study-role/role-id
vault write -f auth/approle/role/scholar-study-role/secret-id
```

## 4. Jenkins Configuration
1. **Install Plugin**: Go to `Manage Jenkins` > `Plugins` > `HashiCorp Vault`.
2. **Add Credentials**:
   - `Kind`: Vault AppRole Credential
   - `Role ID`: (From step 3)
   - `Secret ID`: (From step 3)
   - `ID`: `vault-approle-creds`
3. **Configure System**: Go to `Manage Jenkins` > `System`. Find `Vault Plugin` and set the `Vault URL` to `http://<your-vault-ip>:8200`.

## 5. Using Secrets in Pipeline
The `Jenkinsfile` is already configured to use these secrets. They will be available as variables (`GROQ_API_KEY`, `JWT_SECRET`) within the `vault` block and masked in all logs.
