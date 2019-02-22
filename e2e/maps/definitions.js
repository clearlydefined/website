export const definitionsMap = {
  componentSearch: {
    input: '.rbt-input-main',
    list: '.rbt-menu>li',
    listElement: '.rbt-menu li:nth-child(1) a'
  },
  componentList: {
    list: '.components-list',
    firstElement: 'div:nth-child(0n+1) .component-row'
  },
  contributeButton: '[data-test-id="page-definition-buttons-bar"] [data-test-id="contribute-button"]',
  contributeSuccess: '[data-test-id="contribution-success"]',
  component: {
    name: '[data-test-id="component-name"]',
    image: '.list-image',
    buttons: '.list-activity-area',
    sourceButton: '.list-fa-button > i.fa-code',
    inspectButton: '.list-fa-button > i.fa-search',
    copyButton: '.list-fa-button > i.fa-copy',
    switchButton: '.list-fa-button > i.fa-exchange-alt',
    revertButton: '.list-fa-button > i.fa-undo',
    removeButton: '.btn-link > i.list-remove',
    firstElement: '.components-list > .ReactVirtualized__Grid__innerScrollContainer > div:nth-child(1)',
    get panel() {
      return `${this.firstElement} > div.two-line-entry > div.list-panel`
    },
    get detailsElement() {
      return `${this.panel} > div`
    },
    details: {
      get declared() {
        return `${definitionsMap.component.detailsElement} > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > b`
      },
      get source() {
        return `${definitionsMap.component.detailsElement} > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > b`
      },
      get releaseDate() {
        return `${definitionsMap.component.detailsElement} > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > b`
      },
      get discovered() {
        return `${definitionsMap.component.detailsElement} > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > b`
      },
      get attribution() {
        return `${definitionsMap.component.detailsElement} > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > b`
      },
      get files() {
        return `${definitionsMap.component.detailsElement} > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > b`
      },
      licenseField: '[name="licensed.declared"] > span',
      licensePickerButton: '.license-renderer > .license-advanced',
      get licenseFieldUpdated() {
        return `${this.licenseField}.bg-info`
      },
      sourceField: '[name="described.sourceLocation"] > .fas.fa-pencil-alt.editable-marker',
      releaseDateField: '[name="described.releaseDate"] > .fas.fa-pencil-alt.editable-marker',
      releaseDateInput: '[name="described.releaseDate"] > input'
    }
  },
  licensePicker: {
    identifier: '.spdx-picker',
    inputField:
      '[data-test-id="spdx-input-picker"] > div.rbt > div.rbt-input.form-control > .rbt-input-wrapper > div > .rbt-input-main',
    listSelection: '#rbt-menu-item-1',
    buttonSuccess: '[data-test-id="license-picker-ok-button"]'
  },
  sourcePicker: {
    identifier: '#source-picker',
    get buttonSuccess() {
      return `${this.identifier} .btn-success`
    }
  },
  fullDetailView: {
    identifier: '.fullDetaiView__modal',
    get buttonSuccess() {
      return `${this.identifier} [data-test-id="header-section-ok-button"]`
    }
  },
  contributeModal: {
    identifier: '#contribute-modal',
    get summaryField() {
      return `${this.identifier} input[name="summary"]`
    },
    get detailsField() {
      return `${this.identifier} textarea[name="details"]`
    },
    get resolutionField() {
      return `${this.identifier} textarea[name="resolution"]`
    },
    get typeField() {
      return `${this.identifier} select[name="type"]`
    },
    get contributeButton() {
      return `${this.identifier} [data-test-id="contribute-button"]`
    }
  }
}
