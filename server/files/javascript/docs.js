
// namespace
window.semantic = {
  handler: {}
};

// Allow for console.log to not break IE
if (typeof window.console == "undefined" || typeof window.console.log == "undefined") {
  window.console = {
    log  : function() {},
    info : function(){},
    warn : function(){}
  };
}
if(typeof window.console.group == 'undefined' || typeof window.console.groupEnd == 'undefined' || typeof window.console.groupCollapsed == 'undefined') {
  window.console.group = function(){};
  window.console.groupEnd = function(){};
  window.console.groupCollapsed = function(){};
}
if(typeof window.console.markTimeline == 'undefined') {
  window.console.markTimeline = function(){};
}
window.console.clear = function(){};

// ready event
semantic.ready = function() {

  // selector cache
  var
    $document            = $(document),
    $sortableTables      = $('.sortable.table'),
    $sticky              = $('.ui.sticky'),

    $themeDropdown       = $('.theme.dropdown'),

    $ui                  = $('.ui').not('.hover, .down'),
    $swap                = $('.theme.menu .item'),
    $menu                = $('#toc'),
    $hideMenu            = $('#toc .hide.item'),
    $search              = $('#search'),
    $sortTable           = $('.sortable.table'),
    $demo                = $('.demo'),

    $container           = $('.main.container'),
    $allHeaders          = $('.main.container > h2, .main.container > .tab > h2, .main.container > .tab > .examples h2'),
    $sectionHeaders      = $container.children('h2'),
    $followMenu          = $container.find('.following.menu'),
    $sectionExample      = $container.find('.example'),
    $exampleHeaders      = $sectionExample.children('h4'),
    $footer              = $('.page > .footer'),

    $menuMusic           = $('.ui.main.menu .music.item'),
    $menuPopup           = $('.ui.main.menu .popup.item'),
    $pageDropdown        = $('.ui.main.menu .page.dropdown'),
    $pageTabMenu         = $('.masthead.tab.segment .tabular.menu'),
    $pageTabs            = $('.masthead.tab.segment .menu .item'),

    $languageDropdown    = $('.language.dropdown'),
    $chineseModal        = $('.chinese.modal'),
    $languageModal       = $('.language.modal'),

    $downloadPopup       = $('.download.button'),
    $downloads           = $('.download.popup'),
    $downloadFramework   = $('.framework.column .button'),
    $downloadInput       = $('.download.popup input'),
    $downloadStandalone  = $('.standalone.column .button'),

    $helpPopup           = $('.header .help'),

    $example             = $('.example'),
    $shownExample        = $example.filter('.shown'),

    $overview            = $('.masthead.segment .overview'),
    //$developer         = $('.header .developer.item'),
    //$designer          = $('.header .designer.item'),

    $sidebarButton       = $('.fixed.launch.button'),
    $code                = $('div.code').not('.existing'),
    $existingCode        = $('.existing.code'),

    languageDropdownUsed = false,


    requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function(callback) { setTimeout(callback, 0); },

    // alias
    handler
  ;


  // event handlers
  handler = {

    createIcon: function() {
      $example
        .each(function(){
          var
            $insertPoint = $(this).is('.another')
              ? $(this).children().eq(0)
              : $(this).children().eq(1)
          ;
          $('<i/>')
            .addClass('icon code')
            .insertBefore( $insertPoint )
          ;
        })
      ;
    },

    search: {
      focus: function() {
        $(this).val('');
        $(this).closest('.search').removeClass('hidden');
        $(this).closest('.menu').addClass('searching');
        handler.loadSearch();
      },
      blur: function() {
        $(this).closest('.search').addClass('hidden');
        $(this).closest('.menu').removeClass('searching');
      }
    },

    shortcut: {
      search: function() {
        $('#search').find('input').focus();
      },
      modal: function() {
        var
          $modal = $('#shortcuts'),
          shortcutModalExists,
          shortcut,
          index
        ;
        if(!shortcutModalExists) {
          var
            html = '<div class="ui small modal" id="shortcuts">'
          ;
          html += '<div class="header">Keyboard Shortcuts</div>';
          html += '<div class="content">';
          html += '<table class="ui striped basic table">';
          for (index = 0; index < shortcuts.length; index++) {
            shortcut = shortcuts[index];
            html     += '<tr><td><b>' + shortcut.aka + '</b></td><td>' + shortcut.description + '</td></tr>';
          }
          html += '</table>';
          html += '<div class="actions"><div class="ui small teal button">OK</div></div>';
          html += '</div></div>';
          $('body').append(html);
          $modal = $('#shortcuts');
        }
        $('#shortcuts').modal('show');
      }
    },

    createWaypoints: function() {
      $sectionHeaders
        .visibility({
          observeChanges: false,
          once: false,
          offset: 30,
          onTopVisible: handler.activate.accordion,
          onTopPassed: handler.activate.section,
          onBottomPassed: handler.activate.section,
          onTopPassedReverse: handler.activate.previous
        })
      ;

      $sectionExample
        .visibility({
          observeChanges: false,
          once: false,
          offset: 30,
          onTopPassed: handler.activate.example,
          onBottomPassedReverse: handler.activate.example
        })
      ;
      $footer
        .visibility({
          observeChanges: false,
          once: false,
          onBottomVisible: function(calculations) {
            var
              $title = $followMenu.find('> .item > .title').last()
            ;
            $followMenu
              .accordion('open', $title)
            ;
          }
        })
      ;
    },

    activate: {
      previous: function() {
        var
          $menuItems  = $followMenu.children('.item'),
          $section    = $menuItems.filter('.active'),
          index       = $menuItems.index($section)
        ;
        if($section.prev().size() > 0) {
          $section
            .removeClass('active')
            .prev('.item')
            .addClass('active')
          ;
          $followMenu
            .accordion('open', index - 1)
          ;
        }
      },
      accordion: function() {
        var
          $section       = $(this),
          index          = $sectionHeaders.index($section),
          $followSection = $followMenu.children('.item'),
          $activeSection = $followSection.eq(index)
        ;
        $followMenu
          .accordion('open', index)
        ;
      },
      section: function() {
        var
          $section       = $(this),
          index          = $sectionHeaders.index($section),
          $followSection = $followMenu.children('.item'),
          $activeSection = $followSection.eq(index),
          isActive       = $activeSection.hasClass('active')
        ;
        if(!isActive) {
          $followSection
            .removeClass('active')
          ;
          $activeSection
            .addClass('active')
          ;
        }
      },
      example: function() {
        var
          $section       = $(this).children('h4').eq(0),
          index          = $exampleHeaders.index($section),
          $followSection = $followMenu.find('.menu > .item'),
          $activeSection = $followSection.eq(index),
          inClosedTab    = ($(this).closest('.tab:not(.active)').size() > 0),
          anotherExample = ($(this).filter('.another.example').size() > 0),
          isActive       = $activeSection.hasClass('active')
        ;
        if(!inClosedTab && !anotherExample && !isActive) {
          $followSection
            .removeClass('active')
          ;
          $activeSection
            .addClass('active')
          ;
        }
      }
    },

    translatePage: function(languageCode, text, $choice) {
      languageDropdownUsed = true;
      if(window.Transifex !== undefined) {
        window.Transifex.live.translateTo(languageCode, true);
      }
    },

    showLanguageModal: function(languageCode) {
      var
        $choice = $languageDropdown.find('[data-value="' + languageCode + '"]').eq(0),
        percent = $choice.data('percent') || 0,
        text    = $choice.text()
      ;
      // dont trigger on translate event every page load
      if(languageDropdownUsed) {
        if(languageCode == 'zh' && window.location.host.replace('www.','') !== 'semantic-ui.cn') {
          $chineseModal
            .modal({
              closable: false
            })
            .modal('show')
          ;
        }
        else if(percent < 100) {
          languageDropdownUsed = false;
          $languageModal
            .modal()
            .find('.header .name')
              .html(text)
              .end()
            .find('.complete')
              .html(percent)
              .end()
          ;
          $languageModal
            .modal('show', function() {
              $('.language.modal .progress .bar').css('width', percent + '%');
            })
          ;
        }
      }
    },

    loadSearch: function() {
      if( !$search.hasClass('loaded') ) {
        $search.addClass('loading');
        $.getJSON('/metadata.json')
          .always(function() {
            $search.removeClass('loading');
          })
          .fail(function(err) {
            console.log('Failed to load search metadata');
          })
          .done(function(data) {
            $search
              .addClass('loaded')
              .search({
                transition     : 'slide down',
                searchFullText : false,
                source         : data,
                searchFields   : [ 'title', 'category'],
                onSelect       : function(results, response) {
                  window.location = '/' + results.filename;
                }
              })
            ;
          })
        ;
      }
    },

    tryCreateMenu: function(event) {
      if($(window).width() > 640 && !$('body').hasClass('basic')) {
        if($container.size() > 0 && $container.find('.following.menu').size() === 0) {
          handler.createMenu();
          handler.createWaypoints();
          $(window).off('resize.menu');
        }
      }
    },

    createAnchors: function() {
      $allHeaders
        .each(function() {
          var
            $section = $(this),
            text     = handler.getText($section),
            safeName = handler.getSafeName(text),
            id       = window.escape(safeName),
            $anchor  = $('<a />').addClass('anchor').attr('id', id)
          ;
          $section
            .append($anchor)
          ;
        })
      ;
      $example
        .each(function() {
          var
            $title   = $(this).children('h4').eq(0),
            text     = handler.getText($title),
            safeName = handler.getSafeName(text),
            id       = window.escape(safeName),
            $anchor  = $('<a />').addClass('anchor').attr('id', id)
          ;
          if($title.size() > 0) {
            $title.after($anchor);
          }
        })
      ;

    },

    getSafeName: function(text) {
      return text.replace(/\s+/g, '-').replace(/[^-,'A-Za-z0-9]+/g, '').toLowerCase();
    },

    getText: function($element) {
      $element = ($element.find('a').not('.label').length > 0)
        ? $element.find('a')
        : $element
      ;
      var
        $text = $element.contents().filter(function(){
          return this.nodeType == 3;
        })
      ;
      return ($text.length > 0)
        ? $text[0].nodeValue.trim()
        : $element.find('a').text().trim()
      ;
    },

    createMenu: function() {
      // grab each h3
      var
        html = '',
        $sticky,
        $rail
      ;
      $sectionHeaders
        .each(function(index) {
          var
            $currentHeader = $(this),
            $nextElements  = $currentHeader.nextUntil('h2'),
            $examples      = $nextElements.find('.example:not(.another)').andSelf().filter('.example:not(.another)'),
            activeClass    = (index === 0)
              ? 'active '
              : '',
            text     = handler.getText($currentHeader),
            safeName = handler.getSafeName(text),
            id       = window.escape(safeName),
            $anchor  = $('<a />').addClass('anchor').attr('id', id)
          ;
          html += '<div class="item">';
          if($examples.size() === 0) {
            html += '<a class="'+activeClass+'title" href="#'+id+'"><b>' + $(this).text() + '</b></a>';
          }
          else {
            html += '<a class="'+activeClass+'title"><i class="dropdown icon"></i> <b>' + $(this).text() + '</b></a>';
          }
          if($examples.size() > 0) {
            html += '<div class="'+activeClass+'content menu">';
            $examples
              .each(function() {
                var
                  $title   = $(this).children('h4').eq(0),
                  text     = handler.getText($title),
                  safeName = handler.getSafeName(text),
                  id       = window.escape(safeName),
                  $anchor  = $('<a />').addClass('anchor').attr('id', id)
                ;
                if($title.size() > 0) {
                  html += '<a class="item" href="#'+id+'">' + text + '</a>';
                }
              })
            ;
            html += '</div>';
          }
          html += '</div>';
        })
      ;
      $followMenu = $('<div />')
        .addClass('ui vertical secondary following fluid accordion menu')
        .html(html)
      ;
      $sticky = $('<div />')
        .addClass('ui sticky')
        .html($followMenu)
      ;
      $rail = $('<div />')
        .addClass('ui right rail')
        .html($sticky)
        .prependTo($container)
      ;
      $sticky.sticky({
        context: $container,
        offset: 30
      });
      $followMenu
        .accordion({
          exclusive: false,
          onChange: function() {
            $sticky.sticky('refresh');
          }
        })
        .find('.menu a[href], .title[href]')
          .on('click', handler.scrollTo)
      ;
    },

    scrollTo: function(event) {
      var
        id       = $(this).attr('href').replace('#', ''),
        $element = $('#'+id),
        position = $element.offset().top
      ;
      $element
        .addClass('active')
      ;
      $('html, body')
        .animate({
          scrollTop: position
        }, 500)
      ;
      location.hash = '#' + id;
      event.stopImmediatePropagation();
      event.preventDefault();
      return false;
    },

    less: {

      parseFile: function(content) {
        var
          variables = {},
          lines = content.match(/^(@[\s|\S]+?;)/gm),
          name,
          value
        ;
        if(lines) {
          $.each(lines, function(index, line) {
            // clear whitespace
            line = $.trim(line);
            // match variables only
            if(line[0] == '@') {
              name = line.match(/^@(.+?):/);
              value = line.match(/:\s*([\s|\S]+?;)/);
              if( ($.isArray(name) && name.length >= 2) && ($.isArray(value) && value.length >= 2) ) {
                name = name[1];
                value = value[1];
                variables[name] = value;
              }
            }
          });
        }
        console.log(variables);
        return variables;
      },

      changeTheme: function(theme) {
        var
          $themeDropdown = $(this),
          variableURL = '/src/themes/{$theme}/{$type}s/{$element}.variables',
          overrideURL = '/src/themes/{$theme}/{$type}s/{$element}.overrides',
          urlData     = {
            theme   : typeof(theme === 'string')
              ? theme.toLowerCase()
              : theme,
            type    : $themeDropdown.data('type'),
            element : $themeDropdown.data('element')
          }
        ;
        $themeDropdown
          .api({
            on       : 'now',
            debug    : true,
            url      : variableURL,
            dataType : 'text',
            urlData  : urlData,
            onSuccess: function(content) {
              window.less.modifyVars( handler.less.parseFile(content) );
              $themeDropdown
                .api({
                  on       : 'now',
                  url      : overrideURL,
                  dataType : 'text',
                  urlData  : urlData,
                  onSuccess: function(content) {
                    if( $('style.override').size() > 0 ) {
                      $('style.override').remove();
                    }
                    console.log(content);
                    $('<style>' + content + '</style>')
                      .addClass('override')
                      .appendTo('body')
                    ;
                    $('.sticky').sticky('refresh');
                  }
                })
              ;
            }
          })
        ;
      }

    },

    create: {
      examples: function(json) {
        var
          types      = json['Types'],
          text       = json['Text'],
          states     = json['States'],
          variations = json['Variations'],

          $element,
          html
        ;
        $.each(types, function(name, type){
          html += '<h2 class="ui dividing header">' + name + '</h2';
          if($.isPlainObject(type)) {
            $.each(type, function(name, subType) {
              $element = $.zc(subType);
              $element = handler.create.text($element, text);
              html += '<h3 class="ui header">' + name + '</h3';
              html += handler.create.variations($element, variations);
            });
          }
          else {
            $element = $.zc(type);
            $element = handler.create.text($element);
            html += handler.create.variations($element, variations);
          }
        });
        // Each TYPE
        //   show type name
        //   html = koan (html)
        //   each text
        //     find label
        //     if(obj)
        //       replace random text
        //     else
        //       replace text
        //   end
        //   Each variation
        //     (if obj)
        //       each
        //         add class
        //     (else)
        //       add class
        //     label = property
        //     class = class
        //     show html
        //   end
        // end
      },
      element: function(koan, type, text, variation) {

      },
      variations: function($element, variations) {
        $.each(variations, function(name, variation){

        });
      },
      text: function($element, text) {
        $.each(text, function(selector, text) {
          $element.find(selector).text(text);
        });
        return $element;
      }
    },
    changeMode: function(value) {
      if(value == 'overview') {
        handler.showOverview();
      }
      else {
        handler.hideOverview();
        if(value == 'design') {
          handler.designerMode();
        }
        if(value == 'code') {
          handler.developerMode();
        }
      }
      $sectionHeaders.visibility('refresh');
      $sectionExample.visibility('refresh');
      $footer.visibility('refresh');
    },
    showOverview: function() {
      var
        $body    = $('body'),
        $example = $('.example')
      ;
      $body.addClass('overview');
      $example.each(function() {
        $(this).children().not('.ui.header:eq(0), .example p:eq(0)').hide();
      });
      $example.filter('.another').css('display', 'none');
      $('.sticky').sticky('refresh');
    },
    hideOverview:  function() {
      var
        $body    = $('body'),
        $example = $('.example')
      ;
      $body.removeClass('overview');
      $example.each(function() {
        $(this).children().not('.ui.header:eq(0), .example p:eq(0)').css('display', '');
      });
      $example.filter('.another').removeAttr('style');
      $('.sticky').sticky('refresh');
    },
    developerMode: function() {
      var
        $body    = $('body'),
        $example = $('.example').not('.no')
      ;
      $example
        .each(function() {
          $.proxy(handler.createCode, $(this))('developer');
        })
      ;
      $('.sticky').sticky('refresh');
    },
    designerMode: function() {
      var
        $body    = $('body'),
        $example = $('.example').not('.no')
      ;
      $example
        .each(function() {
          $.proxy(handler.createCode, $(this))('designer');
        })
      ;
      $('.sticky').sticky('refresh');
    },

    openMusic: function() {
      var
        url       = 'http://www.stratus.sc/player?links=https://soundcloud.com/into-the-light/sets/sui&popup=true',
        newWindow = window.open(url,'name','height=196,width=733')
      ;
      if(window.focus) {
        newWindow.focus();
      }
    },

    getIndent: function(text) {
      var
        lines           = text.split("\n"),
        firstLine       = (lines[0] === '')
          ? lines[1]
          : lines[0],
        spacesPerIndent = 2,
        leadingSpaces   = (firstLine !== undefined)
          ? firstLine.length - firstLine.replace(/^\s*/g, '').length
          : false,
        indent
      ;
      if(!leadingSpaces) {
        return 4;
      }
      if(leadingSpaces !== 0) {
        indent = leadingSpaces;
      }
      else {
        // string has already been trimmed, get first indented line and subtract 2
        $.each(lines, function(index, line) {
          leadingSpaces = line.length - line.replace(/^\s*/g, '').length;
          if(leadingSpaces !== 0) {
            indent = leadingSpaces - spacesPerIndent;
            return false;
          }
        });
      }
      return indent || 4;
    },

    generateCode: function() {
      var
        $example    = $(this).closest('.example'),
        $annotation = $example.find('.annotation'),
        $code       = $annotation.find('.code'),
        $header     = $example.not('.another').children('.ui.header:first-of-type').eq(0).add('p:first-of-type'),
        $ignored    = $('i.code:last-child, .wireframe, .anchor, .code, .existing, .pointing.below.label, .instructive, .language.label, .annotation, br, .ignore, .ignored'),
        $demo       = $example.children().not($header).not($ignored),
        code        = ''
      ;
      if( $code.size() === 0) {
        $demo
          .each(function() {
            var
              $this = $(this).clone(false),
              $wireframe = $this.find('.wireframe').add($this.filter('.wireframe'))
            ;
            $wireframe
              .each(function() {
                var
                  src = $(this).attr('src'),
                  image = (src.search('image') !== -1),
                  paragraph = (src.search('paragraph') !== -1)
                ;
                if(paragraph) {
                  $(this).replaceWith('<p></p>');
                }
                else if(image) {
                  $(this).replaceWith('<img>');
                }
              })
            ;

            // remove wireframe images
            $this.find('.wireframe').remove();

            if($this.not('br').not('.wireframe')) {
              // allow inline styles only with this one class
              if($this.is('.my-container')) {
                code += $this.get(0).outerHTML + "\n";
              }
              else {
                code += $this.removeAttr('style').get(0).outerHTML + "\n";
              }
            }
          })
        ;
      }
      $example.data('code', code);
      return code;
    },
    createCode: function(type) {
      var
        $example        = $(this).closest('.example'),
        $header         = $example.not('.another').children('.ui.header:first-of-type').eq(0).add('p:first-of-type'),
        $annotation     = $example.find('.annotation'),
        $code           = $annotation.find('.code'),
        $html           = $example.children('.html'),
        $ignoredContent = $('.ui.popup, i.code:last-child, .anchor, .code, .existing.segment, .instructive, .language.label, .annotation, br, .ignore, style, script, .ignored'),
        $demo           = $example.children().not($header).not($ignoredContent),
        code            = $example.data('code') || $.proxy(handler.generateCode, this)(),
        $label
      ;

      // process existing code first
      if( $code.hasClass('existing') ) {
        $code.removeClass('existing');
        $.proxy(handler.initializeCode, $code)(true);
      }

      // create annotation wrapper
      if($annotation.size() === 0) {
        $annotation = $('<div/>')
          .addClass('annotation')
          .hide()
          .appendTo($example)
        ;
      }

      if($html.size() === 0) {
        $html = $('<div class="html">').insertBefore($annotation);
        $label = $('<div class="ui top attached label">').html('Example');
        $label.prependTo($html);
        $demo
          .detach()
          .prependTo($html)
        ;
      }

      // create code inside annotation wrapper
      if( $example.find('.instructive').size() === 0) {
        $code = $('<div/>')
          .data('type', 'html')
          .addClass('code')
          .html(code)
          .hide()
          .appendTo($annotation)
        ;
        $.proxy(handler.initializeCode, $code)(true);
      }
      if( ($annotation.eq(0).is(':visible') || type == 'designer') && type != 'developer' ) {
        $annotation.transition('hide');
        $html.removeClass('ui top attached segment');
      }
      else {
        $html.addClass('ui top attached segment');
        $header.css('display', '');
        $annotation.transition('fade');
      }
      // content position changed
      if(type === undefined) {
        $sectionHeaders.visibility('refresh');
        $sectionExample.visibility('refresh');
        $footer.visibility('refresh');
      }
    },

    createAnnotation: function() {
      if(!$(this).data('type')) {
        $(this).data('type', 'html');
      }
      $(this)
        .wrap('<div class="annotation">')
        .parent()
        .hide()
      ;
    },

    makeCode: function() {
      if(window.hljs !== undefined) {
        $code
          .filter(':visible')
          .each(handler.initializeCode)
        ;
        $existingCode
          .each(handler.createAnnotation)
        ;
      }
      else {
        console.log('Syntax highlighting not found');
      }
    },

    initializeCode: function(codeSample) {
      var
        $code        = $(this).show(),
        $codeTag     = $('<code></code>'),
        codeSample   = codeSample || false,
        code         = $code.html(),
        existingCode = $code.hasClass('existing'),
        evaluatedCode = $code.hasClass('evaluated'),
        contentType  = $code.data('type')     || 'html',
        title        = $code.data('title')    || false,
        demo         = $code.data('demo')     || false,
        preview      = $code.data('preview')  || false,
        label        = $code.data('label')    || false,
        preserve     = $code.data('preserve') || false,
        displayType  = {
          html       : 'HTML',
          javascript : 'Javascript',
          css        : 'CSS',
          text       : 'Command Line',
          sh         : 'Command Line'
        },
        padding    = 20,
        name = (codeSample === true)
          ? 'instructive bottom attached'
          : 'existing',
        formattedCode = code,
        whiteSpace,
        indent,
        styledCode,
        $label,
        codeHeight
      ;
      var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
      };

      contentType = contentType.toLowerCase();

      function escapeHTML(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
          return entityMap[s];
        });
      }

      // evaluate if specified
      if(evaluatedCode) {
        eval(code);
      }

      // should trim whitespace
      if(preserve) {
        formattedCode = code;
      }
      else {
        indent        = handler.getIndent(code) || 2;
        whiteSpace    = new RegExp('\\n\\s{' + indent + '}', 'g');
        formattedCode = $.trim(code).replace(whiteSpace, '\n');
      }

      if(contentType != 'javascript' && contentType != 'less') {
        formattedCode = escapeHTML(formattedCode);
      }

      // replace with <code>
      $codeTag
        .addClass($code.attr('class'))
        .html(formattedCode)
      ;

      $code
        .replaceWith($codeTag)
      ;
      $code = $codeTag;

      $code
        .html(formattedCode)
      ;

      // wrap
      $code = $code
        .wrap('<div class="ui ' + name + ' segment"></div>')
        .wrap('<pre></pre>')
      ;

      // color code
      window.hljs.highlightBlock($code[0]);


      // add label
      if(title) {
        $('<div>')
          .addClass('ui attached top label')
          .html('<span class="title">' + title + '</span>' + '<em>' + (displayType[contentType] || contentType) + '</em>')
          .prependTo( $code.closest('.segment') )
        ;
      }
      if(label) {
        $('<div>')
          .addClass('ui pointing below language label')
          .html(displayType[contentType] || contentType)
          .insertBefore ( $code.closest('.segment') )
        ;
      }
      // add run code button
      if(demo) {
        $('<a>')
          .addClass('ui pointing below label')
          .html('Run Code')
          .on('click', function() {
            eval(code);
          })
          .insertBefore ( $code.closest('.segment') )
        ;
      }
      // add preview if specified
      if(preview) {
        $(code)
          .insertAfter( $code.closest('.segment') )
        ;
      }

      $code.removeClass('hidden');

    },

    resetDownloads: function() {
      $downloads
        .find('.grid')
        .hide()
        .filter('.choice.grid')
          .show()
      ;
    },

    selectAll: function () {
      this.setSelectionRange(0, this.value.length);
    },

    chooseStandalone: function() {
      $downloads
        .find('.grid')
        .hide()
        .filter('.standalone.grid')
          .show()
      ;
      $downloadPopup.popup('reposition');
    },

    chooseFramework: function() {
      $downloads
        .find('.grid')
        .hide()
        .filter('.framework.grid')
          .show()
      ;
      $downloadPopup.popup('reposition');
    },

    swapStyle: function() {
      var
        theme = $(this).data('theme')
      ;
      $(this)
        .addClass('active')
        .siblings()
          .removeClass('active')
      ;
      $('head link.ui')
        .each(function() {
          var
            href         = $(this).attr('href'),
            subDirectory = href.split('/')[3],
            newLink      = href.replace(subDirectory, theme)
          ;
          $(this)
            .attr('href', newLink)
          ;
        })
      ;
    }
  };

  semantic.handler = handler;

  // add anchors to docs headers
  handler.createAnchors();

  // register less files
  window.less.registerStylesheets();

  // load page tabs
  if( $pageTabs.size() > 0 ) {
    $pageTabs
      .tab({
        context      : '.main.container',
        childrenOnly : true,
        history      : true,
        onTabInit    : function() {
          handler.makeCode();

          $container = ($('.fixed.column').size() > 0 )
            ? $(this).find('.examples')
            : $(this)
          ;
          $(this).find('> .rail .ui.sticky, .fixed .ui.sticky')
            .sticky({
              context: $container,
              offset: 30
            })
          ;
          $sectionHeaders = $container.children('h2');
          $sectionExample = $container.find('.example');
          $exampleHeaders = $sectionExample.children('h4');
          // create code
          handler.tryCreateMenu();
          $(window).on('resize.menu', function() {
            handler.tryCreateMenu();
          });
        },
        onTabLoad : function() {
          $(this).find('> .rail .ui.sticky, .fixed .ui.sticky')
            .sticky('refresh')
          ;
        }
      })
    ;
  }
  else {
    handler.makeCode();
    handler.tryCreateMenu();
    $(window).on('resize.menu', function() {
      handler.tryCreateMenu();
    });
  }

  // code highlighting languages
  window.hljs.configure({
    languages: [
      'xml',
      'css',
      'javascript'
    ]
  });

  // main sidebar
  $menu
    .sidebar({
      dimPage          : false,
      transition       : 'overlay',
      mobileTransition : 'uncover'
    })
  ;
/*
  // inner sticky menu (mozilla only)
  $('.full.height > .toc > .sticky')
    .sticky({
      offset: 1,
      context: $('.full.height > .article')
    })
  ;
*/
  // launch buttons
  $('.launch.button, .view-ui, .launch.item')
    .on('click', function(event) {
      $menu.sidebar('toggle');
      event.preventDefault();
    })
  ;

  $search
    .children('.icon')
      .on('click', handler.shortcut.search)
      .end()
    // Load search data the first time user focuses the search input.
    .find('input')
      .on('focus', handler.search.focus)
      .on('blur', handler.search.blur)
  ;

  // setup keyboard shortcuts
  var shortcuts = [
    {
      name        : 'Search',
      key         : 's',
      aka         : 's',
      description : 'Focus search bar',
      action      : handler.shortcut.search
    },
    {
      name        : 'Help',
      key         : 'z',
      aka         : '?',
      description : 'Show keyboard shortcuts',
      action      : handler.shortcut.modal
    }
  ];
/*  $.each(shortcuts, function(index, shortcut) {
    $document
      .on('keydown', shortcut.key, shortcut.action)
    ;
  });
*/
  handler.createIcon();
  $example
    .each(function() {
      if($(this).is('.no')) {
        return;
      }
      else {
        $(this)
          .popup({
            preserve: false,
            on       : 'hover',
            variation: 'inverted',
            delay: {
              show: 300,
              hide: 100
            },
            position : 'top right',
            offset   : 5,
            content  : 'View Source',
            target   : $(this).find('i.code')
          })
          .find('i.code')
            .on('click', handler.createCode)
        ;
      }
      $.proxy(handler.generateCode, this)();
    })
  ;

  $menuMusic
    .on('click', handler.openMusic)
  ;

  $shownExample
    .each(handler.createCode)
  ;

  $downloadPopup
    .popup({
      transition : 'horizontal flip',
      duration   : 350,
      position   : 'bottom center',
      on         : 'click',
      onHidden   : handler.resetDownloads
    })
  ;
  $downloadInput
    .on('mouseup', handler.selectAll)
  ;
  $downloadFramework
    .on('click', handler.chooseFramework)
  ;
  $downloadStandalone
    .on('click', handler.chooseStandalone)
  ;

  $themeDropdown
    .dropdown({
      allowTab: false,
      onChange: handler.less.changeTheme
    })
  ;

  if($.fn.tablesort !== undefined && $sortTable.size() > 0) {
    $sortTable
      .tablesort()
    ;
  }

  $helpPopup
    .popup({
      position: 'top left',
      variation: 'inverted'
    })
  ;

  $swap
    .on('click', handler.swapStyle)
  ;

  $overview
    .dropdown({
      action: 'select',
      onChange: handler.changeMode
    })
  ;

  $menuPopup
    .popup({
      position  : 'bottom center',
      delay: {
        show: 500,
        hide: 50
      }
    })
  ;

  $pageDropdown
    .dropdown({
      on       : 'hover',
      action   : 'nothing',
      allowTab : false
    })
  ;
  $languageDropdown
    .popup({
      position : 'bottom center',
      delay    : {
        show: 500,
        hide: 50
      }
    })
    .dropdown({
      allowTab   : false,
      on         : 'click',
      onShow     : function() {
        $(this).popup('hide');
      },
      onChange : handler.translatePage
    })
  ;

  //$.fn.api.settings.base = '//api.semantic-ui.com';
  $.extend($.fn.api.settings.api, {
    categorySearch : '//api.semantic-ui.com/search/category/{query}',
    search         : '//api.semantic-ui.com/search/{query}'
  });

  if(window.Transifex !== undefined) {
    window.Transifex.live.onTranslatePage(handler.showLanguageModal);
  }

};


// attach ready event
$(document)
  .ready(semantic.ready)
;
