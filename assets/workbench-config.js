(function(){
  "use strict";

  var STORAGE_KEY="ai_daily_workbench_config_v1";
  var defaults=merge(clone(window.__WORKBENCH_DEFAULTS__||{}),window.__KOL_DEFAULTS__||{});
  var saved=parseSaved();
  var current=merge(clone(defaults),saved);
  var dirty=false;
  var configTab="general";
  var editingFeed=null;
  var editingAuthor=null;
  var editingTarget=null;
  var kolSearch="";
  var kolPlatform="all";
  var kolCategory="all";
  var kolPage=1;
  var KOL_PAGE_SIZE=12;
  var toastTimer=null;

  function clone(value){return JSON.parse(JSON.stringify(value==null?{}:value));}
  function merge(base,extra){
    if(!extra||typeof extra!=="object")return base;
    Object.keys(extra).forEach(function(key){
      var value=extra[key];
      if(Array.isArray(value))base[key]=clone(value);
      else if(value&&typeof value==="object"){
        if(!base[key]||typeof base[key]!=="object"||Array.isArray(base[key]))base[key]={};
        merge(base[key],value);
      }else base[key]=value;
    });
    return base;
  }
  function parseSaved(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");}
    catch(e){return {};}
  }
  function get(path){
    return path.split(".").reduce(function(value,key){return value==null?undefined:value[key];},current);
  }
  function set(path,value){
    var keys=path.split("."),target=current;
    keys.slice(0,-1).forEach(function(key){if(!target[key])target[key]={};target=target[key];});
    target[keys[keys.length-1]]=value;
    window.WORKBENCH_CONFIG=current;
    setDirty(true);
  }
  function setDirty(value){
    dirty=value;
    var el=document.getElementById("configStatus");
    if(!el)return;
    el.classList.toggle("saved",!dirty);
    el.innerHTML='<span class="dot"></span>'+(dirty?"有未保存修改":"已保存");
  }
  function configFileText(){
    var payload=clone(current);
    payload.updated_at=new Date().toISOString();
    return "window.__WORKBENCH_USER_CONFIG__ = "+JSON.stringify(payload,null,2)+";\n";
  }
  function saveLocal(silent){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(current));
    setDirty(false);
    if(!silent)toast("配置已保存");
    if(window.renderNav)window.renderNav();
  }
  function toast(message){
    var el=document.getElementById("configToast");
    if(!el){
      el=document.createElement("div");
      el.id="configToast";
      el.className="config-toast";
      document.body.appendChild(el);
    }
    el.textContent=message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer=setTimeout(function(){el.classList.remove("show");},1800);
  }
  function download(){
    saveLocal(true);
    var blob=new Blob([configFileText()],{type:"application/javascript;charset=utf-8"});
    var url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="workbench.user.js";a.click();
    setTimeout(function(){URL.revokeObjectURL(url);},1000);
    toast("配置文件已导出");
  }
  async function syncAgent(){
    saveLocal(true);
    if(!window.showDirectoryPicker){download();return;}
    try{
      var chosen=await window.showDirectoryPicker({mode:"readwrite"});
      var configDir=chosen.name==="config"?chosen:await chosen.getDirectoryHandle("config",{create:false});
      var handle=await configDir.getFileHandle("workbench.user.js",{create:true});
      var writable=await handle.createWritable();
      await writable.write(configFileText());
      await writable.close();
      toast("已写入每日任务");
    }catch(error){
      if(error&&error.name!=="AbortError")toast("写入失败，请选择工作台目录");
    }
  }
  function importFile(file){
    if(!file)return;
    var reader=new FileReader();
    reader.onload=function(){
      try{
        var text=String(reader.result||"");
        var match=text.match(/=\s*(\{[\s\S]*\})\s*;?\s*$/);
        var payload=JSON.parse(match?match[1]:text);
        current=merge(clone(defaults),payload);
        window.WORKBENCH_CONFIG=current;
        saveLocal(true);
        render();
        toast("配置已导入");
      }catch(e){toast("配置文件无效");}
    };
    reader.readAsText(file,"utf-8");
  }
  function reset(){
    current=clone(defaults);
    window.WORKBENCH_CONFIG=current;
    setDirty(true);
    render();
    toast("已恢复默认值");
  }
  function toggle(path,checked){set(path,!!checked);if(window.renderNav)window.renderNav();}
  function number(path,value,min,max){
    var parsed=Number(value);
    if(!Number.isFinite(parsed))return;
    if(min!=null)parsed=Math.max(min,parsed);
    if(max!=null)parsed=Math.min(max,parsed);
    set(path,parsed);
  }
  function text(path,value){set(path,String(value));}
  function switchHtml(path,checked,extra){
    return '<label class="switch"><input type="checkbox" '+(checked?'checked ':'')+'onchange="'+(extra||"workbenchToggle('"+path+"',this.checked)")+'"><span></span></label>';
  }
  function numberRow(label,meta,path,min,max,step,unit){
    return '<div class="setting-row"><div><div class="setting-label">'+label+'</div><div class="setting-meta">'+meta+'</div></div>'+
      '<div class="setting-control"><input class="config-input" type="number" min="'+min+'" max="'+max+'" step="'+step+'" value="'+attr(get(path))+'" onchange="workbenchNumber(\''+path+'\',this.value,'+min+','+max+')"><span class="unit">'+unit+'</span></div></div>';
  }
  function selectRow(label,meta,path,options){
    var value=String(get(path));
    var html=options.map(function(item){return '<option value="'+attr(item[0])+'" '+(value===item[0]?'selected':'')+'>'+esc(item[1])+'</option>';}).join("");
    return '<div class="setting-row"><div><div class="setting-label">'+label+'</div><div class="setting-meta">'+meta+'</div></div>'+
      '<div class="setting-control"><select class="config-select" onchange="workbenchText(\''+path+'\',this.value)">'+html+'</select></div></div>';
  }
  function toggleRow(label,meta,path){
    return '<div class="setting-row"><div><div class="setting-label">'+label+'</div><div class="setting-meta">'+meta+'</div></div>'+
      '<div class="setting-control">'+switchHtml(path,!!get(path))+'</div></div>';
  }
  function sourceRow(key,name,code,icon){
    return '<div class="source-row"><div class="source-icon">'+ico(icon||"pulse")+'</div><div class="source-body"><div class="source-name">'+name+'</div><div class="source-code">'+code+'</div></div>'+
      switchHtml("sources."+key,!!get("sources."+key))+'</div>';
  }
  function actions(){
    return '<div class="config-actions">'+
      '<span class="config-status'+(dirty?'':' saved')+'" id="configStatus"><span class="dot"></span>'+(dirty?'有未保存修改':'已保存')+'</span>'+
      '<button class="config-icon-btn" title="导入配置" onclick="document.getElementById(\'configImport\').click()">'+ico("upload")+'</button>'+
      '<button class="config-icon-btn" title="导出配置" onclick="workbenchDownload()">'+ico("download")+'</button>'+
      '<button class="config-btn" onclick="workbenchReset()">'+ico("refresh")+'恢复默认</button>'+
      '<button class="config-btn" onclick="workbenchSave()">'+ico("save")+'保存</button>'+
      '<button class="config-btn primary" title="选择每日资讯或 config 文件夹" onclick="workbenchSyncAgent()">'+ico("check")+'写入每日任务</button>'+
      '<input id="configImport" type="file" accept=".js,.json" hidden onchange="workbenchImport(this.files[0]);this.value=\'\'">'+
    '</div>';
  }
  function header(title,sub){
    return '<div class="config-head"><div><div class="config-title">'+title+'</div><div class="config-sub">'+sub+'</div></div>'+actions()+'</div>';
  }
  function section(icon,title,body,count){
    return '<section class="config-section"><div class="config-section-head">'+ico(icon)+'<h3>'+title+'</h3>'+(count!=null?'<span class="config-count">'+count+'</span>':'')+'</div>'+body+'</section>';
  }
  function configTabs(){
    var tabs=[["general","gear","运行与质量"],["kol","kol","KOL 作者"],["push","rocket","推送机器人"]];
    return '<div class="config-tabs">'+tabs.map(function(tab){
      return '<button class="'+(configTab===tab[0]?'on':'')+'" onclick="workbenchConfigTab(\''+tab[0]+'\')">'+ico(tab[1])+tab[2]+'</button>';
    }).join("")+'</div>';
  }
  function setConfigTab(tab){
    if(["general","kol","push"].indexOf(tab)<0)return;
    configTab=tab;
    render();
  }
  function renderGeneralConfig(){
    var runtime='<div class="setting-list">'+
      selectRow("输出语言","digest language","runtime.output_language",[["zh","简体中文"],["en","English"],["bilingual","中英双语"]])+
      toggleRow("校验通过后推送","schedule_push","runtime.schedule_push")+
      numberRow("网页发现窗口","web_native_recency_days","runtime.web_native_recency_days",1,30,1,"天")+
      numberRow("新鲜度补搜窗口","web_recovery_recency_days","runtime.web_recovery_recency_days",1,7,1,"天")+
      numberRow("新鲜度补搜次数","freshness_recovery_min_queries","runtime.freshness_recovery_min_queries",2,20,1,"次")+
      numberRow("X 搜索上限","x_scheduled_search_limit","runtime.x_scheduled_search_limit",0,10,1,"次")+
      numberRow("单次 X 候选","x_scheduled_results_per_query","runtime.x_scheduled_results_per_query",1,20,1,"条")+
    '</div>';
    var quality='<div class="setting-list">'+
      numberRow("日报最少条目","min_total_items","quality.min_total_items",5,40,1,"条")+
      numberRow("72 小时内最少条目","min_fresh_72h","quality.min_fresh_72h",1,20,1,"条")+
      numberRow("7 天内最低占比","min_fresh_7d_ratio","quality.min_fresh_7d_ratio",0.1,1,0.05,"比例")+
      numberRow("背景资料最高占比","max_background_ratio","quality.max_background_ratio",0,0.8,0.05,"比例")+
      numberRow("大厂动态最少条目","dimension_minima.lab","quality.dimension_minima.lab",0,10,1,"条")+
      numberRow("KOL 观点最少条目","dimension_minima.kol","quality.dimension_minima.kol",0,12,1,"条")+
      numberRow("论文最少条目","dimension_minima.paper","quality.dimension_minima.paper",0,10,1,"条")+
      numberRow("开源项目最少条目","dimension_minima.oss","quality.dimension_minima.oss",0,10,1,"条")+
      numberRow("AI × 金融最少条目","dimension_minima.fin","quality.dimension_minima.fin",0,10,1,"条")+
    '</div>';
    var sources='<div class="source-grid">'+
      sourceRow("gate_search_x","Gate X 候选","gate-search-x","pulse")+
      sourceRow("public_web","公开网页","public-web","open")+
      sourceRow("x_browser","X 浏览器核验","x-browser","x")+
      sourceRow("official_web","官方站点","official-web","shield")+
      sourceRow("github","GitHub","github","oss")+
      sourceRow("paper_index","论文索引","paper-index","paper")+
    '</div>';
    var discovery='<div class="setting-list">'+
      toggleRow("主动热点发现","discovery.enabled","discovery.enabled")+
      numberRow("热点回看窗口","discovery.lookback_hours","discovery.lookback_hours",6,72,1,"小时")+
      numberRow("名单外 KOL 最少入选","discovery.min_off_watchlist_kol","discovery.min_off_watchlist_kol",0,10,1,"人")+
      numberRow("动态热点最少入选","discovery.min_trend_items","discovery.min_trend_items",1,12,1,"条")+
      numberRow("热点泳道最少覆盖","discovery.min_distinct_lanes_selected","discovery.min_distinct_lanes_selected",1,4,1,"条")+
    '</div><div class="lane-grid">'+(get("discovery.lanes")||[]).map(function(lane,index){
      return '<div class="source-row"><div class="source-icon">'+ico(lane.key==="ai_finance_trends"?"fin":lane.key==="ai_web3_trends"?"link":lane.key==="visual_ai_models"?"open":"pulse")+'</div>'+
        '<div class="source-body"><div class="source-name">'+esc(lane.name)+'</div><div class="source-code">'+esc(lane.key)+' · '+esc(lane.min_queries)+' 次 / '+esc(lane.min_candidates)+' 候选</div></div>'+
        switchHtml("",!!lane.enabled,"workbenchToggleLane("+index+",this.checked)")+'</div>';
    }).join("")+'</div>';
    return section("gear","运行参数",runtime)+section("shield","质量门槛",quality)+
      section("pulse","主动热点发现",discovery)+section("layers","数据源",sources,enabledSourceCount()+" / 6 已启用");
  }
  function renderConfig(){
    var body=configTab==="kol"?renderKolConfig():configTab==="push"?renderPushConfig():renderGeneralConfig();
    return '<div class="config-shell">'+header("配置中心","项目配置 · 本地保存 · Agent 生效")+configTabs()+body+'</div>';
  }
  function enabledSourceCount(){
    var sources=current.sources||{};
    return Object.keys(sources).filter(function(key){return sources[key];}).length;
  }
  function enabledRssCount(){
    if(!get("rss.enabled"))return 0;
    return (get("rss.feeds")||[]).filter(function(feed){return feed.enabled;}).length;
  }
  function toggleLane(index,checked){
    var lanes=clone(get("discovery.lanes")||[]);
    if(!lanes[index])return;
    lanes[index].enabled=!!checked;
    set("discovery.lanes",lanes);
  }
  function authors(){return get("kol.authors")||[];}
  function enabledAuthorCount(){return authors().filter(function(row){return row.enabled;}).length;}
  function authorCategories(){
    return Array.from(new Set(authors().map(function(row){return row.category;}).filter(Boolean))).sort();
  }
  function filteredAuthors(){
    var q=kolSearch.trim().toLowerCase();
    return authors().filter(function(row){
      if(kolPlatform!=="all"&&row.platform!==kolPlatform)return false;
      if(kolCategory!=="all"&&row.category!==kolCategory)return false;
      if(!q)return true;
      return [row.name,row.handle,row.field,row.category].join(" ").toLowerCase().indexOf(q)>=0;
    });
  }
  function kolRow(author){
    return '<div class="manage-row">'+
      '<div class="manage-main"><div class="avatar">'+esc((author.name||author.handle||"?").slice(0,1).toUpperCase())+'</div><div><div class="manage-name">'+esc(author.name||author.handle)+'</div><div class="manage-code">'+esc(author.handle||"-")+'</div></div></div>'+
      '<div class="manage-cell"><b>领域</b>'+esc(author.field||"-")+'</div>'+
      '<div class="manage-cell"><b>分组</b>'+esc(author.category||"-")+'</div>'+
      '<div class="manage-cell"><b>平台</b><span class="platform-pill">'+esc(author.platform||"X")+'</span></div>'+
      '<div class="manage-actions"><button class="config-icon-btn" title="编辑" onclick="workbenchEditAuthor(\''+attr(author.id)+'\')">'+ico("gear")+'</button><button class="config-icon-btn danger" title="删除" onclick="workbenchDeleteAuthor(\''+attr(author.id)+'\')">'+ico("trash")+'</button></div>'+
      '<div class="manage-toggle">'+switchHtml("",!!author.enabled,"workbenchToggleAuthor('"+attr(author.id)+"',this.checked)")+'</div>'+
    '</div>';
  }
  function renderKolList(){
    var rows=filteredAuthors();
    var pages=Math.max(1,Math.ceil(rows.length/KOL_PAGE_SIZE));
    kolPage=Math.min(kolPage,pages);
    var start=(kolPage-1)*KOL_PAGE_SIZE;
    var pageRows=rows.slice(start,start+KOL_PAGE_SIZE);
    var list=pageRows.length?pageRows.map(kolRow).join(""):'<div class="rss-empty">'+ico("kol")+'没有匹配的作者</div>';
    return '<div class="manage-list">'+list+'</div><div class="manage-pager"><span>'+rows.length+' 人 · '+kolPage+' / '+pages+'</span>'+
      '<button class="config-icon-btn" title="上一页" '+(kolPage<=1?'disabled':'')+' onclick="workbenchKolPage(-1)">'+ico("back")+'</button>'+
      '<button class="config-icon-btn" title="下一页" '+(kolPage>=pages?'disabled':'')+' onclick="workbenchKolPage(1)">'+ico("chev")+'</button></div>';
  }
  function renderKolConfig(){
    var categories=authorCategories();
    var toolbar='<div class="manage-toolbar"><div class="manage-search">'+ico("search")+'<input id="kolSearchInput" value="'+attr(kolSearch)+'" placeholder="搜索姓名、账号或领域" oninput="workbenchKolSearch(this.value)"></div>'+
      '<select class="config-select compact" onchange="workbenchKolFilter(\'platform\',this.value)">'+
        selectOptions([["all","全部平台"],["X","X"],["微博","微博"],["即刻","即刻"]],kolPlatform)+'</select>'+
      '<select class="config-select compact" onchange="workbenchKolFilter(\'category\',this.value)">'+
        selectOptions([["all","全部分组"]].concat(categories.map(function(value){return [value,value];})),kolCategory)+'</select>'+
      '<button class="config-btn primary" onclick="workbenchEditAuthor()">'+ico("plus")+'新增作者</button></div>';
    var policy='<div class="setting-list">'+
      numberRow("动态候选最少数量","kol.min_dynamic_candidates","kol.min_dynamic_candidates",4,30,1,"人")+
      numberRow("话题反向入选数量","kol.min_topic_expansion_selected","kol.min_topic_expansion_selected",1,10,1,"人")+
    '</div>';
    return toolbar+section("kol","关注作者",'<div id="kolListBlock">'+renderKolList()+'</div>',enabledAuthorCount()+" / "+authors().length+" 已启用")+
      section("target","动态发现规则",policy);
  }
  function updateKolList(){
    var block=document.getElementById("kolListBlock");
    if(block)block.innerHTML=renderKolList();
  }
  function setKolSearch(value){kolSearch=String(value||"");kolPage=1;updateKolList();}
  function setKolFilter(key,value){
    if(key==="platform")kolPlatform=value;
    if(key==="category")kolCategory=value;
    kolPage=1;
    render();
  }
  function changeKolPage(delta){kolPage=Math.max(1,kolPage+Number(delta||0));updateKolList();}
  function authorById(id){return authors().find(function(row){return row.id===id;});}
  function ensureManagedDialog(id){
    var dialog=document.getElementById(id);
    if(dialog)return dialog;
    dialog=document.createElement("dialog");
    dialog.id=id;
    dialog.className="config-dialog";
    document.body.appendChild(dialog);
    dialog.addEventListener("click",function(event){if(event.target===dialog)dialog.close();});
    return dialog;
  }
  function editAuthor(id){
    editingAuthor=id||null;
    var row=id?clone(authorById(id)||{}):{name:"",handle:"",field:"",category:"前沿研究者",platform:"X",status:"new",enabled:true};
    var dialog=ensureManagedDialog("authorDialog");
    dialog.innerHTML='<form method="dialog" onsubmit="return false"><div class="config-dialog-panel">'+
      '<div class="config-dialog-head"><h3>'+(id?"编辑作者":"新增作者")+'</h3><button class="config-icon-btn" style="margin-left:auto" onclick="document.getElementById(\'authorDialog\').close()" title="关闭">'+ico("x")+'</button></div>'+
      '<div class="config-dialog-body">'+
        '<div class="field"><label>姓名</label><input id="authorName" class="config-input" value="'+attr(row.name||"")+'" required></div>'+
        '<div class="field"><label>账号</label><input id="authorHandle" class="config-input" value="'+attr(row.handle||"")+'" placeholder="@handle" required></div>'+
        '<div class="field wide"><label>关注领域</label><input id="authorField" class="config-input" value="'+attr(row.field||"")+'"></div>'+
        '<div class="field"><label>分组</label><input id="authorCategory" class="config-input" value="'+attr(row.category||"")+'"></div>'+
        '<div class="field"><label>平台</label><select id="authorPlatform" class="config-select">'+selectOptions([["X","X"],["微博","微博"],["即刻","即刻"],["其他","其他"]],row.platform)+'</select></div>'+
        '<div class="field"><label>状态</label><select id="authorStatus" class="config-select">'+selectOptions([["keep","保留"],["new","新增"],["watch","观察"]],row.status)+'</select></div>'+
      '</div><div class="config-dialog-foot"><button class="config-btn" onclick="document.getElementById(\'authorDialog\').close()">取消</button><button class="config-btn primary" onclick="workbenchCommitAuthor()">'+ico("save")+'保存作者</button></div>'+
    '</div></form>';
    dialog.showModal();
  }
  function rowId(value,prefix){
    var id=String(value||"").toLowerCase().replace(/^@/,"").replace(/[^a-z0-9\u4e00-\u9fff_-]+/g,"-").replace(/^-|-$/g,"");
    return id||prefix+"-"+Date.now();
  }
  function commitAuthor(){
    var name=document.getElementById("authorName").value.trim();
    var handle=document.getElementById("authorHandle").value.trim();
    if(!name||!handle){toast("请填写姓名和账号");return;}
    var rows=authors(),existing=editingAuthor?authorById(editingAuthor):null;
    var next={
      id:existing?existing.id:rowId(handle,"author"),
      category:document.getElementById("authorCategory").value.trim()||"未分组",
      handle:handle,
      name:name,
      field:document.getElementById("authorField").value.trim(),
      platform:document.getElementById("authorPlatform").value,
      status:document.getElementById("authorStatus").value,
      enabled:existing?existing.enabled:true
    };
    if(existing)rows=rows.map(function(row){return row.id===existing.id?next:row;});
    else{
      var base=next.id,seq=2;
      while(rows.some(function(row){return row.id===next.id;}))next.id=base+"-"+seq++;
      rows=rows.concat([next]);
    }
    set("kol.authors",rows);
    document.getElementById("authorDialog").close();
    render();
  }
  function deleteAuthor(id){
    var row=authorById(id);if(!row)return;
    if(!window.confirm("删除作者「"+row.name+"」？"))return;
    set("kol.authors",authors().filter(function(author){return author.id!==id;}));
    render();
  }
  function toggleAuthor(id,checked){
    set("kol.authors",authors().map(function(row){if(row.id===id)row.enabled=!!checked;return row;}));
    render();
  }
  function pushTargets(){return get("push.targets")||[];}
  function enabledTargetCount(){return pushTargets().filter(function(row){return row.enabled;}).length;}
  function targetById(id){return pushTargets().find(function(row){return row.id===id;});}
  function targetRow(target){
    return '<div class="manage-row target-row">'+
      '<div class="manage-main"><div class="target-mark">'+ico("rocket")+'</div><div><div class="manage-name">'+esc(target.name)+'</div><div class="manage-code">'+esc(target.env_key)+'</div></div></div>'+
      '<div class="manage-cell"><b>类型</b>'+esc((target.type||"lark").toUpperCase())+'</div>'+
      '<div class="manage-cell"><b>角色</b><span class="role-pill '+attr(target.role||"secondary")+'">'+(target.role==="primary"?"主机器人":"备用")+'</span></div>'+
      '<div class="manage-cell"><b>签名变量</b>'+esc(target.secret_env_key||"未设置")+'</div>'+
      '<div class="manage-actions"><button class="config-icon-btn" title="编辑" onclick="workbenchEditTarget(\''+attr(target.id)+'\')">'+ico("gear")+'</button><button class="config-icon-btn danger" title="删除" onclick="workbenchDeleteTarget(\''+attr(target.id)+'\')">'+ico("trash")+'</button></div>'+
      '<div class="manage-toggle">'+switchHtml("",!!target.enabled,"workbenchToggleTarget('"+attr(target.id)+"',this.checked)")+'</div>'+
    '</div>';
  }
  function topDimensionControls(){
    var selected=get("push.top3_dimensions")||[];
    return '<div class="dimension-checks">'+[["kol","KOL"],["oss","开源"],["fin","金融"],["lab","大厂"],["paper","论文"]].map(function(row){
      return '<label><input type="checkbox" '+(selected.indexOf(row[0])>=0?'checked ':'')+'onchange="workbenchTopDimension(\''+row[0]+'\',this.checked)"><span>'+row[1]+'</span></label>';
    }).join("")+'</div>';
  }
  function renderPushConfig(){
    var settings='<div class="setting-list">'+
      toggleRow("启用推送","push.enabled","push.enabled")+
      selectRow("目标策略","push.target_policy","push.target_policy",[["primary_only","仅主机器人"],["all_enabled","所有已启用机器人"]])+
      numberRow("重点热点数量","push.hot_topics","push.hot_topics",1,8,1,"条")+
      numberRow("新信号数量","push.featured_items","push.featured_items",1,8,1,"条")+
      numberRow("普通维度数量","push.per_dimension","push.per_dimension",1,5,1,"条")+
      numberRow("摘要长度","push.summary_chars","push.summary_chars",80,260,10,"字")+
      '<div class="setting-row"><div><div class="setting-label">Top3 维度</div><div class="setting-meta">push.top3_dimensions</div></div><div class="setting-control">'+topDimensionControls()+'</div></div>'+
      '<div class="setting-row"><div><div class="setting-label">推送标题</div><div class="setting-meta">push.title_prefix</div></div><div class="setting-control"><input class="config-input" value="'+attr(get("push.title_prefix"))+'" onchange="workbenchText(\'push.title_prefix\',this.value)"></div></div>'+
    '</div>';
    var list=pushTargets().length?pushTargets().map(targetRow).join(""):'<div class="rss-empty">'+ico("rocket")+'暂无机器人</div>';
    var toolbar='<div class="manage-toolbar"><div class="rss-master">'+switchHtml("push.enabled",!!get("push.enabled"))+'推送通道</div>'+
      '<div class="rss-metrics"><span>启用 <b>'+enabledTargetCount()+'</b></span><span>策略 <b>'+esc(get("push.target_policy"))+'</b></span></div>'+
      '<button class="config-btn primary" style="margin-left:auto" onclick="workbenchEditTarget()">'+ico("plus")+'新增机器人</button></div>';
    return toolbar+section("rocket","机器人列表",'<div class="manage-list">'+list+'</div>',pushTargets().length+" 个目标")+
      section("gear","内容与策略",settings);
  }
  function editTarget(id){
    editingTarget=id||null;
    var row=id?clone(targetById(id)||{}):{name:"",type:"lark",env_key:"",secret_env_key:"",role:"secondary",enabled:true};
    var dialog=ensureManagedDialog("targetDialog");
    dialog.innerHTML='<form method="dialog" onsubmit="return false"><div class="config-dialog-panel">'+
      '<div class="config-dialog-head"><h3>'+(id?"编辑机器人":"新增机器人")+'</h3><button class="config-icon-btn" style="margin-left:auto" onclick="document.getElementById(\'targetDialog\').close()" title="关闭">'+ico("x")+'</button></div>'+
      '<div class="config-dialog-body">'+
        '<div class="field"><label>名称</label><input id="targetName" class="config-input" value="'+attr(row.name||"")+'" required></div>'+
        '<div class="field"><label>类型</label><select id="targetType" class="config-select">'+selectOptions([["lark","Lark"],["feishu","飞书"]],row.type)+'</select></div>'+
        '<div class="field wide"><label>Webhook 环境变量名</label><input id="targetEnvKey" class="config-input" value="'+attr(row.env_key||"")+'" placeholder="DAILY_INTEL_LARK_WEBHOOK" required></div>'+
        '<div class="field wide"><label>签名密钥环境变量名</label><input id="targetSecretKey" class="config-input" value="'+attr(row.secret_env_key||"")+'" placeholder="可选，不填写真实密钥"></div>'+
        '<div class="field"><label>角色</label><select id="targetRole" class="config-select">'+selectOptions([["primary","主机器人"],["secondary","备用机器人"]],row.role)+'</select></div>'+
      '</div><div class="config-dialog-foot"><button class="config-btn" onclick="document.getElementById(\'targetDialog\').close()">取消</button><button class="config-btn primary" onclick="workbenchCommitTarget()">'+ico("save")+'保存机器人</button></div>'+
    '</div></form>';
    dialog.showModal();
  }
  function commitTarget(){
    var name=document.getElementById("targetName").value.trim();
    var envKey=document.getElementById("targetEnvKey").value.trim();
    var secretEnvKey=document.getElementById("targetSecretKey").value.trim();
    var envNamePattern=/^[A-Z][A-Z0-9_]*$/;
    if(!name||!envNamePattern.test(envKey)||(secretEnvKey&&!envNamePattern.test(secretEnvKey))){
      toast("这里只能填写环境变量名，不能粘贴真实地址或密钥");
      return;
    }
    var rows=pushTargets(),existing=editingTarget?targetById(editingTarget):null;
    var role=document.getElementById("targetRole").value;
    var next={
      id:existing?existing.id:rowId(name,"bot"),
      name:name,
      type:document.getElementById("targetType").value,
      env_key:envKey,
      secret_env_key:secretEnvKey,
      role:role,
      enabled:existing?existing.enabled:true
    };
    if(role==="primary")rows=rows.map(function(row){row.role="secondary";return row;});
    if(existing)rows=rows.map(function(row){return row.id===existing.id?next:row;});
    else rows=rows.concat([next]);
    if(!rows.some(function(row){return row.role==="primary";})&&rows.length)rows[0].role="primary";
    set("push.targets",rows);
    document.getElementById("targetDialog").close();
    render();
  }
  function deleteTarget(id){
    var row=targetById(id);if(!row)return;
    if(!window.confirm("删除机器人「"+row.name+"」？"))return;
    var rows=pushTargets().filter(function(target){return target.id!==id;});
    if(!rows.some(function(target){return target.role==="primary";})&&rows.length)rows[0].role="primary";
    set("push.targets",rows);
    render();
  }
  function toggleTarget(id,checked){
    set("push.targets",pushTargets().map(function(row){if(row.id===id)row.enabled=!!checked;return row;}));
    render();
  }
  function toggleTopDimension(key,checked){
    var selected=(get("push.top3_dimensions")||[]).slice();
    if(checked&&selected.indexOf(key)<0)selected.push(key);
    if(!checked)selected=selected.filter(function(value){return value!==key;});
    set("push.top3_dimensions",selected);
  }
  function feedRow(feed){
    return '<div class="rss-row">'+
      '<div class="rss-main"><div class="rss-mark">'+ico("rss")+'</div><div style="min-width:0"><div class="rss-name">'+esc(feed.name)+'</div><div class="rss-url" title="'+attr(feed.url)+'">'+esc(feed.url)+'</div></div></div>'+
      '<div class="rss-cell"><b>展示维度</b>'+dimensionName(feed.dimension)+'</div>'+
      '<div class="rss-cell"><b>查询组</b>'+esc(feed.query_group||"community_hotspots")+'</div>'+
      '<div class="rss-cell"><b>优先级</b><span class="priority '+attr(feed.priority||"normal")+'">'+priorityName(feed.priority)+'</span></div>'+
      '<div class="rss-actions"><button class="config-icon-btn" title="编辑" onclick="workbenchEditFeed(\''+attr(feed.id)+'\')">'+ico("gear")+'</button><button class="config-icon-btn danger" title="删除" onclick="workbenchDeleteFeed(\''+attr(feed.id)+'\')">'+ico("trash")+'</button></div>'+
      '<div class="rss-toggle">'+switchHtml("",!!feed.enabled,"workbenchToggleFeed('"+attr(feed.id)+"',this.checked)")+'</div>'+
    '</div>';
  }
  function dimensionName(key){
    var names={lab:"AI 大厂动态",kol:"KOL 观点",paper:"前沿论文",oss:"开源项目",fin:"AI × 金融"};
    return names[key]||key||"-";
  }
  function priorityName(value){return value==="high"?"高":value==="low"?"低":"普通";}
  function renderRss(){
    var feeds=get("rss.feeds")||[];
    var list=feeds.length?feeds.map(feedRow).join(""):'<div class="rss-empty">'+ico("rss")+'暂无订阅源</div>';
    var toolbar='<div class="rss-toolbar"><div class="rss-master">'+switchHtml("rss.enabled",!!get("rss.enabled"))+'RSS 采集</div>'+
      '<div class="rss-metrics"><span>启用 <b>'+enabledRssCount()+'</b></span><span>回看 <b>'+esc(get("rss.lookback_days"))+'d</b></span><span>单源 <b>'+esc(get("rss.max_items_per_feed"))+'</b></span></div>'+
      '<button class="config-btn primary" style="margin-left:auto" onclick="workbenchEditFeed()">'+ico("plus")+'新增订阅</button></div>';
    var params='<div class="setting-list">'+
      numberRow("RSS 回看窗口","lookback_days","rss.lookback_days",1,30,1,"天")+
      numberRow("单源候选上限","max_items_per_feed","rss.max_items_per_feed",1,100,1,"条")+
      numberRow("请求超时","timeout_seconds","rss.timeout_seconds",3,60,1,"秒")+
    '</div>';
    return '<div class="config-shell">'+header("RSS 订阅源","RSS / Atom · Agent 候选发现")+
      toolbar+section("rss","订阅列表",'<div class="rss-list">'+list+'</div>',feeds.length+" 个来源")+
      section("gear","采集参数",params)+'</div>';
  }
  function feedById(id){return (get("rss.feeds")||[]).find(function(feed){return feed.id===id;});}
  function feedId(name){
    var value=String(name||"feed").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g,"-").replace(/^-|-$/g,"");
    return value||("feed-"+Date.now());
  }
  function ensureDialog(){
    var dialog=document.getElementById("rssDialog");
    if(dialog)return dialog;
    dialog=document.createElement("dialog");
    dialog.id="rssDialog";
    dialog.className="config-dialog";
    document.body.appendChild(dialog);
    dialog.addEventListener("click",function(event){if(event.target===dialog)dialog.close();});
    return dialog;
  }
  function editFeed(id){
    editingFeed=id||null;
    var feed=id?clone(feedById(id)||{}):{name:"",url:"",enabled:true,query_group:"community_hotspots",dimension:"lab",priority:"normal"};
    var dialog=ensureDialog();
    dialog.innerHTML='<form method="dialog" onsubmit="return false"><div class="config-dialog-panel">'+
      '<div class="config-dialog-head"><h3>'+(id?"编辑订阅源":"新增订阅源")+'</h3><button class="config-icon-btn" style="margin-left:auto" onclick="document.getElementById(\'rssDialog\').close()" title="关闭">'+ico("x")+'</button></div>'+
      '<div class="config-dialog-body">'+
        '<div class="field wide"><label>名称</label><input id="rssName" class="config-input" value="'+attr(feed.name||"")+'" required></div>'+
        '<div class="field wide"><label>RSS / Atom URL</label><input id="rssUrl" class="config-input" type="url" value="'+attr(feed.url||"")+'" required></div>'+
        '<div class="field"><label>展示维度</label><select id="rssDimension" class="config-select">'+selectOptions([["lab","AI 大厂动态"],["kol","KOL 观点"],["paper","前沿论文"],["oss","开源项目"],["fin","AI × 金融"]],feed.dimension)+'</select></div>'+
        '<div class="field"><label>优先级</label><select id="rssPriority" class="config-select">'+selectOptions([["high","高"],["normal","普通"],["low","低"]],feed.priority)+'</select></div>'+
        '<div class="field wide"><label>查询组</label><select id="rssGroup" class="config-select">'+selectOptions([["community_hotspots","community_hotspots"],["access_and_quota","access_and_quota"],["chinese_frontier_models","chinese_frontier_models"],["x_viewpoints","x_viewpoints"],["domestic_lab_models","domestic_lab_models"],["domestic_lab_product_ops","domestic_lab_product_ops"],["domestic_lab_research","domestic_lab_research"],["dynamic_kol_views","dynamic_kol_views"]],feed.query_group)+'</select></div>'+
      '</div><div class="config-dialog-foot"><button class="config-btn" onclick="document.getElementById(\'rssDialog\').close()">取消</button><button class="config-btn primary" onclick="workbenchCommitFeed()">'+ico("save")+"保存订阅</button></div>"+
    '</div></form>';
    dialog.showModal();
    setTimeout(function(){var input=document.getElementById("rssName");if(input)input.focus();},20);
  }
  function selectOptions(options,value){
    return options.map(function(item){return '<option value="'+attr(item[0])+'" '+(item[0]===value?'selected':'')+'>'+esc(item[1])+'</option>';}).join("");
  }
  function commitFeed(){
    var name=document.getElementById("rssName").value.trim();
    var url=document.getElementById("rssUrl").value.trim();
    if(!name||!/^https?:\/\//i.test(url)){toast("请填写有效名称和 URL");return;}
    var feeds=get("rss.feeds")||[],existing=editingFeed?feedById(editingFeed):null;
    var next={
      id:existing?existing.id:feedId(name),
      name:name,
      url:url,
      enabled:existing?existing.enabled:true,
      query_group:document.getElementById("rssGroup").value,
      dimension:document.getElementById("rssDimension").value,
      priority:document.getElementById("rssPriority").value
    };
    if(existing)feeds=feeds.map(function(feed){return feed.id===existing.id?next:feed;});
    else{
      var base=next.id,seq=2;
      while(feeds.some(function(feed){return feed.id===next.id;}))next.id=base+"-"+seq++;
      feeds=feeds.concat([next]);
    }
    set("rss.feeds",feeds);
    document.getElementById("rssDialog").close();
    render();
  }
  function deleteFeed(id){
    var feed=feedById(id);if(!feed)return;
    if(!window.confirm("删除订阅源「"+feed.name+"」？"))return;
    set("rss.feeds",(get("rss.feeds")||[]).filter(function(row){return row.id!==id;}));
    render();
  }
  function toggleFeed(id,checked){
    var feeds=(get("rss.feeds")||[]).map(function(feed){if(feed.id===id)feed.enabled=!!checked;return feed;});
    set("rss.feeds",feeds);
    if(window.renderNav)window.renderNav();
  }
  function render(){
    if(window.state&&["config","rss"].indexOf(window.state.view)>=0&&window.render)window.render();
  }

  window.renderWorkbenchConfig=renderConfig;
  window.renderRssSources=renderRss;
  window.getEnabledRssCount=enabledRssCount;
  window.workbenchConfigTab=setConfigTab;
  window.workbenchToggleLane=toggleLane;
  window.workbenchKolSearch=setKolSearch;
  window.workbenchKolFilter=setKolFilter;
  window.workbenchKolPage=changeKolPage;
  window.workbenchEditAuthor=editAuthor;
  window.workbenchCommitAuthor=commitAuthor;
  window.workbenchDeleteAuthor=deleteAuthor;
  window.workbenchToggleAuthor=toggleAuthor;
  window.workbenchEditTarget=editTarget;
  window.workbenchCommitTarget=commitTarget;
  window.workbenchDeleteTarget=deleteTarget;
  window.workbenchToggleTarget=toggleTarget;
  window.workbenchTopDimension=toggleTopDimension;
  window.workbenchToggle=toggle;
  window.workbenchNumber=number;
  window.workbenchText=text;
  window.workbenchSave=saveLocal;
  window.workbenchDownload=download;
  window.workbenchSyncAgent=syncAgent;
  window.workbenchImport=importFile;
  window.workbenchReset=reset;
  window.workbenchEditFeed=editFeed;
  window.workbenchCommitFeed=commitFeed;
  window.workbenchDeleteFeed=deleteFeed;
  window.workbenchToggleFeed=toggleFeed;
  window.WORKBENCH_CONFIG=current;
  if(window.renderNav)window.renderNav();
})();
