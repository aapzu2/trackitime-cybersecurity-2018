
$("table.project-table td.started").each(function(i, el) {
    var text = $(this).text()
    $(this).text(moment(text).format('DD.MM.YYYY'))
})
