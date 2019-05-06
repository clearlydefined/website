export const fulldetailsMap = {
  described: {
    facets: {
      editor: '[data-test-id="facets-editor"]',
      get dataFacetTagForInput() {
        return `${this.editor} .ant-tag`
      },
      get dataFacetInput() {
        return `${this.editor} input`
      }
    }
  },
  fileList: {
    identifier: '.file-list',
    revertBtn: '[data-test-id="revert-files-and-facets"]',
    columns: {
      name: {
        identifier: '.column-name'
      },
      facets: {
        identifier: '.column-facets'
      },
      license: {
        identifier: '.column-license'
      },
      copyrights: {
        identifier: '.column-copyrights'
      }
    },
    folderIcon: '.ant-table-row-expand-icon',
    rowIdentifier: '.ant-table-row',
    firstRow: '[data-row-key="1"]',
    firstRowContent: 'docs',
    lastRow: '[data-row-key="128"]',
    lastRowContent: 'package.json',
    pathUrl: 'https://github.com/automattic/mongoose/blob/1ead0e616ab028a994ab47a23643749659243e07/package.json',
    files: {
      'README.md': {
        row: '.file-list tbody > tr:nth-child(5) > .column-facets > div',
        get facets() {
          return `${this.row}`
        }
      },
      docs: {
        row: '.file-list tbody > tr:nth-child(1)',
        get facetsColumn() {
          return `${this.row} > .column-facets > div`
        },
        get expandIcon() {
          return `${this.row} .ant-table-row-expand-icon`
        },
        get facets() {
          return `${this.facetsColumn} .ant-tag`
        },
        get removeIcon() {
          return `${this.facetsColumn} .ant-tag:first-child .anticon-close`
        },
        get plusIcon() {
          return `${this.facetsColumn} i`
        },
        get input() {
          return `${this.facetsColumn} .ant-select-search__field`
        },
        children: {
          'populate.html': {
            facetsColumn: '.file-list tbody > tr:nth-child(12) > .column-facets > div',
            get facets() {
              return `${this.facetsColumn} .ant-tag`
            }
          }
        }
      }
    }
  }
}
