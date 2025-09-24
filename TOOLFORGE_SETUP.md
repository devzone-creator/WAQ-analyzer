# Toolforge Deployment Setup

This guide provides step-by-step instructions for deploying the Wikipedia Article Quality Analyzer on Wikimedia Toolforge.

## Prerequisites

1. **Toolforge Account**: Apply for access at [toolforge.org](https://toolforge.org)
2. **SSH Key**: Set up SSH key authentication
3. **Tool Approval**: Your tool must be approved by Toolforge administrators

## Step 1: Initial Setup

### Request Tool Account
1. Visit [Toolforge Tool Account Request](https://toolforge.org/admin/tool/create)
2. Fill out the form with tool details:
   - **Tool Name**: `wikipedia-quality-analyzer`
   - **Description**: "Analyzes Wikipedia articles for quality metrics including readability, citations, references, and structure"
   - **Purpose**: "Help Wikipedia editors improve article quality and prioritize editing efforts"

### SSH Access Setup
```bash
# Generate SSH key if you don't have one
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Add your public key to Toolforge
# Visit: https://toolforge.org/admin/ssh-keys
```

## Step 2: Access Toolforge

```bash
# SSH into the login server
ssh your-username@login.toolforge.org

# Become your tool
become wikipedia-quality-analyzer
```

## Step 3: Deploy Application

### Clone and Build
```bash
# Navigate to tool directory
cd /data/project/wikipedia-quality-analyzer

# Clone repository
git clone https://github.com/your-username/wikipedia-quality-analyzer.git app
cd app

# Install dependencies
npm install

# Build for production
npm run build
```

### Create Service Files

Create `start.sh`:
```bash
#!/bin/bash
cd /data/project/wikipedia-quality-analyzer/app
npx serve -s dist -l 8000
```

Make it executable:
```bash
chmod +x start.sh
```

### Configure Web Service

Create `service.template`:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: wikipedia-quality-analyzer
  labels:
    name: wikipedia-quality-analyzer
    toolforge: tool
spec:
  type: NodePort
  ports:
  - port: 8000
    targetPort: 8000
    protocol: TCP
  selector:
    name: wikipedia-quality-analyzer
    toolforge: tool
```

Create `deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wikipedia-quality-analyzer
  labels:
    toolforge: tool
spec:
  replicas: 1
  selector:
    matchLabels:
      name: wikipedia-quality-analyzer
      toolforge: tool
  template:
    metadata:
      labels:
        name: wikipedia-quality-analyzer
        toolforge: tool
    spec:
      containers:
      - name: app
        image: node:18-alpine
        ports:
        - containerPort: 8000
        workingDir: /data/project/wikipedia-quality-analyzer/app
        command: ["./start.sh"]
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## Step 4: Deploy to Kubernetes

```bash
# Apply configurations
kubectl apply -f service.template
kubectl apply -f deployment.yaml

# Check status
kubectl get pods
kubectl get services

# View logs
kubectl logs deployment/wikipedia-quality-analyzer
```

## Step 5: Configure Domain Access

Your tool will be available at:
`https://wikipedia-quality-analyzer.toolforge.org`

### Custom Ingress (Optional)
Create `ingress.yaml`:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: wikipedia-quality-analyzer-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - wikipedia-quality-analyzer.toolforge.org
    secretName: wikipedia-quality-analyzer-tls
  rules:
  - host: wikipedia-quality-analyzer.toolforge.org
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: wikipedia-quality-analyzer
            port:
              number: 8000
```

Apply ingress:
```bash
kubectl apply -f ingress.yaml
```

## Step 6: Monitoring and Maintenance

### Health Monitoring
Create `healthcheck.sh`:
```bash
#!/bin/bash
curl -f https://wikipedia-quality-analyzer.toolforge.org/health || exit 1
```

### Log Monitoring
```bash
# View real-time logs
kubectl logs -f deployment/wikipedia-quality-analyzer

# View pod details
kubectl describe pod <pod-name>
```

### Update Deployment
```bash
# Pull latest changes
git pull origin main

# Rebuild
npm run build

# Restart deployment
kubectl rollout restart deployment/wikipedia-quality-analyzer
```

## Step 7: Performance Optimization

### Resource Limits
Adjust resources in `deployment.yaml` based on usage:
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "200m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Caching Strategy
Add nginx configuration for static assets:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Troubleshooting

### Common Issues

1. **Pod Not Starting**
   ```bash
   kubectl describe pod <pod-name>
   kubectl logs <pod-name>
   ```

2. **Service Not Accessible**
   ```bash
   kubectl get services
   kubectl get ingress
   ```

3. **Build Failures**
   ```bash
   # Check Node.js version
   node --version
   
   # Clear npm cache
   npm cache clean --force
   ```

4. **Memory Issues**
   ```bash
   # Increase memory limits in deployment.yaml
   # Monitor usage with:
   kubectl top pods
   ```

### Debug Commands
```bash
# Access pod shell
kubectl exec -it <pod-name> -- /bin/sh

# Check service endpoints
kubectl get endpoints

# View events
kubectl get events --sort-by=.metadata.creationTimestamp
```

## Security Considerations

1. **No Sensitive Data**: Application doesn't store user data
2. **API Rate Limiting**: Wikipedia APIs handle rate limiting
3. **HTTPS**: Toolforge provides SSL certificates
4. **Resource Limits**: Prevent resource exhaustion

## Backup Strategy

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /data/project/wikipedia-quality-analyzer/backups/backup_$DATE.tar.gz \
  /data/project/wikipedia-quality-analyzer/app

# Keep only last 7 backups
find /data/project/wikipedia-quality-analyzer/backups -name "backup_*.tar.gz" -mtime +7 -delete
```

## Monitoring Dashboard

Set up basic monitoring:
```bash
# Create monitoring script
#!/bin/bash
echo "=== Wikipedia Quality Analyzer Status ==="
echo "Deployment Status:"
kubectl get deployment wikipedia-quality-analyzer

echo "Pod Status:"
kubectl get pods -l name=wikipedia-quality-analyzer

echo "Service Status:"
kubectl get service wikipedia-quality-analyzer

echo "Recent Logs:"
kubectl logs deployment/wikipedia-quality-analyzer --tail=10
```

## Support and Resources

- **Toolforge Documentation**: [wikitech.wikimedia.org/wiki/Portal:Toolforge](https://wikitech.wikimedia.org/wiki/Portal:Toolforge)
- **Toolforge Help**: `#wikimedia-cloud` on Libera.Chat IRC
- **Status Page**: [toolforge-status.wikimedia.org](https://toolforge-status.wikimedia.org)

Your Wikipedia Article Quality Analyzer is now deployed and ready to help Wikipedia editors improve article quality!