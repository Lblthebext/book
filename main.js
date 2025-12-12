const state = {
  token: null,
  role: null,
  user: null,
  adminUsers: [
    { id: 101, username: "admin", role: "admin" },
    { id: 102, username: "zhang", role: "user" },
  ],
  popularBooks: [
    {
      bookId: 1001,
      title: "道德经",
      author: "老子",
      dynasty: "春秋",
      description: "道可道，非常道...",
      likeCount: 12050,
      isLiked: true,
    },
    {
      bookId: 1002,
      title: "史记",
      author: "司马迁",
      dynasty: "西汉",
      description: "中国第一部纪传体通史...",
      likeCount: 8450,
      isLiked: false,
    },
    {
      bookId: 1003,
      title: "资治通鉴",
      author: "司马光",
      dynasty: "北宋",
      description: "编年体通史巨著...",
      likeCount: 7021,
      isLiked: false,
    },
  ],
  myBooks: [
    {
      bookId: 1001,
      title: "道德经",
      author: "老子",
      dynasty: "春秋",
      description: "道可道，非常道...",
      likeCount: 12050,
      isLiked: true,
      is_public: true,
    },
    {
      bookId: 305,
      title: "孙子兵法",
      author: "孙武",
      dynasty: "春秋",
      description: "兵家必读经典...",
      likeCount: 5600,
      isLiked: false,
      is_public: false,
    },
  ],
  pages: [
    {
      pageId: 1,
      page_number: 1,
      image_path: "images/page1.png",
      ocr_text: "兵者，国之大事。",
      translated_text: "用兵是国家的大事。",
      status: 0,
      tags: [
        { name: "兵家", tagId: 1 },
        { name: "翻译已审校", tagId: 2 },
      ],
      annotations: [
        {
          annotation_id: 801,
          content: "注意此处出自《孙子兵法》开篇。",
          region: { x: 10, y: 20, w: 100, h: 120 },
          tagId: 1,
        },
      ],
    },
  ],
  versions: [{ version_id: 10 }, { version_id: 11 }],
  knowledgeGraph: {
    nodes: [
      { id: 1, name: "刘慈欣", category: "Person" },
      { id: 2, name: "三体", category: "Book" },
      { id: 3, name: "科幻小说", category: "Genre" },
    ],
    links: [
      { source_id: 1, target_id: 2, value: "由于" },
      { source_id: 2, target_id: 3, value: "属于" },
    ],
  },
};

const nav = document.getElementById("nav");
const app = document.getElementById("app");
let currentView = "login";

const views = {
  login: { label: "登录 / 注册", roles: ["guest", "admin", "user"] },
  discovery: { label: "古籍广场", roles: ["user"] },
  myBooks: { label: "个人书斋", roles: ["user"] },
  manage: { label: "书籍详情", roles: ["admin", "user"] },
  read: { label: "文献研究", roles: ["admin", "user"] },
  admin: { label: "后台用户管理", roles: ["admin"] },
};

function renderNav() {
  nav.innerHTML = "";
  const allowedRole = state.role ?? "guest";
  Object.entries(views).forEach(([key, value]) => {
    if (!value.roles.includes(allowedRole)) return;
    const btn = document.createElement("button");
    btn.textContent = value.label;
    btn.className = key === currentView ? "active" : "";
    btn.onclick = () => {
      currentView = key;
      render();
    };
    nav.appendChild(btn);
  });
}

function render() {
  renderNav();
  const fragment = document.createDocumentFragment();
  switch (currentView) {
    case "login":
      fragment.appendChild(renderLogin());
      break;
    case "admin":
      fragment.appendChild(renderAdminDashboard());
      break;
    case "discovery":
      fragment.appendChild(renderDiscovery());
      break;
    case "myBooks":
      fragment.appendChild(renderMyBooks());
      break;
    case "manage":
      fragment.appendChild(renderBookManage());
      break;
    case "read":
      fragment.appendChild(renderReadTool());
      break;
  }
  app.innerHTML = "";
  app.appendChild(fragment);
}

function renderLogin() {
  const section = document.createElement("section");
  section.innerHTML = `
    <h2>登录与注册 <span class="badge">/login</span></h2>
    <div class="callout">根据 /auth/login 接口返回的 role 字段决定进入管理员或普通用户端。</div>
    <div class="form-grid">
      <div>
        <h3>登录</h3>
        <label>用户名<input id="login-username" placeholder="admin 或用户" /></label>
        <label>密码<input id="login-password" type="password" placeholder="******" /></label>
        <label>模拟角色<select id="login-role"><option value="user">user</option><option value="admin">admin</option></select></label>
        <button class="action" id="login-submit">登录</button>
      </div>
      <div>
        <h3>注册</h3>
        <label>用户名<input id="reg-username" /></label>
        <label>密码<input id="reg-password" type="password" /></label>
        <label>确认密码<input id="reg-confirm" type="password" /></label>
        <p class="muted">前端校验两次密码一致后调用 /auth/register</p>
        <button class="action" id="reg-submit">注册</button>
      </div>
    </div>
  `;

  section.querySelector("#login-submit").onclick = () => {
    const username = section.querySelector("#login-username").value.trim();
    const role = section.querySelector("#login-role").value;
    state.role = role;
    state.token = "mock-token";
    state.user = { id: role === "admin" ? 101 : 201, username };
    currentView = role === "admin" ? "admin" : "discovery";
    render();
  };

  section.querySelector("#reg-submit").onclick = () => {
    const pwd = section.querySelector("#reg-password").value;
    const confirm = section.querySelector("#reg-confirm").value;
    if (pwd !== confirm) {
      alert("两次输入密码不一致（前端校验）");
      return;
    }
    alert("已调用 /auth/register，返回 code:200 后切回登录");
  };

  return section;
}

function renderAdminDashboard() {
  const section = document.createElement("section");
  section.innerHTML = `
    <h2>后台用户管理 <span class="badge">/admin/dashboard</span></h2>
    <div class="form-grid">
      <label>用户名<input id="admin-new-username" placeholder="新的用户名" /></label>
      <label>密码<input id="admin-new-password" type="password" placeholder="密码" /></label>
      <label>角色<select id="admin-new-role"><option value="user">user</option><option value="admin">admin</option></select></label>
      <button class="action" id="admin-create">新增用户</button>
    </div>
    <table class="table">
      <thead><tr><th>ID</th><th>用户名</th><th>角色</th><th>操作</th></tr></thead>
      <tbody id="admin-user-rows"></tbody>
    </table>
  `;

  section.querySelector("#admin-create").onclick = () => {
    const username = section.querySelector("#admin-new-username").value.trim();
    const role = section.querySelector("#admin-new-role").value;
    if (!username) return;
    const newId = Math.max(...state.adminUsers.map((u) => u.id)) + 1;
    state.adminUsers.push({ id: newId, username, role });
    render();
  };

  const tbody = section.querySelector("#admin-user-rows");
  state.adminUsers.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>
        <select data-id="${user.id}" class="admin-role-picker">
          <option value="admin" ${user.role === "admin" ? "selected" : ""}>admin</option>
          <option value="user" ${user.role === "user" ? "selected" : ""}>user</option>
        </select>
      </td>
      <td class="table-actions">
        <button class="action admin-save" data-id="${user.id}">保存修改</button>
        <button class="action admin-delete" data-id="${user.id}" style="background:#b91c1c">删除</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll(".admin-save").forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      const select = tbody.querySelector(`select[data-id="${id}"]`);
      const role = select.value;
      state.adminUsers = state.adminUsers.map((u) => (u.id === id ? { ...u, role } : u));
      alert(`/admin/users/${id} PUT 已提交，code:200 视为成功`);
    };
  });

  tbody.querySelectorAll(".admin-delete").forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      state.adminUsers = state.adminUsers.filter((u) => u.id !== id);
      render();
    };
  });

  return section;
}

function renderDiscovery() {
  const section = document.createElement("section");
  section.innerHTML = `
    <h2>古籍广场 <span class="badge">/books/discovery</span></h2>
    <p class="muted">展示 /books/popular 的高赞古籍，可点赞、取消点赞及克隆。</p>
    <div class="card-grid" id="popular-list"></div>
    <div class="form-grid" style="margin-top:12px;">
      <label>精准搜索标题<input id="search-title" placeholder="精确匹配书名" /></label>
      <button class="action" id="search-btn">搜索 /books/search</button>
    </div>
    <div id="search-results"></div>
  `;

  const grid = section.querySelector("#popular-list");
  state.popularBooks.forEach((book) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="flex-between"><h3>${book.title}</h3><span class="badge">${book.dynasty}</span></div>
      <p>${book.description}</p>
      <div class="chip-row">
        <span class="chip">作者：${book.author}</span>
        <span class="chip">点赞：${book.likeCount}</span>
        <span class="chip">ID：${book.bookId}</span>
      </div>
      <div class="table-actions">
        <button class="action like-btn" data-id="${book.bookId}">${book.isLiked ? "取消点赞" : "点赞"}</button>
        <button class="action clone-btn" data-id="${book.bookId}" style="background:#0d9488">克隆古籍</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll(".like-btn").forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      state.popularBooks = state.popularBooks.map((b) =>
        b.bookId === id
          ? {
              ...b,
              isLiked: !b.isLiked,
              likeCount: b.isLiked ? b.likeCount - 1 : b.likeCount + 1,
            }
          : b
      );
      render();
    };
  });

  grid.querySelectorAll(".clone-btn").forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      const newId = Math.max(...state.myBooks.map((b) => b.bookId)) + 1;
      const book = state.popularBooks.find((b) => b.bookId === id);
      if (book) {
        state.myBooks.push({ ...book, bookId: newId, is_public: false });
        alert(`/books/${id}/clone 返回 newBookId: ${newId}`);
      }
    };
  });

  section.querySelector("#search-btn").onclick = () => {
    const title = section.querySelector("#search-title").value.trim();
    const results = state.popularBooks.filter((b) => b.title === title);
    const box = section.querySelector("#search-results");
    if (!title) {
      box.innerHTML = "<p class=\"muted\">输入标题后调用 /books/search</p>";
      return;
    }
    if (!results.length) {
      box.innerHTML = `<p>未找到与 "${title}" 精确匹配的古籍</p>`;
      return;
    }
    box.innerHTML = results
      .map(
        (b) => `
        <div class="card">
          <div class="flex-between"><strong>${b.title}</strong><span class="chip">ID: ${b.bookId}</span></div>
          <p>${b.description}</p>
        </div>`
      )
      .join("\n");
  };

  return section;
}

function renderMyBooks() {
  const section = document.createElement("section");
  section.innerHTML = `
    <h2>个人书斋 <span class="badge">/books/my</span></h2>
    <div class="form-grid">
      <label>标题<input id="my-title" /></label>
      <label>作者<input id="my-author" /></label>
      <label>朝代<input id="my-dynasty" /></label>
      <label>简介<textarea id="my-description"></textarea></label>
      <label>是否公开<select id="my-public"><option value="true">公开</option><option value="false">私有</option></select></label>
      <button class="action" id="my-create">创建古籍 /books/create</button>
    </div>
    <div class="card-grid" id="my-books"></div>
  `;

  section.querySelector("#my-create").onclick = () => {
    const title = section.querySelector("#my-title").value.trim();
    if (!title) return;
    const newId = Math.max(...state.myBooks.map((b) => b.bookId)) + 1;
    const book = {
      bookId: newId,
      title,
      author: section.querySelector("#my-author").value.trim() || "佚名",
      dynasty: section.querySelector("#my-dynasty").value.trim() || "不详",
      description: section.querySelector("#my-description").value.trim() || "",
      is_public: section.querySelector("#my-public").value === "true",
      isLiked: false,
      likeCount: 0,
    };
    state.myBooks.push(book);
    render();
  };

  const grid = section.querySelector("#my-books");
  state.myBooks.forEach((book) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="flex-between">
        <h3>${book.title}</h3>
        <span class="status-pill ${book.is_public ? "status-public" : "status-private"}">${
      book.is_public ? "已公开" : "未公开"
    }</span>
      </div>
      <p>${book.description || "暂无简介"}</p>
      <div class="chip-row">
        <span class="chip">作者：${book.author}</span>
        <span class="chip">朝代：${book.dynasty}</span>
        <span class="chip">ID：${book.bookId}</span>
      </div>
      <div class="table-actions">
        <button class="action toggle-public" data-id="${book.bookId}">切换公开状态</button>
        <button class="action delete-book" data-id="${book.bookId}" style="background:#b91c1c">删除</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll(".toggle-public").forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      state.myBooks = state.myBooks.map((b) =>
        b.bookId === id ? { ...b, is_public: !b.is_public } : b
      );
      alert(`/books/${id}/status 返回 is_public=${state.myBooks.find((b) => b.bookId === id)?.is_public}`);
      render();
    };
  });

  grid.querySelectorAll(".delete-book").forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      state.myBooks = state.myBooks.filter((b) => b.bookId !== id);
      render();
    };
  });

  return section;
}

function renderBookManage() {
  const section = document.createElement("section");
  const book = state.myBooks[0];
  section.innerHTML = `
    <h2>书籍详情与版本管理 <span class="badge">/books/${book.bookId}/manage</span></h2>
    <div class="callout">调用 /books/${book.bookId} 获取详情；/books/${book.bookId}/pages 上传内页；/books/${book.bookId}/versions 获取版本；/books/${book.bookId}/rollback 执行回滚。</div>
    <div class="form-grid">
      <label>上传图片<input id="upload-image" type="file" /></label>
      <label>页码<input id="upload-page" type="number" min="1" value="${state.pages[0].page_number}" /></label>
      <button class="action" id="upload-btn">上传 /books/${book.bookId}/pages</button>
    </div>
    <div class="card-grid" id="page-list"></div>
    <h3>版本列表 /books/${book.bookId}/versions</h3>
    <div class="chip-row" id="version-list"></div>
  `;

  const pageGrid = section.querySelector("#page-list");
  state.pages.forEach((page) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="flex-between"><strong>第 ${page.page_number} 页</strong><span class="chip">ID: ${page.pageId}</span></div>
      <p class="muted">OCR：${page.ocr_text}</p>
      <p class="muted">翻译：${page.translated_text}</p>
    `;
    pageGrid.appendChild(card);
  });

  section.querySelector("#upload-btn").onclick = () => {
    const pageNum = Number(section.querySelector("#upload-page").value);
    state.pages.push({
      pageId: Math.max(...state.pages.map((p) => p.pageId)) + 1,
      page_number: pageNum,
      image_path: "http://oss/new.png",
      ocr_text: "",
      translated_text: "",
      status: 0,
      tags: [],
      annotations: [],
    });
    alert(`/books/${book.bookId}/pages 上传成功，page_number: ${pageNum}`);
    render();
  };

  const versionList = section.querySelector("#version-list");
  state.versions.forEach((v) => {
    const chip = document.createElement("button");
    chip.className = "action";
    chip.style.width = "auto";
    chip.textContent = `版本 ${v.version_id}`;
    chip.onclick = () => alert(`/books/${book.bookId}/rollback version_id=${v.version_id}`);
    versionList.appendChild(chip);
  });

  return section;
}

function renderReadTool() {
  const page = state.pages[0];
  const section = document.createElement("section");
  section.innerHTML = `
    <h2>文献研究工具 <span class="badge">/read/${page.pageId}</span></h2>
    <div class="callout">按顺序：获取单页详情 → /ai/ocr → /ai/translate → /pages/{pageId}/save</div>
    <div class="form-grid">
      <label>页码<input value="${page.page_number}" disabled /></label>
      <label>OCR 文本<textarea id="ocr-text">${page.ocr_text}</textarea></label>
      <label>翻译文本<textarea id="translate-text">${page.translated_text}</textarea></label>
    </div>
    <div class="table-actions" style="margin-top:12px;">
      <button class="action" id="btn-ocr">OCR 识别 /ai/ocr</button>
      <button class="action" id="btn-translate" style="background:#0ea5e9">AI 翻译 /ai/translate</button>
      <button class="action" id="btn-save" style="background:#10b981">保存 /pages/${page.pageId}/save</button>
    </div>
    <h3>批注管理</h3>
    <div id="annotation-list"></div>
    <div class="form-grid">
      <label>新增批注<textarea id="new-annotation"></textarea></label>
      <button class="action" id="add-annotation">新增 /annotations/add</button>
      <label>标签<input id="new-tag" placeholder="tag_name" /></label>
      <button class="action" id="add-tag">给最近批注贴标签 /annotations/{annotation_id}/tags</button>
    </div>
    <h3>知识图谱 /ai/knowledge-graph</h3>
    <div class="card-grid" id="kg"></div>
  `;

  section.querySelector("#btn-ocr").onclick = () => {
    const text = "这里是 OCR 结果";
    section.querySelector("#ocr-text").value = text;
    alert("已调用 /ai/ocr");
  };

  section.querySelector("#btn-translate").onclick = () => {
    const source = section.querySelector("#ocr-text").value;
    section.querySelector("#translate-text").value = `${source}（AI 标点与翻译结果）`;
  };

  section.querySelector("#btn-save").onclick = () => {
    alert(`/pages/${page.pageId}/save 已保存`);
  };

  const annotationList = section.querySelector("#annotation-list");
  annotationList.innerHTML = state.pages[0].annotations
    .map(
      (a) => `
      <div class="card">
        <div class="flex-between"><strong>批注 ${a.annotation_id}</strong><span class="chip">tagId: ${a.tagId}</span></div>
        <p>${a.content}</p>
        <p class="muted">区域：x=${a.region.x}, y=${a.region.y}, w=${a.region.w}, h=${a.region.h}</p>
      </div>
    `
    )
    .join("\n");

  section.querySelector("#add-annotation").onclick = () => {
    const content = section.querySelector("#new-annotation").value.trim();
    if (!content) return;
    const newId = Math.max(...state.pages[0].annotations.map((a) => a.annotation_id)) + 1;
    state.pages[0].annotations.push({
      annotation_id: newId,
      content,
      region: { x: 0, y: 0, w: 0, h: 0 },
      tagId: 0,
    });
    render();
  };

  section.querySelector("#add-tag").onclick = () => {
    const tagName = section.querySelector("#new-tag").value.trim();
    if (!tagName) return;
    const latest = state.pages[0].annotations[state.pages[0].annotations.length - 1];
    if (latest) {
      latest.tagId = (latest.tagId || 0) + 1;
      state.pages[0].tags.push({ name: tagName, tagId: latest.tagId });
      alert(`/annotations/${latest.annotation_id}/tags 返回 tagId: ${latest.tagId}`);
    }
  };

  const kg = section.querySelector("#kg");
  const nodeCard = document.createElement("div");
  nodeCard.className = "card";
  nodeCard.innerHTML = `
    <h4>节点</h4>
    ${state.knowledgeGraph.nodes
      .map((n) => `<div class="chip">${n.id} · ${n.name} (${n.category})</div>`)
      .join(" ")}
  `;
  const linkCard = document.createElement("div");
  linkCard.className = "card";
  linkCard.innerHTML = `
    <h4>关系</h4>
    ${state.knowledgeGraph.links
      .map((l) => `<div class="chip">${l.source_id} -${l.value}-> ${l.target_id}</div>`)
      .join(" ")}
  `;
  kg.append(nodeCard, linkCard);

  return section;
}

render();
