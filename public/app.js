
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>> STATE OBJECT <<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var state = {
    form_data: {
        units: [
            {
                name: "grams",
                value: "gm"
            },
            {
                name: "killograms",
                value: "kg"
            },
            {
                name: "milliliters",
                value: "ml"
            }
        ], //call to api gets units for you
    },

    requested_materials: [],
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>> STATE MODIFIERS<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function initPageLoad() { //makes dropdwon for units on page load & Populates the form with materials on DB

    for (i = 0; i < state.form_data.units.length; i++) {  //initilizes the drop down for order form 
        $('#units').append('<option value="' + state.form_data.units[i].value + '">' + state.form_data.units[i].name + '</option>')
    };
    PopulateRequestedMaterials();


};

//****INITIAL GET CALL + RENDER*******
//need to make ajax call to get and loop through materials and add them to the state. 
function PopulateRequestedMaterials() {
    var url = 'http://localhost:8080/materials'
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            state.requested_materials = data.materials;
            renderMaterial();

        }
    })
}

initPageLoad(); //For 1st page load 

//CONTROL ARM HERE 
function addMaterialClick(event) {
    event.preventDefault();
    addMaterial();
    renderMaterial();
}

function addMaterial() {

    var material = {};
    material.product = $('#product').val();
    state.requested_materials.push(material);
    material.quantity = $('#quantity').val();
    material.vendor = $('#vendor').val();
    material.catalog_number = $('#catalog_number').val();
    material.units = $('#units').val();

}

function setBackOrder(id) {
    var material = null;
    for (i = 0; i < state.requested_materials.length; i++) {
        if (id === state.requested_materials[i].id) {
            state.requested_materials[i].onBackOrder = !state.requested_materials[i].onBackOrder;
            material = state.requested_materials[i];
            break;
        }
    }
    var url = 'http://localhost:8080/materials'
    $.ajax({
        type: "PUT",
        url: url,
        data: JSON.stringify(material),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            renderMaterial();
        }
    });
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>> EVENT LISTENERS<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$('#main_submit').submit(function (event) { //id is in main_page.html
    event.preventDefault()
    var url = 'http://localhost:8080/materials'
    var material = {
        vendor: $('#vendor').val(),
        quantity: $('#quantity').val(),
        product_name: $('#product_name').val(),
        catalog_number: $('#catalog_number').val(),
        units: $('#units').val(),
        unit_size: $('#unit_size').val()
    }
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(material),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            material.id = data.id;
            state.requested_materials.push(material);
            renderMaterial();
        }
    });
});

function delete_material(event) {
    event.stopPropagation();
    $.ajax({
        id: event.data.id,
        url: 'http://localhost:8080/materials/' + event.data.id,

        type: 'DELETE',
        success: function () {
            for (i = 0; i < state.requested_materials.length; i++) {

                if (event.data.id === state.requested_materials[i].id) {
                    state.requested_materials.splice(i, 1)

                    break;
                }

            }
            renderMaterial();
        }
    });
}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>RENDER STATE<<<<<<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function renderMaterial() {
    var dom = $('#requested_materials');
    dom.empty(); //flushes out material

    for (i = 0; i < state.requested_materials.length; i++) {
        dom.append('<div class="row example_entry ' + (state.requested_materials[i].onBackOrder ? "onBackOrder" : "") + '" onclick="setBackOrder(\'' +
            state.requested_materials[i].id + '\')"><div class="col-md-2">' + state.requested_materials[i].vendor + '</div>' +
            '<div class="col-md-1">' + state.requested_materials[i].quantity + '</div>' +
            '<div class="col-md-2">' + state.requested_materials[i].product_name + '</div>' +
            '<div class="col-md-2">' + state.requested_materials[i].catalog_number + '</div>' +
            '<div class="col-md-2">' + state.requested_materials[i].unit_size + '</div>' +
            '<div class="col-md-2">' + state.requested_materials[i].units + '</div>' +
            '<div class="col-md-1"><i id="' + state.requested_materials[i].id + '" class="glyphicon glyphicon-remove pull-right"></i></div>' +
            '</div>');
        $('#' + state.requested_materials[i].id).click({ event: this, id: state.requested_materials[i].id }, delete_material);
    }
}












