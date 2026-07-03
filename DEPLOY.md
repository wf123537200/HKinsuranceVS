# Policy Vector (HKinsuranceVS) 自动部署配置指南

## 当前部署目标

- **GitHub 仓库**：`wf123537200/HKinsuranceVS`
- **服务器目录**：`/opt/apps/HKinsuranceVS`
- **GitHub Actions 工作流**：`.github/workflows/deploy.yml`
- **触发方式**：push 到 `main` 后自动部署
- **不要碰**：`/opt/apps/aiTools4me`（独立部署、共享 1.9GiB 服务器资源）

---

## 工作流现在会做什么

每次 push 到 `main`，GitHub Actions 会：

```bash
# 在 runner 上
npm ci                           # 安装依赖
tar czf deploy.tar.gz .next public ...   # 打包

# rsync 上传到服务器 /tmp/policy-vector-deploy.tar.gz

# 在服务器
cd /opt/apps/HKinsuranceVS
git fetch origin main && git reset --hard origin/main
rm -rf .next
tar xzf /tmp/policy-vector-deploy.tar.gz
npm ci                # 仅当 lockfile 漂移
npx prisma generate   # 重生成客户端；不会触发 db push
pm2 restart policy-vector
```

关键约束：

- **不动 aitools4me**：端口 3000、pm2 进程 `aitools4me` 都禁止触碰
- **不动 prisma/dev.db**：CI 不会跑 `db push`，schema 变更由人工在服务器上执行
- **不动 .env.local**：服务器上自带，绝不会被覆盖
- **保留 2GB swap**：服务器只有 ~1.9GiB RAM，没有 swap 会 OOM

---

## 与 aiTools4me 的关键差异

| 维度 | aiTools4me | policy-vector (本项目) |
| --- | --- | --- |
| 部署包名 | `aitools4me-deploy.tar.gz` | `policy-vector-deploy.tar.gz` |
| pm2 进程名 | `aitools4me` | `policy-vector` |
| 监听端口 | 3000 | 3002 |
| Node 版本 | 20 | 22（next-intl 4 / prisma 7 / next 16 都期望新 Node） |
| 数据库 | Supabase (managed) | SQLite + Prisma 7（自有文件） |
| 部署是否改 DB | 否 | **否**（prisma generate 不动 schema 数据） |
| 部署是否改 .env | 否 | 否 |
| 版本号自增 | 是（`npm version patch` + CHANGELOG.md） | 否（保险产品 v0.1.0 不频繁发版，不需要） |

---

## 服务器前提条件

服务器上要提前准备好：

1. Node.js **22+**
2. npm
3. PM2
4. 项目目录已存在：`/opt/apps/HKinsuranceVS`
5. 该目录是 `wf123537200/HKinsuranceVS` 仓库的工作副本（`git remote -v` 可验证）
6. 服务器上有一份可用的 `.env.local`（CI 不会写）
7. PM2 进程名：`policy-vector`（已经跑着，CI restart 即可）
8. nginx 反向代理：443 → `127.0.0.1:3002`
9. **2GB swap 文件**（CI 第一次部署时会创建；也可以手动 `sudo fallocate -l 2G /swapfile`）

### 第一次部署前自查

```bash
cd /opt/apps/HKinsuranceVS
git remote -v
node -v       # 应 v22+
npm -v
pm2 list      # 应至少存在 aitools4me + policy-vector
ls .env.local # 应有 DATABASE_URL + Supabase + R2 keys
```

### 第一次部署前手工试跑

```bash
cd /opt/apps/HKinsuranceVS
git fetch origin main
git reset --hard origin/main
npm ci
npm run build
npx prisma generate
pm2 restart policy-vector
curl -I https://policy-vector.com/zh-CN   # HTTP/2 200
```

通了之后再让 CI 接力。

---

## GitHub Actions Secrets

去 GitHub 仓库 `wf123537200/HKinsuranceVS` → Settings → Secrets and variables → Actions：

- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_SSH_KEY`
- `SERVER_PORT`

> 这 4 个 secrets 跟 aiTools4me 共用同一份，不另开一套，因为是同一台机器、同一个 SSH 用户和密钥。

如果是当前 RackNerd VPS：

- `SERVER_HOST=192.227.219.254`
- `SERVER_USER=root`
- `SERVER_PORT=22`
- `SERVER_SSH_KEY=<私钥内容>`

---

## 服务器上的 .env.local

不再把生产 env 写进 GitHub Secrets。直接由你登录服务器时维护：

```bash
cd /opt/apps/HKinsuranceVS
nano .env.local
```

当前 `.env.local` 关键值：

```
DATABASE_URL="file:/opt/apps/HKinsuranceVS/prisma/dev.db"
AUTH_URL="https://policy-vector.com"
NEXT_PUBLIC_SITE_URL="https://policy-vector.com"
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=...
OPENAI_API_KEY=...
```

---

## nginx 配置（policy-vector.com → 3002）

由 certbot 自动生成的：
- `/etc/nginx/conf.d/policy-vector.com.conf`
- 监听 `80` + `443`，server_name 包含 `policy-vector.com` 与 `www.policy-vector.com`
- 80 → 301 → https，443 → `127.0.0.1:3002`

**严格不要在 443 加 default_server 把流量转发到 3000（aitools4me）。**
每个 server 块用 `server_name` 路由；如果 SSL 默认兜底丢给 aitools4me，policy-vector 会在某些 SSL 客户端拿到错误证书。

---

## 手动部署（如果 CI 挂掉）

```bash
ssh root@192.227.219.254
cd /opt/apps/HKinsuranceVS

git fetch origin main
git reset --hard origin/main
rm -rf .next
npm ci
npm run build
npx prisma generate

# 重启（端口 3002）
pm2 restart policy-vector
curl -I https://policy-vector.com/zh-CN
```

---

## schema migration（手动、不在 CI）

CI 跑 `prisma generate` 但**不会**自动跑 `prisma db push`。

如果改了 `prisma/schema.prisma`：

1. 本地跑：`npx prisma db push` 验证
2. commit + push
3. 服务器跑：`cd /opt/apps/HKinsuranceVS && npx prisma db push`（一次）

CI 接着就会跑 `prisma generate` 让 client 对齐 schema，发布流量。

---

## 紧急回滚

```bash
ssh root@192.227.219.254
cd /opt/apps/HKinsuranceVS

# 找到上一个绿色 build
git log --oneline -10

# 回滚到上一个 commit
git reset --hard <commit-hash>
npm ci
npm run build
npx prisma generate
pm2 restart policy-vector

# 验证
curl -I https://policy-vector.com/zh-CN
```

回滚不会自动触发 CI（因为没 push）。如果想永久撤销改动，用 `git revert` 后 push。

---

## 现在还需要你确认的事

- [x] 服务器 npm 包同步了（已推送 package-lock.json commit `703eef3`）
- [x] Prisma client / db 路径 bug 修了（commit `76211fe` + `a88c81a`）
- [x] 站点已在 `https://policy-vector.com/zh-CN` 上线
- [ ] 在 `wf123537200/HKinsuranceVS` Settings → Secrets 加 4 个 server secrets
- [ ] 等下一次 push 验证 CI 自动部署通过
