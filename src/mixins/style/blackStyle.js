export default {
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return 'background-color: #444444'
    },
    tableCellStyle({ row, rowIndex }) {
      return 'background-color: #5a5c59'
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return 'background-color: #444444'
    }
  }
}
