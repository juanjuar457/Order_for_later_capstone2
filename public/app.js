
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

    requestedMaterials: [],
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
    var url = '/materials'
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            state.requestedMaterials = data.materials;
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
    state.requestedMaterials.push(material);
    material.quantity = $('#quantity').val();
    material.vendor = $('#vendor').val();
    material.catalog_number = $('#catalog_number').val();
    material.units = $('#units').val();

}

function setBackOrder(event) {
    var material = null;
    for (i = 0; i < state.requestedMaterials.length; i++) {
        if (event.data.id === state.requestedMaterials[i].id) {
            state.requestedMaterials[i].onBackOrder = state.requestedMaterials[i].onBackOrder ? false: true;
            material = state.requestedMaterials[i];
            break;
        }
    } 
    var url = '/togglebackorder' 
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
    var url = '/savematerial'
    var material = {
        vendor: $('#vendor').val(),
        quantity: $('#quantity').val(),
        product_name: $('#product_name').val(),
        catalog_number: $('#catalog_number').val(),
        units: $('#units').val(),
        unit_size: $('#unit_size').val(),
        onBackOrder: false
    }
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(material),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            material.id = data.id;
            state.requestedMaterials.push(material);
            renderMaterial();
        }
    });
});

function deleteMaterial(event) {   
    event.originalEvent.cancelBubble = true;
    event.originalEvent.stopPropagation();
    $.ajax({
        id: event.data.id,
        url: '/deletematerial/' + event.data.id,

        type: 'DELETE',
        success: function () {
            for (i = 0; i < state.requestedMaterials.length; i++) {

                if (event.data.id === state.requestedMaterials[i].id) {
                    state.requestedMaterials.splice(i, 1)

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
    var dom = $('#requestedMaterials');    
    dom.empty(); //flushes out material   
    for (i = 0; i < state.requestedMaterials.length; i++) {
        dom.append('<div id="R' + state.requestedMaterials[i].id + '" class="row example_entry ' + (state.requestedMaterials[i].onBackOrder ? "onBackOrder" : "") + '"><div class="col-md-2">' + state.requestedMaterials[i].vendor + '</div>' +
            '<div class="col-md-1">' + state.requestedMaterials[i].quantity + '</div>' +
            '<div class="col-md-2">' + state.requestedMaterials[i].product_name + '</div>' +
            '<div class="col-md-2">' + state.requestedMaterials[i].catalog_number + '</div>' +
            '<div class="col-md-2">' + state.requestedMaterials[i].unit_size + '</div>' +
            '<div class="col-md-2">' + state.requestedMaterials[i].units + '</div>' +
            '<div class="col-md-1"><i id="D' + state.requestedMaterials[i].id + '" class="glyphicon glyphicon-remove pull-right"></i></div>' +
            '</div>');
        $('#D' + state.requestedMaterials[i].id).click({ event: this, id: state.requestedMaterials[i].id }, deleteMaterial);
        $('#R' + state.requestedMaterials[i].id).click({ event: this, id: state.requestedMaterials[i].id }, setBackOrder);
    }
}












