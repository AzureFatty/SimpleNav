# Simple Navigation

中文文档 | [English](./README.md)

一个现代、优雅且高度可定制的导航网站，使用 React 和 Vite 构建。具有精美的液态玻璃设计、动态主题和流畅的动画效果。

![Simple Navigation 截图](/Users/zhou/.gemini/antigravity/brain/f89cd403-0f22-4822-b206-d54dc7901cbb/screenshot.png)

## ✨ 特性

- 🎨 **精美的 UI 设计** - 液态玻璃拟态效果，渐变背景和流畅动画
- 🎯 **高度可定制** - 通过 YAML 文件配置一切（标题、Logo、分区、颜色等）
- 🌈 **动态主题** - 随机渐变背景，每个分区可自定义主题色
- 📱 **响应式设计** - 完美适配桌面、平板和移动设备
- 🐳 **Docker 就绪** - 使用 Docker 和 Docker Compose 轻松部署
- ⚡ **快速轻量** - 使用 Vite 构建，性能优化
- 🔧 **配置简单** - 基于 YAML 的简单配置系统

## 🚀 快速开始

### 前置要求

- Node.js 18+ (或使用 Docker)
- npm 或 yarn

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/AzureFatty/SimpleNav.git
   cd nav
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **打开浏览器**
   访问 `http://localhost:5173`

### Docker 部署

1. **使用 Docker Compose（推荐）**
   ```bash
   docker-compose up -d
   ```

2. **直接使用 Docker**
   ```bash
   # 构建镜像
   docker build -t simple-nav .
   
   # 运行容器
   docker run -d -p 80:80 simple-nav
   ```

3. **访问应用**
   在浏览器中打开 `http://localhost`

## ⚙️ 配置说明

所有配置通过 `public/assets/conf/config.yml` 文件管理：

### 基础设置

```yaml
settings:
  columns: 4                    # 网格布局列数
  title: "Simple Navigation"   # 页面标题
  footer: "Simple Nav © 2025"  # 页脚文本
  logo: ""                      # 头部 Logo 路径（可选）
  favicon: ""                   # 网站图标路径（可选）
  notification: "欢迎使用！"     # 通知横幅消息
  actionButton:
    text: "关注我"
    url: "https://github.com/AzureFatty"
    icon: "assets/icons/github.png"
```

### 添加分区

每个分区可以有自己的主题色和项目：

```yaml
sections:
  - id: "search"
    title: "搜索与工具"
    description: "日常必备"
    themeColor: "bg-blue-300"           # 分区编号背景色
    hoverText: "group-hover:text-blue-700"
    hoverBg: "group-hover:bg-blue-100"
    hoverBorder: "group-hover:border-blue-700"
    items:
      - name: "Google"
        logo: "assets/icons/google.png"
        subtitle: "搜索引擎"
        tag: "search"
        url: "https://www.google.com"
```

### 添加图标

将图标文件放在 `public/assets/icons/` 目录下，然后在配置中引用：

```yaml
logo: "assets/icons/your-icon.png"
```

支持的格式：PNG、SVG、JPG

## 🎨 自定义

### 主题颜色

项目使用 Tailwind CSS。您可以通过以下方式自定义颜色：

1. 编辑 `tailwind.config.js` 进行全局主题更改
2. 在 `config.yml` 中使用 Tailwind 颜色类设置特定分区的主题

### 背景渐变

背景主题在页面加载时随机选择。编辑 `src/App.jsx` 添加更多主题：

```javascript
const themes = [
  { blob1: '#FFE5E5', blob2: '#E5F3FF', blob3: '#FFF5E5' },
  // 在这里添加您的自定义主题
];
```

## 📦 生产构建

```bash
npm run build
```

构建文件将输出到 `dist/` 目录。

## 🛠️ 技术栈

- **前端框架**: React 18
- **构建工具**: Vite 5
- **样式**: Tailwind CSS 3
- **图标**: Lucide React
- **配置解析**: js-yaml
- **Web 服务器**: Caddy (Docker)

## 📁 项目结构

```
nav/
├── public/
│   └── assets/
│       ├── conf/
│       │   └── config.yml      # 主配置文件
│       └── icons/              # 图标资源
├── src/
│   ├── App.jsx                 # 主应用组件
│   ├── App.css                 # 应用样式
│   └── main.jsx                # 应用入口
├── Dockerfile                  # Docker 构建配置
├── docker-compose.yml          # Docker Compose 配置
├── package.json                # 依赖和脚本
├── vite.config.js              # Vite 配置
└── tailwind.config.js          # Tailwind CSS 配置
```

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 许可证

本项目是开源的，采用 [MIT 许可证](LICENSE)。

## 🙏 致谢

- 图标来自各种来源（Google、GitHub 等）
- 灵感来自现代网页设计趋势
- 使用 React 和 Vite 用心构建
- Google Gemini

## 📧 联系方式

- GitHub: [@AzureFatty](https://github.com/AzureFatty)
- 项目链接: [https://github.com/AzureFatty/SimpleNav](https://github.com/AzureFatty/SimpleNav)

---

⭐ 如果您觉得这个项目有用，请考虑在 GitHub 上给它一个星标！
