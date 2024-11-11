# Build Your Own PaaS/IDP on DigitalOcean

Creating a custom cloud platform brings powerful advantages—cost savings, full control, data sovereignty, and, crucially, the ability to make your solution self-hostable. By using DigitalOcean's affordable infrastructure, you can save thousands per month compared to AWS Lambda, Vercel, Cloudflare, or similar providers.

[![Watch the Video](https://github.com/user-attachments/assets/3fbfd103-bb35-47a2-8f0a-807f09e00adb)](https://www.youtube.com/watch?v=T4b5Vf9V1zQ)

This repository leverages [Spore-drive](https://www.npmjs.com/package/@taubyte/spore-drive) to deploy [Tau](https://github.com/taubyte/tau), an open-source PaaS/IDP, all through code. Read the full guide in [this article](https://medium.com/@fodil.samy/spore-drive-building-a-cloud-platform-in-a-few-lines-of-code-bd3730a95cde).

## Getting Started

1. **Install Dependencies**  
   Run the following command to install the necessary packages:
   ```bash
   npm install
   ```

2. **Set Environment Variables**  
   Configure your DigitalOcean API token and project name:
   ```bash
   export DIGITALOCEAN_API_TOKEN="<your DigitalOcean token>"
   export DIGITALOCEAN_PROJECT_NAME="<your project name>"
   ```
   > **Note**: This setup will deploy across all droplets within your specified project.
   
   If you use Namecheap for domain management, enable automatic DNS updates by providing these variables:
   ```bash
   export NAMECHEAP_API_KEY="<your Namecheap API key>"
   export NAMECHEAP_IP="<your IP address>"
   export NAMECHEAP_USERNAME="<your Namecheap username>"
   ```

3. **Deploy**  
   Finally, deploy your platform with:
   ```bash
   npm run displace
   ```
