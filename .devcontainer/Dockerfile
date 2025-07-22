# Python 3.10をベースとしたDevContainer
FROM mcr.microsoft.com/devcontainers/python:1-3.10-bullseye

# 非rootユーザーで実行
ARG USERNAME=vscode
USER $USERNAME

# MySQL クライアントツールのインストール
USER root
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        mariadb-client \
        curl \
        wget \
        git \
        vim \
        tree \
        jq \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

USER $USERNAME

# Python依存関係の事前インストール用ディレクトリ
WORKDIR /tmp/pip-tmp

# よく使用される Python パッケージの事前インストール
COPY requirements-dev.txt* ./
RUN python -m pip install --upgrade pip \
    && if [ -f "requirements-dev.txt" ]; then pip install -r requirements-dev.txt; fi \
    && pip install \
        fastapi \
        uvicorn[standard] \
        sqlalchemy \
        alembic \
        pymysql \
        python-jose[cryptography] \
        passlib[bcrypt] \
        python-multipart \
        boto3 \
        pydantic \
        pytest \
        pytest-asyncio \
        pytest-cov \
        black \
        flake8 \
        mypy \
    && rm -rf /tmp/pip-tmp

# 作業ディレクトリを設定
WORKDIR /workspace

# デフォルトシェルをbashに設定
ENV SHELL /bin/bash 