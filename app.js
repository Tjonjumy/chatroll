var fjpStylesheet = "./style.css";

var _theIframe;

var _theToolbar;

var _fjpEditor;

var fjpEditorToolbarItems = new Array();

fjpEditorToolbarItems.push("hyperlink");

 

$( document ).ready(function() {

    var lstfjpEditor = $(".fjpEditor")

   

    for (var i = 0; i < lstfjpEditor.length; i++)

    {

        var thefjpEditor = lstfjpEditor[i];

       

        setTimeout("_fjpEditor = new fjpEditor('" + thefjpEditor.id + "')", 500 * (i));

    }

    //Clicked OK when error

    $(document).on("click","#btnAddURL", function () {

        event.preventDefault();

        if(navigator.onLine == false){

            messagebox("notificationBtn", "サーバーに接続出来ません。", "メッセージ", "error", false);

            return;

        }

        if($("#btnAddURL").is("[disabled]")){

            return;

        }

        showModalTextURL();

    });

});

 

function fjpEditorEnabled() {

    _fjpEditor.enabled();

    _fjpEditor.theToolbar.enabled()

   

    return true;

}

 

function fjpEditorDisabled() {

    _fjpEditor.disable();

    _fjpEditor.theToolbar.disable()

   

    return true;

}

 

function fjpEditorSetError(isError) {

    _fjpEditor.setError(isError);

}

 

function fjpEditorFocus(isError) {

    _fjpEditor.focus();

}

 

function fjpEditor(replacedTextareaID) {

    this.theTextarea = document.getElementById(replacedTextareaID);

    this.theContainer = document.createElement("div");

    this.theIframe = document.createElement("iframe");

    _theIframe = this.theIframe;

    this.theInput = document.createElement("input");

   

    this.theTextarea.style.visibility = "hidden";

    this.theContainer.id = this.theTextarea.id + "fjpEditorContainer";

    this.theContainer.className = "fjpEditorContainer";

   

    this.theIframe.id = this.theTextarea.id + "fjpEditorIframe";

    this.theIframe.className = "fjpEditorIframe";

   

    this.theInput.type = "hidden";

    this.theInput.id = this.theTextarea.id;

    this.theInput.name = this.theTextarea.name;

    this.theInput.disabled = this.theTextarea.disabled;

    this.theInput.value = this.theTextarea.value;

 

    this.theToolbar = new fjpEditorToolbar(this);

    _theToolbar = this.theToolbar;

    this.theContainer.appendChild(this.theIframe);

    this.theContainer.appendChild(this.theToolbar.theList);

    this.theContainer.appendChild(this.theInput);

    this.theContainer.style.visibility = "hidden";

 

    this.theInput.fjpEditorObject = this;

   

    this.theTextarea.parentNode.replaceChild(this.theContainer, this.theTextarea);

 

    /* Fill editor with old textarea content */

    this.writeDocument(this.theInput.value);

    /* Make editor editable */

    this.initEdit();

    //20200202 FPT)ThachLQ Add Start : Add tooltip button public info

    $('[data-toggle="tooltip"]').tooltip();

    //20200202 FPT)ThachLQ Add End

}

 

fjpEditor.prototype.focus = function(isError) {

    this.theIframe.contentWindow.document.body.focus();

}

 

fjpEditor.prototype.setError = function(isError) {

    if (isError) {

        this.theIframe.contentWindow.document.body.classList.add("error");

    } else {

        this.theIframe.contentWindow.document.body.classList.remove("error");

    }

 

    return true;

}

 

fjpEditor.prototype.enabled = function() {

    this.theIframe.contentWindow.document.body.setAttribute("contenteditable", "true");

    this.theIframe.contentWindow.document.body.classList.remove("disabled");

 

    return true;

}

 

fjpEditor.prototype.disable = function() {

    this.theIframe.contentWindow.document.body.setAttribute("contenteditable", "false");

    this.theIframe.contentWindow.document.body.classList.add("disabled");

 

    return true;

}

 

/* Write initial content to editor */

fjpEditor.prototype.writeDocument = function(documentContent)

{

    /* HTML template into which the HTML Editor content is inserted */

    var documentTemplate = '\

        <html>\

            <head>\

                INSERT:STYLESHEET:END\

            </head>\

            <body id="iframeBody" class="iframe-body">\

                INSERT:CONTENT:END\

            </body>\

        </html>\

    ';

   

    /* Insert dynamic variables/content into document */

    /* IE needs stylesheet to be written inline */

    if (typeof document.all != "undefined")

    {

        documentTemplate = documentTemplate.replace(/INSERT:STYLESHEET:END/, '<link rel="stylesheet" type="text/css" href="' + fjpStylesheet + '"></link>');

    }

    /* Firefox can't have stylesheet written inline */

    else

    {

        documentTemplate = documentTemplate.replace(/INSERT:STYLESHEET:END/, "");

    }

   

    documentTemplate = documentTemplate.replace(/INSERT:CONTENT:END/, documentContent);

   

    this.theIframe.contentWindow.document.open();

    this.theIframe.contentWindow.document.write(documentTemplate);

    this.theIframe.contentWindow.document.close();

 

    /* In Firefox stylesheet needs to be loaded separate to other HTML, because if it's loaded inline it causes Firefox to have problems with an empty document */

    if (typeof document.all == "undefined")

    {

        var stylesheet = this.theIframe.contentWindow.document.createElement("link");

        stylesheet.setAttribute("rel", "stylesheet");

        stylesheet.setAttribute("type", "text/css");

        stylesheet.setAttribute("href", fjpStylesheet);

        this.theIframe.contentWindow.document.getElementsByTagName("head")[0].appendChild(stylesheet);

    }

   

    return true;

}

 

/* Turn on document editing */

fjpEditor.prototype.initEdit = function()

{

    var self = this;

    try

    {

        if (self.theInput.disabled) {

            this.theIframe.contentWindow.document.body.setAttribute("contenteditable", "false");

            this.theIframe.contentWindow.document.body.classList.add("disabled");

        } else {

            this.theIframe.contentWindow.document.body.setAttribute("contenteditable", "true");

            this.theIframe.contentWindow.document.body.classList.remove("disabled");

        }

    }

    catch (e)

    {

        /* setTimeout needed to counteract Mozilla bug whereby you can't immediately change designMode on newly created iframes */

        setTimeout(function(){self.initEdit()}, 250);

           

        return false;

    }

   

    

    this.theContainer.style.visibility = "visible";

    this.theTextarea.style.visibility = "visible";

   

    this.theIframe.contentWindow.document.addEventListener("focusout", function(e){self.updateInput(e); return true;}, false);

    this.theIframe.contentWindow.document.addEventListener("focusin", function(e){self.focusin(e); return true;}, false);

    this.theIframe.contentWindow.document.addEventListener("paste", function(e){self.onpaste(e); return true;}, false);

    this.theIframe.contentWindow.document.addEventListener("input", function(e){self.oninput(e); return true;}, false);

    return true;   

}

fjpEditor.prototype.oninput = function() {

    fjpEditorFocusout();

}

fjpEditor.prototype.focusin = function() {

    fjpEditorFocusin();

}

 

fjpEditor.prototype.onpaste = function(e) {

    if (isIE()) {

        var dataPaste = window.clipboardData.getData('text')

    } else {

        var dataPaste = e.clipboardData.getData('text');

    }

    var nodeName = $.parseHTML(dataPaste)[0].nodeName;

    if (nodeName === "IFRAME") {

        insertFrame(_theIframe, dataPaste);

        e.preventDefault();

    }

}

function isIE() {

    if (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number

    {

        return true;

    }

    else  // If another browser, return 0

    {

        return false

    }

    return false;

}

 

/* Update hidden input to reflect editor contents, for submission */

fjpEditor.prototype.updateInput = function()

{

    /* Add target _blank to open tab new */

    var lstTabA = this.theIframe.contentWindow.document.getElementsByTagName("body")[0].getElementsByTagName("a");

    for (var i = 0; i < lstTabA.length; i++) {

        lstTabA[i].setAttribute('target', '_blank');

    }

    var theHTML = this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML;

   

    theHTML = theHTML.validTags();

   

    /* Remove leading and trailing whitespace */

    theHTML = theHTML.replace(/^\s+/, "");

    theHTML = theHTML.replace(/\s+$/, "");

   

    /* Remove style attribute inside any tag */

    theHTML = theHTML.replace(/ style="[^"]*"/g, "");

 

    /* Replace improper BRs */

    theHTML = theHTML.replace(/<br>/g, "<br />");

   

    /* Remove BRs right before the end of blocks */

    theHTML = theHTML.replace(/<br \/>\s*<\/(h1|h2|h3|h4|h5|h6|li|p)/g, "</$1");

   

    /* Replace improper IMGs */

    theHTML = theHTML.replace(/(<img [^>]+[^\/])>/g, "$1 />");

   

    /* Remove empty tags */

    /*theHTML = theHTML.replace(/(<[^\/]>|<[^\/][^>]*[^\/]>)\s*<\/[^>]*>/g, "");*/

   

    if (this.wysiwyg)

    {

        this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML = theHTML;

    }

    else

    {

        this.theTextarea.value = theHTML;

    }

   

    this.theInput.value = theHTML;

   

    $(this.theInput).trigger('change', this.theInput.value);

    fjpEditorFocusout();

    return true;

}

 

/* Toolbar items */

function fjpEditorToolbar(theEditor) {

    this.fjpEditorObject = theEditor;

   

    /* Create toolbar ul element */

    this.theList = document.createElement("div");

    this.theList.id = this.fjpEditorObject.theInput.id + "fjpEditorToolbar";

    this.theList.className = "fjpEditorToolbar mt-2 pr-0";

    this.theList.fjpEditorToolbarObject = this;

   

    /* Create toolbar items */

    for (var i = 0; i < fjpEditorToolbarItems.length; i++)

    {

        if (fjpEditorToolbarItems[i] === "hyperlink") {

            this.addButton(this.theList.id + "ButtonLink", "fa fa-link", "link", this.fjpEditorObject.theInput.disabled);

        }

    }

}

fjpEditorToolbar.prototype.enabled = function() {

    this.theList.getElementsByClassName("btnFjpEditor")[0].removeAttribute("disabled");

}

 

fjpEditorToolbar.prototype.disable = function() {

    this.theList.getElementsByClassName("btnFjpEditor")[0].setAttribute("disabled","true");

}

 

/* Add button to toolbar */

fjpEditorToolbar.prototype.addButton = function(theID, theClassIcon, theAction, theDisabled)

{

    var menuItem = document.createElement("div");

    var theLink = document.createElement("Button");

 

/*    var theIcon = document.createElement("i");*/

   

    menuItem.className = "fjpEditorButton col-lg-6 pl-0";

   

    theLink.className = "btn btn-default btn-text-primary image-bg  icon-link mr-2";

    theLink.action = theAction;

    theLink.id = theID;

    var spanAdd = document.createElement("span");

    spanAdd.innerText="リンク埋め込み";

    spanAdd.className="text-btn";

    theLink.appendChild(spanAdd);

    //theLink.onclick = fjpEditorToolbarAction;

    var theSpan = document.createElement("span");

    theSpan.onclick = fjpEditorToolbarAction;

    //20200202 FPT)ThachLQ Add Start : Add tooltip button public info

    theSpan.id = "spanBtnLinkFjp";

    theSpan.setAttribute("tabindex", "0");

    theSpan.setAttribute("data-toggle", "tooltip");

    theSpan.setAttribute("data-placement", "top");

    theSpan.setAttribute("title", "カーソル位置に添付ファイルのリンクを挿入（ファイル選択）");

    theSpan.classList.add("span-btn-fjpEditor");

    if (theDisabled || typeof  listFileAdd === "undefined" || listFileAdd.length < 1) {

        theLink.setAttribute("disabled", "true");

        theSpan.classList.add("span-dis");

    }

    theSpan.appendChild(theLink);

    //20200202 FPT)ThachLQ Add End

   

/*    theIcon.className = theClassIcon;*/

   

/*    theLink.appendChild(theIcon);*/

    menuItem.appendChild(theSpan);

    // Link button URL

    var theLinkURL = document.createElement("a");

/*    var theIconURL = document.createElement("i");*/

    theLinkURL.className = "btn btn-default btn-text-primary image-bg icon-external-link";

    theLinkURL.action = "link";

    theLinkURL.id = "btnAddURL";

    var spanURL = document.createElement("span");

    spanURL.innerText="URL貼付け";

    spanURL.className="text-btn";

    theLinkURL.appendChild(spanURL);

    //20200202 FPT)ThachLQ Add Start : Add tooltip button public info

    theLinkURL.setAttribute("data-toggle", "tooltip");

    theLinkURL.setAttribute("data-placement", "top");

    theLinkURL.setAttribute("title", "カーソル位置にハイパーリンクを挿入（URL貼付け）");

    theLinkURL.setAttribute("style", "font-weight: 600");

    //20200202 FPT)ThachLQ Add End

    if ($("#isExpiredDate").val() == "true") {

        theLinkURL.setAttribute("disabled", "true");

    }

/*    theIconURL.className = "fa fa-external-link";*/

/*    theLinkURL.appendChild(theIconURL);*/

    menuItem.appendChild(theLinkURL);

 

    this.theList.appendChild(menuItem);

 

}

 

/* Action taken when toolbar item activated */

function fjpEditorToolbarAction()

{

    event.preventDefault();

    if(navigator.onLine == false){

        messagebox("notificationBtn", "サーバーに接続出来ません。", "メッセージ", "error", false);

        return;

    }

    var theToolbar = this.parentNode.parentNode.fjpEditorToolbarObject;

    var theWidgEditor = theToolbar.fjpEditorObject;

    var theIframe = theWidgEditor.theIframe;

    if (this.className.indexOf('span-dis') == -1) {

        showFileSelect(listFileAdd, $("#inf-ctl-num").val(), theIframe);

    }

}

 

function showFileSelect(lstFile, i_inf_clt_num, theIframe) {

    htmlLinkFile = '';

    linkfile_inf_clt_num = i_inf_clt_num;

    _theIframe = theIframe;

    $('#modalInputFile').remove();

    var html = '';

    html += '<div id="modalInputFile" class="modal fade" role="dialog" data-backdrop="static">';

    html += '    <div class="modal-dialog">';

    html += '        <!-- Modal content-->';

    html += '        <div class="modal-content">';

    html += '           <div class="modal-header modal-header-info">';

    html += '            <div class="col-12 d-flex justify-content-center">';

    html += '                <h5 class="modal-title">リンクの挿入</h5>';

    html += '            </div>';

    html += '            <button type="button" class="close icon-times-white img-bg" data-dismiss="modal" aria-label="Close"></button>';

    html += '           </div>';

    html += '            <div class="modal-body">';

    html += '                <div class="lstFileSelect">';

 

    if (lstFile.length > 0) {

        html += '                    <table class="table table-striped table-bordered">';

        html += '                        <tbody>';

            for (var i = 0; i < lstFile.length; i++) {

                html += '                            <tr><td>' + lstFile[i].fileName + '</td></tr>';

            }

        html += '                        </tbody>';

        html += '                    </table>';

    }

    html += '                </div>';

    html += '                <div>';

    html += '                    <label for="uploadFileText" class="text-bold">リンクテキスト</label>';

    html += '                    <input type="text" class="form-control" name="uploadFileText" id="uploadFileText">';

    html += '                </div>';

    html += '            </div>';

    html += '            <div class="modal-footer">';

    html += '                <button type="button" class="btn btn-info image-bg icon-checked" id="btnSelectFile">';

    html += '                  <span class="text-btn">挿入</span>';

    html += '                </button>';

    html += '                 <button type="button" class="btn btn-default btn-text-info btn-border-info image-bg icon-times" data-dismiss="modal">';

    html += '                  <span class="text-btn">キャンセル</span>';

    html += '                </button>';

    html += '            </div>';

    html += '        </div>';

    html += '    </div>';

    html += '</div>';

    $('#content-fuji').append(html);

    $('#modalInputFile').modal('show');

    $('.icon-link').focusout();

}

 

$(document).on("click",".lstFileSelect tr",function() {

    $(".lstFileSelect tr").removeClass("selected");

    $(this).addClass("selected");

    $("#uploadFileText").val($(this).text());

    //http://localhost:8081/user/detail-estimate/download-estimate/3-FJPZ0000113-FJP69744200.txt/CTZ202003176697

    //http://localhost:8080/detail-estimate/download-estimate/IY20200318014/3-FJPZ0000124-FJP69744203.txt/CTZ202003186710

    var ctlNum = $('#ctlNum').text();

    if (ctlNum !== '') {

        ctlNum = "/" + ctlNum;

        htmlLinkFile = '/user/detail-estimate/download-estimate/' + $(this).text() + ctlNum;

    } else {

        htmlLinkFile = '/user/download-file/est-sp/' + linkfile_inf_clt_num + '/' + $(this).text();

    }

});

 

$(document).on("click","#btnSelectFile",function() {

    event.preventDefault();

    if(navigator.onLine == false){

        messagebox("notificationBtn", "サーバーに接続出来ません。", "メッセージ", "error", false);

        return;

    }

    $('#modalInputFile').modal('hide');

    if (htmlLinkFile !== '' && $("#uploadFileText").val() !== '') {

        doFileSelected(htmlLinkFile, $("#uploadFileText").val(), _theIframe);

    }

});

 

function doFileSelected(link, text, iframe) {

    var theIframe = iframe;

    var theSelection = null;

    var theRange = null;

    theIframe.focus();

 

    var theImageNode = theIframe.contentWindow.document.createElement("a");

   

    theImageNode.href = link;

    theImageNode.text = text;

   

    try

    {

        theSelection = theIframe.contentWindow.getSelection && theIframe.contentWindow.getSelection();

    }

    catch (e)

    {

        return false;

    }

    if (theSelection.rangeCount > 0) {

        theRange = theSelection.getRangeAt(0);

        theRange.collapse(false);

        theRange.insertNode(theImageNode);

       

    } else {

        theIframe.contentWindow.document.body.appendChild(theImageNode);

    }

    _fjpEditor.updateInput();

}

 

/* Make tags valid by converting uppercase element and attribute names to lowercase and quoting attributes */

String.prototype.validTags = function()

{

    var theString = this;

   

    /* Replace uppercase element names with lowercase */

    theString = theString.replace(/<[^> ]*/g, function(match){return match.toLowerCase();});

   

    /* Replace uppercase attribute names with lowercase */

/*    theString = theString.replace(/<[^>]*>/g, function(match)

        {

            match = match.replace(/ [^=]+=/g, function(match2){return match2.toLowerCase();});

 

            return match;

        });*/

           

    /* Put quotes around unquoted attributes */

    theString = theString.replace(/<[^>]*>/g, function(match)

        {

            match = match.replace(/( [^=]+=)([^"][^ >]*)/g, "$1\"$2\"");

           

            return match;

        });

       

    return theString;

}

 

function fjpEditorFocusin() {

     if ($('#box-infMemo-areafjpEditorContainer').hasClass('error')) {

        var position = $('#box-infMemo-areafjpEditorContainer').position();

        if (position == undefined) {

            return;

        }

    }

}

function fjpEditorFocusout() {

    var valueInfMemo = getValueInfMemo();

   

    if (valueInfMemo !== "") {

        fjpEditorSetError(false);

        $('#box-infMemo-areafjpEditorContainer').removeClass("error");

        $('.div-fjpEditor-wapper').removeClass("error");

        $('.fjpEditorToolbar').removeClass("error");

        $('#error-box-infMemo-area').hide();

    }

}

 

function validateInfMemo() {

    var valueInfMemo = getValueInfMemo();

    fjpEditorSetError(false);

    if (valueInfMemo === "") {

        fjpEditorSetError(true);

        $('.div-fjpEditor-wapper').addClass("error");

        $('#box-infMemo-areafjpEditorContainer').addClass("error");

        $('.fjpEditorToolbar').addClass("error");

        $('#error-box-infMemo-area').show();

        return false;

    }

    return true;

}

 

function getValueInfMemo() {

    var valueInfMemo = $('#box-infMemo-area').val();

    valueInfMemo = valueInfMemo.replace(/&nbsp;/g, '');

    return valueInfMemo.trim();

}

function insertFrame(iframe,dataFrame) {

    var html = $.parseHTML(dataFrame)

    var theIframe = iframe;

    var theSelection = null;

    var theRange = null;

    theIframe.focus();

 

    var theImageNode = theIframe.contentWindow.document.createElement("iframe");

    theImageNode.name = html[0].name;

    theImageNode.src = html[0].src;

    theImageNode.setAttribute("frameborder", "0");

    theImageNode.setAttribute("allowfullscreen", "");

    theImageNode.setAttribute("webkitallowfullscreen", "webkitallowfullscreen");

    theImageNode.setAttribute("mozallowfullscreen", "mozallowfullscreen");

    theImageNode.setAttribute("allow", "fullscreen");

 

    try

    {

        theSelection = theIframe.contentWindow.getSelection && theIframe.contentWindow.getSelection();

    }

    catch (e)

    {

        return false;

    }

    if (theSelection.rangeCount > 0) {

        theRange = theSelection.getRangeAt(0);

        theRange.collapse(false);

        theRange.insertNode(theImageNode);

       

    } else {

        theIframe.contentWindow.document.body.appendChild(theImageNode);

    }

    _fjpEditor.updateInput();

}

function showModalTextURL() {

    $('#modalURL').remove();

    var html = '';

    html += '<div id="modalURL" class="modal fade modalURL" role="dialog" data-backdrop="static" data-keyboard="false" aria-modal="true">';

    html += '    <div class="modal-dialog" role="document">';

    html += '        <!-- Modal content-->';

    html += '        <div class="modal-content">';

    html += '           <div class="modal-header modal-header-info">';

    html += '            <div class="col-12 d-flex justify-content-center">';

    html += '                <h5 class="modal-title">リンクの挿入</h5>';

    html += '            </div>';

    html += '            <button type="button" class="close icon-times-white img-bg" data-dismiss="modal" aria-label="Close"></button>';

    html += '           </div>';

    html += '            <div class="modal-body">';

    html += '                <div id="div-txtInsertUrl">';

    html += '                    <label for="uploadFileText" class="text-bold">URL</label>';

    html += '                    <input type="text" class="form-control check-error" id="txtInsertUrl" oninput="checkURL()">';

    html += '                    <span class="error error-msg error-order" id="error-txtInsertUrl">';

    html += '                        <i class="glyphicon glyphicon-triangle-bottom icon-t" ></i>';

    html += '                        <span class="error-msg-pos text-red" id="msg-txtInsertUrl"></span>';

    html += '                    </span>';

    html += '                </div>';

    html += '            </div>';

    html += '            <div class="modal-footer">';

    html += '                <button type="button" class="btn btn-info image-bg icon-checked" id="btnInsertURL">';

    html += '                  <span class="text-btn"></span>挿入';

    html += '                </button>';

    html += '                 <button type="button" class="btn btn-default btn-text-info btn-border-info image-bg icon-times" data-dismiss="modal">';

    html += '                  <span class="text-btn"></span>キャンセル';

    html += '                </button>';

    html += '            </div>';

    html += '        </div>';

    html += '        </div>';

    html += '    </div>';

    html += '</div>';

    $('#content-fuji').append(html);

    $('#modalURL').modal('show');

    $('#btnAddURL').focusout();

}

$(document).on("click","#btnInsertURL",function() {

    event.preventDefault();

    if(navigator.onLine == false){

        messagebox("notificationBtn", "サーバーに接続出来ません。", "メッセージ", "error", false);

        return;

    }

    if ($("#txtInsertUrl").val() !== '') {

        if ($("#txtInsertUrl").hasClass('hasError')) {

            $("#txtInsertUrl").focus();

            return;

        }

        insertURL($("#txtInsertUrl").val(), _theIframe);

    }

    $('#modalURL').modal('hide');

});

function checkURL() {

    if ($("#txtInsertUrl").val() !== '') {

        $("#txtInsertUrl").val($("#txtInsertUrl").val().trim().replace(/\s/g,''));

        if (!isValidURL($("#txtInsertUrl").val())) {

             $("#txtInsertUrl").addClass('hasError');

             $("#error-txtInsertUrl").show();

             $("#msg-txtInsertUrl").html("URL無効です。");

        } else {

            $("#txtInsertUrl").removeClass('hasError');

            $("#error-txtInsertUrl").hide();

            $("#msg-txtInsertUrl").html("");

        }

    } else {

        $("#txtInsertUrl").removeClass('hasError');

            $("#error-txtInsertUrl").hide();

            $("#msg-txtInsertUrl").html("");

    }

}

function isValidURL(url) {

    var url = url.trim().replace(/\s/g,'');

    var regexp = /(ftp|http|https):\/\/\/?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

    if (regexp.test(url))

    {

      return true;

    }

    else

    {

      return false;

    }

}

function insertURL(textURL,iframe) {

    var theIframe = iframe;

    var theSelection = null;

    var theRange = null;

    theIframe.focus();

    var theImageNode = theIframe.contentWindow.document.createElement("a");

    theImageNode.href = textURL.trim().replace(/\s/g,'');

    theImageNode.text = textURL.trim().replace(/\s/g,'');

    try

    {

        theSelection = theIframe.contentWindow.getSelection && theIframe.contentWindow.getSelection();

    }

    catch (e)

    {

        return false;

    }

    if (theSelection.rangeCount > 0) {

        theRange = theSelection.getRangeAt(0);

        theRange.collapse(false);

        theRange.insertNode(theImageNode);

       

    } else {

        theIframe.contentWindow.document.body.appendChild(theImageNode);

    }

    _fjpEditor.updateInput();

}
