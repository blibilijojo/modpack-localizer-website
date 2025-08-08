// content.ts

export const texts = {
  title: "Modpack Localizer Pro - 整合包汉化工坊",
  description: "一款专业的 Minecraft 整合包汉化工作台。它将强大的 AI 翻译、社区资源整合与精细的手动校对、项目存读档功能深度结合，为整合包作者和玩家提供从一键自动化到完整项目管理的全流程本地化体验。",
  latest_release: "下载最新版",
  feature_showcase: "功能展示",
  manual_workbench: "手动翻译工作台",
  manual_workbench_desc: "专业的三栏式布局，方便您按模组对上千条文本进行高效的审查、编辑和校对。",
  dict_search: "社区词典查询",
  dict_search_desc: "强大的原文/译文双向模糊搜索，快速找到您需要的参考翻译。",
  features_title: "核心特性",
  features: [
    { name: "工作台模式", desc: "新增“手动校对”模式，提供专业的“主-从-编辑器”三栏式布局，让您对每一条翻译进行精细审查和修改。" },
    { name: "项目存读档", desc: "在手动模式下，可随时将工作进度保存为 .sav 项目文件，之后通过主菜单“工具”->“加载项目”恢复工作，防止心血白费。" },
    { name: "全局词典查询", desc: "从主菜单或手动工作台中随时启动独立词典查询工具，支持原文/译文双向智能模糊搜索。" },
    { name: "个人本地词典", desc: "在手动工作台中，您可以将最满意的翻译一键存入拥有最高优先级的个人词典，实现翻译知识的积累与复用。" },
    { name: "智能翻译引擎", desc: "集成 Google Gemini API，提供高质量、可配置的 AI 翻译服务。" },
    { name: "多格式兼容", desc: "自动检测并处理模组中的 .json 和 .lang 语言文件，并采用 .json 优先的策略处理冲突。" },
    { name: "社区包叠加", desc: "支持加载多个社区汉化包，并按优先级顺序智能合并，充分利用已有翻译成果。" },
    { name: "AI 参数调优", desc: "可自定义 Prompt、AI 模型、并发线程数、重试次数等高级参数。" },
    { name: "灵活的资源包设置", desc: "轻松配置汉化包所支持的游戏版本、描述和自定义图标。" },
    { name: "现代化图形界面", desc: "基于 ttkbootstrap 构建，提供清晰、美观、跨平台的图形用户界面。" },
    { name: "专业日志系统", desc: "自动生成详细的日志文件 (ModpackLocalizer.log)，便于开发者和用户排查问题。" },
  ],

  acknowledgements_title: "❤️ 鸣谢与版权", // <-- 修改了标题
  acknowledgements_intro: "本项目的实现离不开以下优秀开源项目和社区提供的宝贵数据资源，在此表示衷心的感谢！",
  acknowledgements_list: [
    {
      name: "Minecraft-Mod-Language-Package",
      by: "CFPAOrg", // <-- 新增字段
      url: "https://github.com/CFPAOrg/Minecraft-Mod-Language-Package",
      desc: "该项目是社区词典数据的核心数据来源。它收集并维护了海量高质量的模组汉化文件，为本工具的词典功能提供了坚实的数据基础。",
    },
    {
      name: "i18n-Dict-Extender",
      by: "VM-Chinese-translate-group", // <-- 新增字段
      url: "https://github.com/VM-Chinese-translate-group/i18n-Dict-Extender",
      desc: "该项目是一个强大的词典聚合应用，它将来自多个社区（如 CFPA）的翻译成果高效地编译成本项目所使用的 `Dict-Sqlite.db` 数据库格式。",
      copyright: `版权声明: 本项目使用的社区词典数据 Dict-Sqlite.db 源自于 i18n-Dict-Extender 项目的构建产物。根据其上游声明，该数据遵循 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">CC BY-NC-SA 4.0</a> 协议。` // <-- 新增版权声明
    },
  ],

  last_updated_at: "最后更新于：",

  footer_text: "本项目采用 MIT 许可证。",
  view_on_github: "在 GitHub 上查看",
  github_url: "https://github.com/blibilijojo/Modpack-Localizer"
};
