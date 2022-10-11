const moment = require('moment')

module.exports = {
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
  },
  editIcon: function (docUser, loggedUser, docId, docType, floating = true) {
    if (docUser._id.toString() == loggedUser._id.toString()) {
      if (docType === 'chronicle') {
        if (floating) {
          return `<a href="/chronicles/edit/${docId}" class="btn-floating halfway-fab light-blue darken-3"><i class="fas fa-edit fa-small"></i></a>`
        } else {
          return `<a href="/chronicles/edit/${docId}"><i class="fas fa-edit"></i></a>`
        }
      }
      else if (docType === 'record') {
        if (floating) {
          return `<a href="/records/edit/${docId}" class="btn-floating halfway-fab light-blue darken-3"><i class="fas fa-edit fa-small"></i></a>`
        } else {
          return `<a href="/records/edit/${docId}"><i class="fas fa-edit"></i></a>`
        }
      }
    } else {
      return ''
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },
  checked: function (value, currentValue) {
    if(value === currentValue) {
      return 'checked'
    }
  }
}
