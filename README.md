# 古籍管理前端原型

本仓库是基于给定接口文档的纯前端原型，使用原生 HTML、CSS、JavaScript 组织，不依赖任何构建工具。通过不同页面区块演示管理员端与普通用户端的主要流程：

- 登录/注册页：模拟 /auth/login、/auth/register，依据返回的 role 进入不同入口。
- 管理员后台：用户增删改查对应 /admin/users 系列接口。
- 古籍广场：展示 /books/popular，可点赞、取消点赞、克隆以及 /books/search 精确搜索。
- 个人书斋：调用 /books/my、/books/create、/books/{bookId}/status、/books/{bookId}/delete 的交互流程。
- 书籍详情与版本管理：展示 /books/{bookId}，并支持上传内页与回滚版本的交互。
- 文献研究工具：串联 /pages/{pageId}、/ai/ocr、/ai/translate、/annotations/add、/annotations/{annotation_id}/tags、/ai/knowledge-graph 等接口场景。

## 使用方式

直接用浏览器打开根目录下的 `index.html` 即可预览交互示意。按钮与表单会在前端内存中模拟接口请求与数据流转（所有 id 类型均为整数），方便与后端联调时逐项对照接口契约。
