$("#downloadProjeto").click(() => {

    let data = $("#downloadProjeto").data();

    var request = new XMLHttpRequest();
    request.open('GET', '/download?id=' + data.id, true);
    request.responseType = 'blob';
    request.onload = function () {
        var link = document.createElement('a');
        document.body.appendChild(link);
        link.href = window.URL.createObjectURL(request.response);
        link.download = data.nome;
        link.click();
    };
    request.send();
    
});

$("#table_id").DataTable();