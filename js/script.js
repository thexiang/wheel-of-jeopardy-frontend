const baseUrl = 'https://jhu-se-api-container.azurewebsites.net'
var selectedRow = null
var selectedId = null
initRecord()


function onFormSubmit(ele_id_list, method_name) {
    // if (validate()) {
    //     var formData = readFormData();
    //     if (selectedRow == null)
    //         initRecord();
    //     else
    //         updateRecord(formData);
    // }
    const formData = readFormData(ele_id_list);
    if(validate(formData)) {
        switch (method_name) {
            case "renameCat":
                renameCat(formData);
                break;
            case "updateQA":
                updateQA(formData);
                break;
            default:
                break;
        }
        
        alert("Updated successfully!")
        location.reload();
    }
    
    resetForm(ele_id_list);

}


function readFormData(ele_id_list) {
    var formData = {};
    ele_id_list.forEach(element => {
        formData[element] = document.getElementById(element).value;
    });
    return formData;
}


function initRecord() {
    $.ajax({
        type: "GET",
        url: `${baseUrl}/admin/show_cats`,
        success: popTable,
        dataType: 'json'
      });
}

function popTable(res){
    var table = document.getElementById("categoryList").getElementsByTagName('tbody')[0];
    res.forEach(row => {
        var newRow = table.insertRow(table.length);
        cell1 = newRow.insertCell(0);
        cell1.innerHTML = row.name;
        cell2 = newRow.insertCell(1);
        cell2.innerHTML = ` <a class='glyphicon glyphicon-edit' id="${row.id}"  onClick="onEdit(this)">Rename</a>
                           <a class='glyphicon glyphicon-question-sign' id="${row.id}" onClick="onDetail(this)">Questions</a>`;
    })
}



function resetForm(ele_id_list) {
    ele_id_list.forEach(element => {
        document.getElementById(element).value = "";
    });
    selectedRow = null;
    selectedId = null;
}



function resetTable() {
    // var table = document.getElementById("qaList").remove();
    $("#qaList_tbody tr").remove(); 
    // document.getElementById("name").value = "";
    selectedRow = null;
    selectedId = null;
}



function onEdit(td) {
    // console.log(td.id)
    selectedRow = td.parentElement.parentElement;
    document.getElementById("name").value = selectedRow.cells[0].innerHTML;
    selectedId = td.id
}



function renameCat(formData) {
    // selectedRow.cells[0].innerHTML = formData.name;
    console.log(selectedId)
    data = `{"name": "${formData.name}"}`
    url = `${baseUrl}/admin/update_cat/${selectedId}`
    post(url, data);
}


function updateQA(formData) {
    // selectedRow.cells[0].innerHTML = formData.name;
    console.log(selectedId)
    data = `{"question": "${formData.question}", "answer": "${formData.answer}"}`
    url = `${baseUrl}/admin/update_qa/${selectedId}`
    // console.log(data);
    // console.log(url);
    
    post(url, data);
}


function post(url, data) {
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(res) {
            console.log(res);
        },
        dataType: 'json'
      });
}



function onDetail(td) {
    resetTable();
    selectedRow = td.parentElement.parentElement;
    document.getElementById("name").value = selectedRow.cells[0].innerHTML;
    selectedId = td.id

    $.ajax({
        type: "GET",
        url: `${baseUrl}/admin/show_qas/${selectedId}`,
        success: popTable_qa,
        dataType: 'json'
      });

}


function popTable_qa(res){
    var table = document.getElementById("qaList").getElementsByTagName('tbody')[0];
    res.forEach(row => {
        var newRow = table.insertRow(table.length);
        cell1 = newRow.insertCell(0);
        cell1.innerHTML = row.question;
        cell2 = newRow.insertCell(1);
        cell2.innerHTML = row.answer;
        cell3 = newRow.insertCell(2);
        cell3.innerHTML = row.score;
        cell4 = newRow.insertCell(3);
        cell4.innerHTML = `<a id="${row.id}" onClick="onEdit_qa(this)">Edit</a>`;
    })
}


function onEdit_qa(td){
    console.log(td.id);
    selectedRow = td.parentElement.parentElement;
    document.getElementById("question").value = selectedRow.cells[0].innerHTML;
    document.getElementById("answer").value = selectedRow.cells[1].innerHTML;
    selectedId = td.id
}


// function validate() {
//     isValid = true;
//     if (document.getElementById("name").value == "") {
//         isValid = false;
//         document.getElementById("nameValidationError").classList.remove("hide");
//     } else {
//         isValid = true;
//         if (!document.getElementById("nameValidationError").classList.contains("hide"))
//             document.getElementById("nameValidationError").classList.add("hide");
//     }
//     return isValid;
// }


function validate(formData) {
    for (var key in formData) {
        if (formData.hasOwnProperty(key)) {
            // console.log(key + " -> " + formData[key]);
            if (formData[key]==""){
                alert(`${key=="name"? "Category": key} can not be empty!`)
                return false;
            }
            
        }
    };
    return true;
}