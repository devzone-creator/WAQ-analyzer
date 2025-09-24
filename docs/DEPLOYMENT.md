# Deployment Guide

## Toolforge Deployment

Toolforge is Wikimedia's cloud computing platform designed for hosting tools and bots that support Wikipedia and other Wikimedia projects. This guide covers deploying the Wikipedia Article Quality Analyzer on Toolforge.

### Prerequisites

1. **Toolforge Account**: Request access at [toolforge.org](https://toolforge.org)
2. **SSH Access**: Set up SSH keys for secure access
3. **Basic Linux Knowledge**: Familiarity with command line operations

### Deployment Steps

#### 1. Access Toolforge

```bash
# SSH into the login server
ssh your-username@login.toolforge.org

# Navigate to your tool directory
cd /data/project/your-tool-name
```

#### 2. Clone and Setup

```bash
# Clone your repository
git clone https://github.com/your-username/wikipedia-quality-analyzer.git
cd wikipedia-quality-analyzer

# Install dependencies (Node.js 18+ should be available)
npm install

# Build the application
npm run build
```

#### 3. Configure Web Service

Create a `service.template` file:

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

#### 4. Create Deployment Configuration

Create a `deployment.yaml` file:

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
      - name: wikipedia-quality-analyzer
        image: node:18-alpine
        ports:
        - containerPort: 8000
        workingDir: /app
        command: ["npx", "serve", "-s", "dist", "-l", "8000"]
        volumeMounts:
        - name: app-volume
          mountPath: /app
      volumes:
      - name: app-volume
        hostPath:
          path: /data/project/your-tool-name/wikipedia-quality-analyzer
```

#### 5. Deploy to Kubernetes

```bash
# Apply the deployment
kubectl apply -f deployment.yaml
kubectl apply -f service.template

# Check deployment status
kubectl get pods
kubectl get services
```

#### 6. Configure Ingress (Optional)

For custom domain access, create an `ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: wikipedia-quality-analyzer-ingress
spec:
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

### Alternative: Simple Web Service

For a simpler deployment, use Toolforge's web service feature:

```bash
# Become the tool
become your-tool-name

# Start a web service
webservice --backend=kubernetes node18 start

# Your app will be available at:
# https://your-tool-name.toolforge.org
```

### Environment Configuration

#### Production Build Optimization

Update `vite.config.ts` for production:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Adjust if deployed in subdirectory
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable for production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

#### CORS Configuration

Since the app runs on Toolforge but calls Wikipedia APIs, ensure CORS is properly handled:

```typescript
// In wikipediaApi.ts, all requests include origin=* parameter
const response = await fetch(
  `${WIKIPEDIA_API_ACTION}?action=opensearch&search=${encodeURIComponent(query)}&limit=5&format=json&origin=*`
);
```

### Monitoring and Maintenance

#### Health Checks

Create a simple health check endpoint by adding a `health.html` file to your `dist` folder:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Health Check</title>
</head>
<body>
    <h1>Wikipedia Quality Analyzer - OK</h1>
    <p>Service is running normally</p>
    <p>Timestamp: <span id="timestamp"></span></p>
    <script>
        document.getElementById('timestamp').textContent = new Date().toISOString();
    </script>
</body>
</html>
```

#### Logging

Monitor your application through Toolforge's logging system:

```bash
# View application logs
kubectl logs deployment/wikipedia-quality-analyzer

# Follow logs in real-time
kubectl logs -f deployment/wikipedia-quality-analyzer
```

#### Updates and Maintenance

```bash
# Update the application
git pull origin main
npm install
npm run build

# Restart the service
kubectl rollout restart deployment/wikipedia-quality-analyzer
```

### Security Considerations

1. **No Sensitive Data**: The application doesn't store user data or require authentication
2. **API Rate Limiting**: Wikipedia APIs have built-in rate limiting
3. **HTTPS**: Toolforge provides HTTPS by default
4. **Content Security Policy**: Consider adding CSP headers

### Troubleshooting

#### Common Issues

1. **Build Failures**: Ensure Node.js 18+ is available
2. **Memory Issues**: Increase memory limits in deployment.yaml
3. **Network Issues**: Check CORS configuration
4. **Permission Issues**: Ensure proper file permissions

#### Debug Commands

```bash
# Check pod status
kubectl describe pod <pod-name>

# View detailed logs
kubectl logs <pod-name> --previous

# Access pod shell
kubectl exec -it <pod-name> -- /bin/sh
```

### Performance Optimization

1. **Static Asset Caching**: Configure proper cache headers
2. **Compression**: Enable gzip compression
3. **CDN**: Consider using a CDN for static assets
4. **Bundle Optimization**: Use code splitting and lazy loading

### Backup and Recovery

```bash
# Backup your tool data
tar -czf backup-$(date +%Y%m%d).tar.gz /data/project/your-tool-name/

# Store backups in a safe location
cp backup-*.tar.gz /data/project/your-tool-name/backups/
```

## Alternative Deployment Options

### GitHub Pages
For a simple static deployment:

```bash
# Build and deploy to GitHub Pages
npm run build
npm install -g gh-pages
gh-pages -d dist
```

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts for deployment

The Toolforge deployment is recommended for Wikipedia-related tools as it's specifically designed for the Wikimedia ecosystem and provides excellent performance for Wikipedia API calls.