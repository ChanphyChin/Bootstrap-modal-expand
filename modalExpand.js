/**
 * created by Chanphy on 2018-6-15
 *     desc:该js文件为jq插件modal的拓展包
 *          所有元素操作均放在该js完成
 *          需要的弹窗只需要根据每个弹窗调用方法即可
 *          该拓展包所有方法均支持链式编程
 *   notice:文件依赖于jQuery 以及 bootstrap Modal 请依次引用并把该文件放置三者的最后面
 */ 

;(function($){

  /**
   * 只读列表弹窗
   * 使用组件步奏：
   *            1 页面引入js
   *            2 使用 $._modalRead.setData(params) 设置需要展示的数据
   *              2.1 参数为对象
   *              2.2 参数格式参照默认的参数定义
   *            3 使用 $._modalRead.init() 初始化弹窗
   *            4 使用 $._modalRead.show()调出弹窗
   *            5 使用 $._modalRead.setCloseCb(fn)传入关闭弹窗的回调
   */
  function ModalRead (){
    var _this = this;
    //初始化组件
    this.init = function init(){
      if($(_this.default.el)){
        $(_this.default.el).remove();
      }
      var theadHtml = '', tbodyHtml = '',singletheadHtml='',singletbodyHtml = '';
      //遍历thead
      var widthArr = ['width="25%"','width="25%"','width="50%"'];
      for(var i = 0; i < _this.default.data.thead.length; i ++){
        var item = _this.default.data.thead[i];
        var classname = i == 0 ?'class="tc"':'';
        singletheadHtml += '<th width="'+widthArr[i]+'" '+classname+'>'+item+'</th>'
      }
      theadHtml = 
            '<thead>' +
              '<tr>' +
                singletheadHtml +
              '</tr>' +
            '</thead>';
      //遍历tbody
      for(var j = 0; j < _this.default.data.tbody.length; j++){
        var td = '';
        var item = _this.default.data.tbody[j];
        for(var j2 = 0; j2 < item.length; j2++){
          var classname = j2 == 0 ?'align="center"':'';
          td += '<td width="'+widthArr[j2]+'" '+classname+'>'+item[j2]+'</td>';
        }
        singletbodyHtml += '<tr>'+td+'</tr>';
      }
      tbodyHtml = 
        '<tbody>' + singletbodyHtml + '</tbody>'
      var template = 
        '<div class="modal fade custom_modal" id="modalRead" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" >' +
          '<div class="modal-dialog">' +
            '<div class="modal-content">' +
              '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" ></button>' +
                '<h4 class="modal-title" id="myModalLabel">'+_this.default.data.title+'</h4>' +          
              '</div>' +
              '<div class="modal-body">' +
                '<div class="bs-table-container">' +
                  '<div class="bs-table-body table-responsive per_maxH320">' +
                    '<table class="table bs-table">' +
                      theadHtml +             
                      tbodyHtml +   
                    '</table>' +
                  '</div>' + 
                '</div>' +           
              '</div>' +
              '<div class="modal-footer form-button-group">' +
                '<button type="button" class="btn btn-primary" id="modalReadBtn">确定</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' 
        
        $('body').append(template);
        $('#modalReadBtn').click(function(){
          _this.hide(); 
        })
        return this;
    };
    //显示组件
    this.show = function(){
      $(this.default.el).modal('show');
      return this;
    },
    //隐藏组件
    this.hide = function(){
      $(this.default.el).modal('hide');
      this.default.data.callback && this.default.data.callback();
      return this;
    },
    //组件关闭之后的回调
    this.setCloseCb = function(fn){
      this.default.data.callback = fn;
      return this;
    };
    //默认数据
    this.default = {
      //html渲染的数据
      data:{
        //弹窗左上角标题
        title:'title',
        //弹窗表头
        thead:['tr1','tr2','tr3'],
        //弹窗标题
        tbody:[
          ['td 1-1','td 1-2','td 1-3'],
          ['td 2-1','td 2-2','td 2-3']
        ],
        callback:null
      },
      //juery元素
      el:'#modalRead'
    }
    //数据设置
    this.setData = function(params){
      $.extend(this.default.data,params);
      this.init();
      return this;
    }
  }
  $._modalRead = new ModalRead();
  
  

  /**
   * 部门树状图弹窗
   * 使用组件步奏：
   *            1 页面引入js
   *            2 使用 $._modalDepartment.setData(params) 设置需要展示的数据
   *              2.1 参数为对象
   *              2.2 参数格式参照默认的参数定义
   *            3 使用 $._modalDepartment.show()调出弹窗
   *            4 使用 $._modalDepartment.setCloseCb(fn)传入关闭弹窗的回调
   *            5 使用 $._modalDepartment.setMultiple(boolean)设置是否多选 (必须在init之前设置是否为多选)
   *            6 传入的关闭弹窗回调函数有一个参数为包含选中的部门id和名称的对象
   */

  function ModalDepartment (){
    var _this = this;
    //初始化组件
    this.init = function (){
      if($(_this.default.el)){
        $(_this.default.el).remove();
      }
      var template = 
      '<div class="modal fade custom_modal" id="modalDepartment" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
        '<div class="modal-dialog">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>' +
              '<h4 class="modal-title" id="myModalLabel">选择部门</h4>' +          
            '</div>' +
            '<div class="modal-body">' +
                '<div class="accordion_wrap h320"><ul id="departmentTree" class="ztree"></ul></div>' +
            '</div>' +
            '<div class="modal-footer form-button-group">' +
              '<p class="g9 tl fl">提示：只能选择一个部门</p>' +      
              '<button type="button" id="modalDepartmentBtn" class="btn btn-primary">确定</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' ;
      $('body').append(template);
      $('#modalDepartmentBtn').click(function(){
        _this.hide(); 
      })
      //部门树状图初始化
      var cssJson =[{"color":"#666"}]
      function setFontCss(treeId, treeNode) {
          if(treeNode.level == 0){
              cssJson = [{"font-weight":"bold"}];
          } else if(treeNode.level == 1){
              cssJson.fontWeight = "bold";
          } else{
              cssJson.fontWeight = "normal";
          }
          return cssJson;
      };
      var zSetting = {
        view: {
          dblClickExpand: false,
          selectedMulti: false,
          // showLine: false,
          // showIcon: false,
      
        },
        check: {
          enable: _this.isCheckBox,
          chkStyle: "checkbox",
          radioType: "all"
        },
        callback: {
            onClick: zTreeOnClick,
            onCheck:zTreeOnCheck
        },
        data: {
          simpleData: {
            enable: true
          }
        }
      }
      var zNodes = _this.treeData;
      function zTreeOnClick(e,treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj("departmentTree");
        // treeObj.checkNode(treeNode, !treeNode.checked, null, true);
        var nodes = treeObj.getSelectedNodes();
        var treeId = nodes[0].id;//ID
        var treeName = nodes[0].name;//名称
        $("#departmentName").attr("value", treeName);//名称 
        $("#departmentId").val(treeId);//ID 
        console.log(treeId+ ", " +treeName);//返回被选中节点对象
        _this.default.data.selectedNode = {treeId:treeId,treeName:treeName};
        return treeId;       
      }
      function zTreeOnCheck(e, treeId, treeNode) {
        //获取选中机构用户节点
        var treeObj = $.fn.zTree.getZTreeObj("departmentTree");
        //这里获取选中的 id name核心
        var orgNodes = treeObj.getCheckedNodes(true);
      
        var treeId = "";//ID集合
        var treeName = "";//名称集合
        //循环重新加载选中部门
        for(var i=0;i<orgNodes.length;i++){
          var node = orgNodes[i];
          if(node.getCheckStatus().half){
            if(treeId.charAt(treeId.length-1) == ''){
              continue;
            }
            if(treeName.charAt(treeName.length-1) == ''){
              continue;
            }
            if(treeId.charAt(treeId.length-1) != ','){
              treeId += ',';
            }
            if(treeName.charAt(treeName.length-1) != ','){
              treeName += ',';
            }
            continue;
          }
          treeId += node.id +",";
          treeName += node.name +",";
        }
        treeId = treeId.substring(0,treeId.length-1);
        treeName = treeName.substring(0,treeName.length-1);
        _this.default.data.checkedTreeId = treeId;
        return this;
      }
      function initzTree(){
        $.fn.zTree.init($("#departmentTree"), zSetting, zNodes);
        var treeObj = $.fn.zTree.getZTreeObj("departmentTree");
        //默认展开一级子节点
        var nodes = treeObj.getNodes();
        if (nodes.length>0) {
            for(var i=0;i<nodes.length;i++){
              treeObj.expandNode(nodes[i], true, false, false);//设置节点展开
            }
        }       
      }
      //初始化组织结构树
      initzTree();
      return this;
    };
    //显示组件
    this.show = function(){
      $(this.default.el).modal('show');
      return this;
    },
    //隐藏组件
    this.hide = function(){
      $(this.default.el).modal('hide');
      if(this.isCheckBox){
        this.default.data.callback && this.default.data.callback(this.default.data.checkedTreeId)
      }else{
        this.default.data.callback && this.default.data.callback(this.default.data.selectedNode);
      }
      
      return this;
    },
    //组件关闭之后的回调
    this.setCloseCb = function(fn){
      this.default.data.callback = fn;
      return this;
    };
    //默认数据
    this.default = {
      //html渲染的数据
      data:{
        //弹窗左上角标题
        title:'选择部门',
        //选中的节点
        selectedNode:{
          id:'',
          name:''
        },
        checkedTreeId:''
      },
      //juery元素
      el:'#modalDepartment',
      callback:null,
      treeData:[],
      isCheckBox:false,
    }
    //数据设置
    this.setData = function(data){
      this.treeData = data;
      this.init();
      return this;
    }
    //数据设置
    this.setMultiple = function(boolean){
      this.isCheckBox = boolean;
      return this;
    }
    this.treeData = [];
  }
  $._modalDepartment = new ModalDepartment();
  
  
  /**
   * 员工选择弹窗
   * 使用组件步奏：
   *            1 页面引入js
   *            2 使用 $._modalRadios.setData(params) 设置需要展示的数据
   *              2.1 参数为对象
   *              2.2 参数格式参照默认的参数定义
   *            3 使用 $._modalRadios.show()调出弹窗
   *            4 使用 $._modalRadios.setCloseCb(fn)传入关闭弹窗的回调
   *            5 使用 $._modalRadios.setSearch(fn)传入搜索的回调
   */

  function ModalRadios (){
    var _this = this;
    //初始化组件
    this.init = function init(){
      if($(_this.default.el)){
        $(_this.default.el).remove();
      }
      //遍历thead
      var theadHtml = '', tbodyHtml = '',singletheadHtml='',singletbodyHtml = '';
      var widthArr = ['width="20%"','width="20%"','width="30%"','width="30%"'];
      for(var i = 0; i < _this.default.data.thead.length; i ++){
        var trclass = i == 0? 'class="tc"' : '';
        singletheadHtml += '<th '+ widthArr[i] + trclass +'>'+_this.default.data.thead[i]+'</th>'
      }
      theadHtml = '<thead><tr>'+singletheadHtml+'</tr></thead>';
      //遍历tbody
      for(var i = 0; i < _this.default.data.tbody.length; i ++){
        var td = ''
        var item = _this.default.data.tbody[i];
        for(var j = 0; j < item.length; j++){
          if(item[j]){
            td += '<td '+ widthArr[j] +'>'+item[j]+'</td>'
          }else{
            td += '<td width="20%" align="center"><input type="radio" name="radio"  data-name="'+item[1]+'"></td>'
          }
        }
        singletbodyHtml += '<tr>'+td+'</tr>'
      }
      tbodyHtml = '<tbody>'+singletbodyHtml+'</tbody>';
      var template = 
        '<div class="modal fade custom_modal" id="modalRadios" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" >'+
          '<div class="modal-dialog">'+
            '<div class="modal-content">'+
              '<div class="modal-header">'+
                '<button type="button" class="close" data-dismiss="modal" ></button>'+
                '<h4 class="modal-title" id="myModalLabel">'+_this.default.data.title+'</h4>'+
              '</div>'+
              '<div class="modal-body">'+
                '<form class="form-inline asearch_form mr10 mt10 mb10">'+
                  '<div class="form-group">'+
                    '<input type="text" class="form-control" id="modaiRadiosSearchVal" placeholder="角色名">'+
                  '</div>'+
                  '<button type="button" class="btn btn-primary" id="modalRadiosSearch">搜索</button>'+
                '</form> '+
                '<div class="bs-table-container">'+
                  '<div class="bs-table-body table-responsive table-h320">'+
                    '<table class="table bs-table">'+
                      theadHtml+              
                      tbodyHtml+    
                    '</table>'+
                  '</div>' +
                '</div>'+
              '</div>'+
              '<div class="modal-footer form-button-group">'+
                '<button type="button" class="btn btn-primary" id="modalRadioBtn">确定</button>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'
              
        $('body').append(template);
        $('#modalRadioBtn').click(function(){
          var radios = $('input:radio:checked');
          _this.default.data.searchNode.name = radios[0].dataset.name;
          _this.hide();
        })
        $('#modalRadiosSearch').click(function(){
          _this.default.data.searchVal = $('#modaiRadiosSearchVal').val();
          _this.search(); 
        })
        return this;
    };
    //显示组件
    this.show = function(){
      $(this.default.el).modal('show');
      return this;
    },
    //隐藏组件
    this.hide = function(){
      $(this.default.el).modal('hide');
      this.default.data.callback && this.default.data.callback(_this.default.data.searchNode);
      return this;
    },
    //组件关闭之后的回调
    this.setCloseCb = function(fn){
      this.default.data.callback = fn;
      return this;
    };
    //默认数据
    this.default = {
      //html渲染的数据
      data:{
        //弹窗左上角标题
        title:'员工选择',
        //弹窗表头
        thead:['选择','姓名','原职位','原部门'],
        //弹窗标题
        tbody:[
          [null,'王小明','原职位','原部门'],
          [null,'王小明','原职位','原部门'],
        ],
        callback:null,
        searchVal:'',
        searchFn:null,
        searchNode:{
          name:''
        }
      },
      //juery元素
      el:'#modalRadios'
    }
    //数据设置
    this.setData = function(params){
      $.extend(this.default.data,params);
      this.init();
      return this;
    }
    //搜索
    this.search = function(){
      this.default.searchFn(this.default.data.searchVal);
      return this;
    },
    //设置搜索方法
    this.setSearch = function(fn){
      this.default.searchFn = fn;
      return this;
    }
  }
  $._modalRadios = new ModalRadios();

   /**
   * 权限选择弹窗
   * 使用组件步奏：
   *            1 页面引入js
   *            2 使用 $._modalPomission.setData(params) 设置需要展示的数据
   *              2.1 参数为对象
   *              2.2 参数格式参照默认的参数定义
   *            3 使用 $._modalPomission.show()调出弹窗
   *            4 使用 $._modalPomission.setCloseCb(fn)传入关闭弹窗的回调
   */

  function ModalPomission (){
    var _this = this;
    //初始化组件
    this.init = function (){
      if($(_this.default.el)){
        $(_this.default.el).remove();
      }
      var template = 
      '<div class="modal fade custom_modal" id="permissioModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
        '<div class="modal-dialog">'+
          '<div class="modal-content">'+
            '<div class="modal-header">'+
              '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>'+
              '<h4 class="modal-title" id="myModalLabel">选择权限</h4>'+
            '</div>'+
            '<div class="modal-body">'+
              '<div class="ztree-table h320">'+
                '<ul id="dataTree" class="ztree"></ul>'+
              '</div>'+
            '</div>'+
            '<div class="modal-footer form-button-group">'+
              '<p class="g9 tl fl">提示：可选择多个权限</p>'+
              '<button type="button" class="btn btn-primary" id="modalPomissionBtn">确定</button>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>' 
      $('body').append(template);
      $('#modalPomissionBtn').click(function(){
        _this.hide(); 
      })
      var zTreeTableNodes;
      var roleTableSetting = {
        view: {
          showLine: false,
          showIcon: false,
          addDiyDom: addDiyDom
        },
        check: {
          enable: true,
          chkStyle: "checkbox",
          radioType: "all"
        },        
        data: {
          simpleData: {
          enable: true
          }
        },
        callback: {
            onCheck:zTreeOnCheck
        }
      };
      /**
       * 自定义DOM节点
       */
      function addDiyDom(treeId, treeNode) {
        var spaceWidth = 15;
        var liObj = $("#" + treeNode.tId);
        var aObj = $("#" + treeNode.tId + "_a");
        var switchObj = $("#" + treeNode.tId + "_switch");
        var icoObj = $("#" + treeNode.tId + "_ico");
        var spanObj = $("#" + treeNode.tId + "_span");
        aObj.attr('title', '');
        aObj.append('<div class="diy swich nth1"></div>');
        var div = $(liObj).find('div').eq(0);
        switchObj.remove();
        spanObj.remove();
        icoObj.remove();
        div.append(switchObj);
        div.append(spanObj);
        var spaceStr = "<span style='height:1px;display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
        switchObj.before(spaceStr);
        var editStr = '';
        editStr += '<div class="diy nth2">' + (treeNode.describe == null ? '&nbsp;' : treeNode.describe) + '</div>';
        aObj.append(editStr);
      }

      function zTreeOnCheck(e, treeId, treeNode) {
        //获取选中机构用户节点
        var treeObj = $.fn.zTree.getZTreeObj("dataTree");
        //这里获取选中的 id name核心
        var orgNodes = treeObj.getCheckedNodes(true);
      
        var treeId = "";//ID集合
        var treeName = "";//名称集合
        //循环重新加载选中部门
        for(var i=0;i<orgNodes.length;i++){
          var node = orgNodes[i];
          if(node.getCheckStatus().half){
            if(treeId.charAt(treeId.length-1) == ''){
              continue;
            }
            if(treeName.charAt(treeName.length-1) == ''){
              continue;
            }
            if(treeId.charAt(treeId.length-1) != ','){
              treeId += ',';
            }
            if(treeName.charAt(treeName.length-1) != ','){
              treeName += ',';
            }
            continue;
          }
          treeId += node.id +",";
          treeName += node.name +",";
        }
        treeId = treeId.substring(0,treeId.length-1);
        treeName = treeName.substring(0,treeName.length-1);
        _this.default.data.treeId = treeId;
        return this;
      }

      /**
       * 查询数据
       */
      function initzTreeTable() {
        var roleTableData= _this.treeData;
        //初始化列表
        zTreeTableNodes = roleTableData;
        //初始化树
        $.fn.zTree.init($("#dataTree"), roleTableSetting, zTreeTableNodes);
        //添加数据
        var rows = $("#dataTree").find('li');          
      }
        
      initzTreeTable();
      return this;
    };
    //显示组件
    this.show = function(){
      $(this.default.el).modal('show');
      return this;
    },
    //隐藏组件
    this.hide = function(){
      $(this.default.el).modal('hide');
      this.default.data.callback && this.default.data.callback(this.default.data.treeId);
      return this;
    },
    //组件关闭之后的回调
    this.setCloseCb = function(fn){
      this.default.data.callback = fn;
      return this;
    };
    //默认数据
    this.default = {
      //html渲染的数据
      data:{
        //弹窗左上角标题
        title:'选择部门',
        //选中的节点
        selectedNode:{
          id:'',
          name:''
        },
        treeId:''
      },
      //juery元素
      el:'#permissioModal',
      callback:null
    }
    //数据设置
    this.setData = function(data){
      this.treeData = data;
      this.init();
      return this;
    }
    this.treeData = [];
  }
  $._modalPomission = new ModalPomission();

  /**
   * 员工选择弹窗
   * 使用组件步奏：
   *            1 页面引入js
   *            2 使用 $._modalMulpiple.setData(params) 设置需要展示的数据
   *              2.1 参数为对象
   *              2.2 参数格式参照默认的参数定义
   *            3 使用 $._modalMulpiple.show()调出弹窗
   *            4 使用 $._modalMulpiple.setCloseCb(fn)传入关闭弹窗的回调
   *            5 使用 $._modalMulpiple.setSearch(fn)传入搜索的回调
   *            5 使用 $._modalMulpiple.setSelectChange(fn)传入下拉框的回调
   */

  function ModalMulpiple (){
    var _this = this;
    //组件初始化
    this.init = function(){
      if($('#modalMulpiple')){
        $('#modalMulpiple').remove();
      }
      var options = '',theadHtml = '',tbodyHtml = "";
      //遍历下拉框选项
      for(var oindex = 0; oindex < this.default.data.selectOptions.length; oindex ++){
        var item = this.default.data.selectOptions[oindex];
        options += '<option value="'+item+'" '+(oindex == 0? "selected":"")+'>'+ item +'</option>';
      }
      //遍历表格头
      var widthArr = ['width="8%"','width="18%"','width="30%"',''];
      for(var hindex = 0; hindex < this.default.data.thead.length; hindex ++){
        var item = this.default.data.thead[hindex];
        theadHtml += '<th '+widthArr[hindex]+'>'+item+'</th>'
      }
      //遍历表格内容
      for(var tindex = 0; tindex < this.default.data.tbody.length; tindex ++){
        var tr = '';
        var item  = this.default.data.tbody[tindex];
        for(var dindex = 0; dindex < item.length; dindex++){
          if(dindex == 0){
            tr += '<td '+widthArr[dindex]+'><div class="checked_md"><input type="checkbox" autocomplete="off"></div></td>';
          }else{
            tr += '<td '+widthArr[dindex]+'>'+item[dindex]+'</td>';
          }
        }
        tbodyHtml += '<tr>'+ tr + '</tr>';
      }
      var template = 
      '<div class="modal fade custom_modal" id="modalMulpiple" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
        '<div class="modal-dialog">'+
          '<div class="modal-content">'+
            '<div class="modal-header">'+
              '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>'+
              '<h4 class="modal-title" id="myModalLabel">'+this.default.data.title+'</h4>'+          
            '</div>'+
            '<div class="modal-body">'+
                '<form class="form-inline asearch_form mr10 mt10">'+
                  '<div class="form-group">'+
                    '<select class="form-control" id="mulpipleSelect">'+
                      options +
                    '</select>'+
                  '</div>'+           
                  '<div class="form-group">'+
                    '<input type="text" class="form-control" id="modalMulpipleSearchV" placeholder="角色名">'+
                  '</div>'+
                  '<button type="button" class="btn btn-primary" id="modalMulpipleSearch">搜索</button>'+
                '</form>'+             
              '<div class="bs-table-body table-responsive table-border h320 mt20">'+
                '<table class="table bs-table">'+
                  '<thead>'+
                    '<tr>'+
                      theadHtml+
                    '</tr>'+
                  '</thead>'+
                  '<tbody>'+
                      tbodyHtml+
                  '</tbody>'+
                '</table>'+
              '</div>'+
            '</div>'+
            '<div class="modal-footer form-button-group">'+
              '<p class="g9 tl fl">可选择多个角色</p>'+
              '<button type="button" class="btn btn-primary" id="modalMulpipleBtn">确定</button>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div> ';
      $('body').append(template);
      $('#modalMulpipleBtn').click(function(){
        _this.hide();
      })
      $('#modalMulpipleSearch').click(function(){
        _this.default.data.searchV = $('#modalMulpipleSearchV').val();
        _this.search();
      })
      $('#mulpipleSelect').change(function(){
        _this.default.data.changeV = $('#mulpipleSelect').val();
        _this.selectChange(_this.default.data.changeV);
      })
      return this;
    };
    //默认配置
    this.default = {
      el:'#modalMulpiple',
      data:{
        title:'选择角色',
        selectOptions:['所有部门','技术规划部'],
        thead:['选择','角色名','所属部门','说明描述'],
        tbody:[
          [null,'角色名称','技术规划部','说明描述文字，尽量不要太长，谢谢'],
          [null,'角色名称','技术规划部','说明描述文字，尽量不要太长，谢谢']
        ],
        callback:null,
        searchV:'',
        searchFn:null,
        changeV:'',
        selectChange:null
      }
    };
    //显示组件
    this.show = function(){
    $(this.default.el).modal('show');
    return this;
    };
    //隐藏组件
    this.hide = function(){
    $(this.default.el).modal('hide');
    this.default.data.callback && this.default.data.callback();
    return this;
    };
    //设置关闭回调
    this.setCloseCb = function(fn){
      this.default.data.callback = fn;
      return this;
    };
    //设置数据
    this.setData = function(data){
      $.extend(this.default.data,data);
      this.init();
      return this;
    };
    //设置搜索回调
    this.setSearch = function(fn){
      this.default.data.searchFn = fn;
      return this;
    };
    //搜索
    this.search = function(){
      this.default.data.searchFn(this.default.data.searchV);
      return this;
    };
    //下拉框改变
    this.selectChange = function(v){
      this.default.data.selectChange && this.default.data.selectChange(v);
      return this;
    };
    //下拉框改变
    this.setSelectChange = function(fn){
      this.default.data.selectChange = fn;
      return this;
    };
  }
  $._modalMulpiple = new ModalMulpiple();

  /**
   * 员工选择弹窗
   * 使用组件步奏：
   *            1 页面引入js
   *            2 使用 $._modalRadiosIcon.setData(params) 设置需要展示的数据
   *              2.1 参数为对象
   *              2.2 参数格式参照默认的参数定义
   *            3 使用 $._modalRadiosIcon.show()调出弹窗
   *            4 使用 $._modalRadiosIcon.setCloseCb(fn)传入关闭弹窗的回调
   *            5 使用 $._modalRadiosIcon.setSearch(fn)传入搜索的回调
   */

  function ModalRadiosIcon (){
    var _this = this;
    //组件初始化
    this.init = function(){
      if($('#modalRadiosIcon')){
        $('#modalRadiosIcon').remove();
      }
      var options = '',theadHtml = '',tbodyHtml = "";
      //遍历下拉框选项
      for(var oindex = 0; oindex < this.default.data.selectOptions.length; oindex ++){
        var item = this.default.data.selectOptions[oindex];
        options += '<option value="'+item+'" '+(oindex == 0? "selected":"")+'>'+ item +'</option>';
      }
      //遍历表格头
      var widthArr = ['width="10%"','width="50%"','width="15%"','width="25%"'];
      for(var hindex = 0; hindex < this.default.data.thead.length; hindex ++){
        var item = this.default.data.thead[hindex];
        theadHtml += '<th '+widthArr[hindex]+(hindex==0?'class="tc"':'')+'>'+item+'</th>'
      }
      //遍历表格内容
      for(var tindex = 0; tindex < this.default.data.tbody.length; tindex ++){
        var tr = '';
        var item  = this.default.data.tbody[tindex];
        for(var dindex = 0; dindex < item.length; dindex++){
          if(dindex == 0){
            tr += '<td '+widthArr[dindex]+' align="center" '+ (tindex == 0 ? 'checked':'')+'><input type="radio" data-name="'+item[1]+'" name="radio" checked></td>';
          }else if(dindex == 1){
            tr += '<td '+widthArr[dindex]+'><img src="'+this.default.data.icons.person+'" alt="图标" width="36"/><span class="ml30">'+item[dindex]+'</span></td>';
          }else{
            tr += '<td '+widthArr[dindex]+'>'+item[dindex]+'</td>';
          }
        }
        tbodyHtml += '<tr>'+ tr + '</tr>';
      }
      var template = 
        '<div class="modal fade custom_modal" id="modalRadiosIcon" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
          '<div class="modal-dialog">' +
            '<div class="modal-content">' +
              '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>' +
                '<h4 class="modal-title" id="myModalLabel">'+this.default.data.title+'</h4>' +
              '</div>' +
              '<div class="modal-body">' +
                '<div class="main_search clearfix">' +
                  '<h1 class="page_title2 fl">'+this.default.data.desc+'</h1>' +
                  '<form class="form-inline asearch_form fr">' +
                    '<div class="form-group">' +
                      '<input type="text" class="form-control" id="modalRadiosIconSearchV" placeholder="桶名称">' +
                    '</div>' +
                    '<button type="button" class="btn btn-primary" id="modalRadiosIconSearch">搜索</button>' +
                  '</form>' +
                '</div>' +
                '<div class="bs-table-container">' +
                  '<div class="bs-table-body table-responsive table-h320">' +
                    '<table class="table bs-table">' +
                      '<thead>' +
                        '<tr>' +
                          theadHtml +
                        '</tr>' +
                      '</thead>' +
                      '<tbody>' +
                          tbodyHtml +
                      '</tbody>' +
                    '</table>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="modal-footer form-button-group">' +
                '<p class="g9 tl fl">'+this.default.data.notice+'</p>' +
                '<button type="button" class="btn btn-primary" id="modalRadiosIconBtn">确定</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' 
      $('body').append(template);
      $('#modalRadiosIconBtn').click(function(){
        var radios = $('input:radio:checked');
        _this.default.data.searchNode.name = radios[0].dataset.name;
        _this.hide();
      })
      $('#modalRadiosIconSearch').click(function(){
        _this.default.data.searchV = $('#modalRadiosIconSearchV').val();
        _this.search();
      })
      return this;
    };
    //默认配置
    this.default = {
      el:'#modalRadiosIcon',
      data:{
        title:'文件共享',
        desc:'请选择需要共享的目标文件桶',
        notice:'文件共享后不会被移除，已设置权限的用户可查看并下载该文件。',
        selectOptions:['所有部门','技术规划部'],
        thead:['选择','桶名称','创建者','创建时间'],
        tbody:[
          [null,'桶名称','王小明','2018/6/20 18:30'],
          [null,'桶名称','王小明','2018/6/20 18:30']
        ],
        icons:{
          person:'../images/iconcards/icon_dxt36.png'
        },
        callback:null,
        searchV:'',
        searchFn:null,
        searchNode:{}
      }
    };
    //显示组件
    this.show = function(){
    $(this.default.el).modal('show');
    return this;
    };
    //隐藏组件
    this.hide = function(){
    $(this.default.el).modal('hide');
    this.default.data.callback && this.default.data.callback(this.default.data.searchNode);
    return this;
    };
    //设置关闭回调
    this.setCloseCb = function(fn){
      this.default.data.callback = fn;
      return this;
    };
    //设置数据
    this.setData = function(data){
      $.extend(this.default.data,data);
      this.init();
      return this;
    };
    //设置搜索回调
    this.setSearch = function(fn){
      this.default.data.searchFn = fn;
      return this;
    };
    //搜索
    this.search = function(){
      this.default.data.searchFn(this.default.data.searchV);
      return this;
    }
  }
  $._modalRadiosIcon = new ModalRadiosIcon();


}(jQuery || $));