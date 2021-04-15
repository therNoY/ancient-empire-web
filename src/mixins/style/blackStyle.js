export default {
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return 'background-color: #444444;color:cornsilk'
    },
    tableCellStyle({ row, rowIndex }) {
      return 'background-color: #5a5c59;color:cornsilk'
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return 'background-color: #444444;color:cornsilk'
    }
  }
}
