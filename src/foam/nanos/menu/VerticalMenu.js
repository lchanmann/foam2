/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */


foam.CLASS({
  package: 'foam.nanos.menu',
  name: 'VerticalMenu',
  extends: 'foam.u2.View',

  implements: [
    'foam.mlang.Expressions'
  ],

  imports: [
    'currentMenu',
    'menuListener',
    'loginSuccess',
    'menuDAO',
    'pushMenu'
  ],

  requires: [
    'foam.nanos.menu.Menu',
    'foam.nanos.menu.VerticalMenu',
    'foam.dao.ArraySink'
  ],

  css: `
  input {
    width: 220px;
  }

  ^ .side-nav-view {
    font-size: medium!important;
    font-weight: normal;
    display: inline-block;
    position: absolute;
    height: calc(100vh - 80px);
    width: 240px;
    overflow-x: hidden;
    z-index: 100;
    font-size: 26px;
    color: /*%GREY2%*/ #9ba1a6;
    border-right: 1px solid /*%GREY4%*/ #e7eaec;
    background: /*%GREY5%*/ #f5f7fas;
  }

  .foam-u2-search-TextSearchView {
    text-align: center;
    margin: 4px 0;
  }

  ^ .foam-u2-view-TreeViewRow-label {
    font-weight: 300;
  }

  ^ .foam-u2-view-TreeViewRow {
    width: 100%;
  }
  ^ .tree-view-height-manager {
    margin-bottom: 40px;
  }
  `,

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.u2.Element',
      name: 'subMenu',
      documentation: 'Used to store selected submenu element after window reload and scroll into parent view'
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'dao_',
      factory: function() {
        return this.menuDAO.orderBy(this.Menu.ORDER);
      }
    },
    {
      name: 'menuSearch',
      class: 'String',
      value: ''
    }
  ],

  methods: [
    function initE() {
      var self = this;

      this
      .addClass(this.myClass())
      .start()
        .addClass('side-nav-view')
        .start()
          .startContext({ data: this })
          .start()
            .add(self.MENU_SEARCH.clone().copyFrom({ view: {
              class: 'foam.u2.view.TextField',
              type: 'search',
              onKey: true
            } }))
            .addClass('foam-u2-search-TextSearchView')
          .end()
          .endContext()
          .start()
            .addClass('tree-view-height-manager')
            .tag({
              class: 'foam.u2.view.TreeView',
              data: self.dao_,
              relationship: foam.nanos.menu.MenuMenuChildrenRelationship,
              startExpanded: true,
              query: self.menuSearch$,
              onClickAddOn: function(data) { self.openMenu(data); },
              formatter: function(data) { this.add(data.label); }
            })
          .end()
        .end()
      .end();
    },

    function openMenu(menu) {
      if ( Object.keys(menu.handler.instance_).length > 0 ) {
        this.pushMenu(menu.id);
        this.menuListener(menu);
      }
    }
  ]
});
