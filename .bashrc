# Makeoo プロジェクト専用 .bashrc
# このファイルはプロジェクトルートに配置され、開発環境設定を自動化します

# AWS 設定
export AWS_PROFILE=shota
export AWS_REGION=ap-northeast-1

# Node.js 設定
export NODE_ENV=development

# プロジェクト固有のコマンドエイリアス
alias aws-deploy='export AWS_PROFILE=shota && ./scripts/aws-deploy.sh'
alias aws-deploy-dev='export AWS_PROFILE=shota && ./scripts/aws-deploy.sh dev'
alias aws-deploy-prod='export AWS_PROFILE=shota && ./scripts/aws-deploy.sh prod'
alias aws-info='export AWS_PROFILE=shota && cd infra && ./scripts/deploy.sh info'
alias aws-remove='export AWS_PROFILE=shota && cd infra && ./scripts/deploy.sh remove'

# 開発用ショートカット
alias dev-start='npm run dev'
alias dev-build='npm run build'
alias dev-test='npm test'
alias dev-lint='npm run lint'

# Docker ショートカット
alias docker-up='npm run docker:up'
alias docker-down='npm run docker:down'
alias docker-logs='npm run docker:logs'
alias docker-reset='npm run docker:reset'

# Makeoo プロジェクト環境の確認
echo "🌱 Makeoo DIY Platform - Development Environment"
echo "AWS Profile: $AWS_PROFILE"
echo "AWS Region: $AWS_REGION"
echo ""
echo "利用可能なコマンド:"
echo "  aws-deploy-dev  - 開発環境にデプロイ"
echo "  aws-deploy-prod - 本番環境にデプロイ" 
echo "  aws-info        - デプロイ情報表示"
echo "  dev-start       - 開発サーバー起動"
echo "  docker-up       - Dockerサービス起動"
echo ""