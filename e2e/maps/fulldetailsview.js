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
          return `${this.row} .ant-tag`
        }
      }
    }
  }
}
