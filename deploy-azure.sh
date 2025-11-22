#!/bin/bash

# Azure Deployment Script for CraftBid
# This script deploys the application to Azure App Service

set -e

echo "🚀 Starting Azure Deployment for CraftBid..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed${NC}"
    echo "Please install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

echo -e "${GREEN}✅ Azure CLI is installed${NC}"

# Check if logged in
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Azure. Please login...${NC}"
    az login
fi

echo -e "${GREEN}✅ Logged in to Azure${NC}"

# Configuration
RESOURCE_GROUP="craftbid-rg"
APP_NAME="craftbid-app"
LOCATION="westeurope"
MYSQL_SERVER_NAME="craftbid-mysql-server"
MYSQL_DATABASE_NAME="craftbid"
MYSQL_ADMIN_USER="craftbidadmin"
MYSQL_ADMIN_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

echo ""
echo "📋 Deployment Configuration:"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   App Name: $APP_NAME"
echo "   Location: $LOCATION"
echo "   MySQL Server: $MYSQL_SERVER_NAME"
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Step 1: Create Resource Group
echo ""
echo "📦 Step 1: Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION || echo "Resource group already exists"

# Step 2: Create MySQL Server
echo ""
echo "📦 Step 2: Creating Azure Database for MySQL..."
az mysql flexible-server create \
    --resource-group $RESOURCE_GROUP \
    --name $MYSQL_SERVER_NAME \
    --location $LOCATION \
    --admin-user $MYSQL_ADMIN_USER \
    --admin-password $MYSQL_ADMIN_PASSWORD \
    --sku-name Standard_B1ms \
    --tier Burstable \
    --version 8.0.21 \
    --storage-size 32 \
    --public-access 0.0.0.0 \
    || echo "MySQL server might already exist"

# Step 3: Create MySQL Database
echo ""
echo "📦 Step 3: Creating MySQL Database..."
az mysql flexible-server db create \
    --resource-group $RESOURCE_GROUP \
    --server-name $MYSQL_SERVER_NAME \
    --database-name $MYSQL_DATABASE_NAME \
    || echo "Database might already exist"

# Step 4: Get MySQL connection details
echo ""
echo "📦 Step 4: Getting MySQL connection details..."
MYSQL_HOST=$(az mysql flexible-server show \
    --resource-group $RESOURCE_GROUP \
    --name $MYSQL_SERVER_NAME \
    --query fullyQualifiedDomainName -o tsv)

echo "   MySQL Host: $MYSQL_HOST"

# Step 5: Create App Service Plan
echo ""
echo "📦 Step 5: Creating App Service Plan..."
az appservice plan create \
    --name "${APP_NAME}-plan" \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --is-linux \
    --sku B1 \
    || echo "App Service Plan might already exist"

# Step 6: Create Web App with Docker Compose
echo ""
echo "📦 Step 6: Creating Web App..."
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan "${APP_NAME}-plan" \
    --name $APP_NAME \
    --multicontainer-config-type compose \
    --multicontainer-config-file docker-compose.azure.yml \
    || echo "Web App might already exist"

# Step 7: Configure App Settings
echo ""
echo "📦 Step 7: Configuring App Settings..."
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --settings \
        DB_HOST="$MYSQL_HOST" \
        DB_DATABASE="$MYSQL_DATABASE_NAME" \
        DB_USERNAME="$MYSQL_ADMIN_USER" \
        DB_PASSWORD="$MYSQL_ADMIN_PASSWORD" \
        APP_URL="https://${APP_NAME}.azurewebsites.net" \
        VITE_API_BASE_URL="https://${APP_NAME}.azurewebsites.net" \
        GOOGLE_REDIRECT_URI="https://${APP_NAME}.azurewebsites.net/api/auth/google/callback" \
    || echo "Failed to set app settings"

# Step 8: Enable Always On
echo ""
echo "📦 Step 8: Enabling Always On..."
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --always-on true

# Step 9: Get App URL
echo ""
echo "📦 Step 9: Getting App URL..."
APP_URL=$(az webapp show \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --query defaultHostName -o tsv)

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ✅ Deployment Completed Successfully!              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "🌐 Your application is available at:"
echo "   https://$APP_URL"
echo ""
echo "📝 Important Information:"
echo "   MySQL Host: $MYSQL_HOST"
echo "   MySQL Database: $MYSQL_DATABASE_NAME"
echo "   MySQL Username: $MYSQL_ADMIN_USER"
echo "   MySQL Password: $MYSQL_ADMIN_PASSWORD"
echo ""
echo "⚠️  Please save the MySQL password securely!"
echo ""
echo "📋 Next Steps:"
echo "   1. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in App Settings"
echo "   2. Configure REVERB_APP_ID, REVERB_APP_KEY, REVERB_APP_SECRET"
echo "   3. Run migrations: az webapp ssh --resource-group $RESOURCE_GROUP --name $APP_NAME"
echo ""

