// 使用CommonJS语法导入了两个Electron模块
// app 应用程序的事件生命周期
// BrowserWindow 负责创建和管理应用窗口
// 引入托盘Tray 、Menu、nativeIMage、Icon图标
const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  nativeImage,
} = require("electron");
const path = require("path");
// 定义一个窗口
let win, tray;
// 引入菜单
require("./menu");

const createWindow = () => {
  // const win = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   webPreferences: {
  //     enableRemoteModule: true,
  //     nodeIntegration: true,
  //     contextIsolation: false,
  //   },
  // });
  // win.loadFile("index.html");
};

app.on("ready", function () {
  // require("@electron/remote/main").initialize();

  win = new BrowserWindow({
    //设置无边框 没有菜单
    // frame: false,
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true, //是否集成Nodejs
      contextIsolation: false,
    },
  });

  //创建icon
  const icon = nativeImage.createFromPath(path.join(__dirname, "/icon.png"));

  // 实例化一个 托盘对象，传入的是托盘的图标
  tray = new Tray(icon);
  // 移动到托盘的提示
  tray.setToolTip("electron demo is running");
  // 设置title
  tray.setTitle("electron demo");

  // 监听托盘右键事件
  tray.on("right-click", () => {
    // 右键菜单模板
    const template = [
      {
        label: "无操作",
      },
      {
        label: "退出",
        click: () => app.quit(),
      },
    ];
    // 通过Menu 创建菜单
    const menuConfig = Menu.buildFromTemplate(template);
    // 让我们写的托盘右键的菜单替代原来的
    tray.popUpContextMenu(menuConfig);
  });

  tray.on("click", () => {
    // 这里来控制窗口的显示和隐藏
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });

  ipcMain.on("task", (event, info) => {
    if (info === "退出程序") {
      app.quit();
    }
  });

  setTimeout(() => {
    win.webContents.send("mainMsg", "我是主线程发送的消息");
  }, 3000);

  // 打开控制台
  win.webContents.openDevTools();
  win.loadFile("./receive.html");
  // 4.监听窗口关闭事件
  win.on("close", () => {
    win = null;
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
