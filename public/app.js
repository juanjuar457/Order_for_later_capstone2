
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>> STATE OBJECT <<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var state = {
    formData: {
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
};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>> STATE MODIFIERS<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

(function() { //makes dropdwon for units on page load & Populates the form with materials on DB
    for (i = 0; i < state.formData.units.length; i++) {  //initilizes the drop down for order form 
        $('#units').append('<option value="' + state.formData.units[i].value + '">' + state.formData.units[i].name + '</option>');
    };

    PopulateRequestedMaterials();
})(); //IFEE

//****INITIAL GET CALL + RENDER*******
//need to make ajax call to get and loop through materials and add them to the state. 
function PopulateRequestedMaterials() {
    $.ajax({
        type: "GET",
        url: "/materials",
        dataType: "json",
        success: function (data) {
            state.requestedMaterials = data.materials;
            renderMaterial();
        }
    })
}

function addMaterial() {
    var material = {};
    material.product = $('#product').val();
    state.requestedMaterials.push(material);
    material.quantity = $('#quantity').val();
    material.vendor = $('#vendor').val();
    material.catalogNumber = $('#catalogNumber').val();
    material.units = $('#units').val();
}

function setBackOrderClick(event) {   
    setBackorderAjax(setBackOrderState(event.data.id));
}

function setBackOrderState(id) { //easier to test no need for event to be passed
    for (i = 0; i < state.requestedMaterials.length; i++) {
        if (id === state.requestedMaterials[i].id) {
            state.requestedMaterials[i].onBackOrder = state.requestedMaterials[i].onBackOrder ? false : true;
            return state.requestedMaterials[i];         
        }
    }
}

function setBackorderAjax (material){
    $.ajax({
        type: "PUT",
        url: '/togglebackorder',
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
    event.preventDefault();
    var material = {
        vendor: $('#vendor').val(),
        quantity: $('#quantity').val(),
        productName: $('#productName').val(),
        catalogNumber: $('#catalogNumber').val(),
        units: $('#units').val(),
        unitSize: $('#unitSize').val(),
        onBackOrder: false
    };
    $.ajax({
        type: "POST",
        url: '/savematerial',
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

function deleteMaterialClick(event) {
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
        dom.append('<div id="R' + state.requestedMaterials[i].id + '" class="row exampleEntry ' + (state.requestedMaterials[i].onBackOrder ? "onBackOrder" : "") +
            '"><div class="col-md-2">' + state.requestedMaterials[i].vendor + '</div>' +
            '<div class="col-md-1">' + state.requestedMaterials[i].quantity + '</div>' +
            '<div class="col-md-2">' + state.requestedMaterials[i].productName + '</div>' +
            '<div class="col-md-2">' + state.requestedMaterials[i].catalogNumber + '</div>' +
            '<div class="col-md-2">' + state.requestedMaterials[i].unitSize + '</div>' +
            '<div class="col-md-2">' + getUnitKey(state.requestedMaterials[i].units) + '</div>' +
            '<div class="col-md-1"><i id="D' + state.requestedMaterials[i].id + '" class="glyphicon glyphicon-remove pull-right"></i></div>' +
            '</div>');
        $('#D' + state.requestedMaterials[i].id).click({ event: this, id: state.requestedMaterials[i].id }, deleteMaterialClick);
        $('#R' + state.requestedMaterials[i].id).click({ event: this, id: state.requestedMaterials[i].id }, setBackOrderClick);
    }
}

function getUnitKey(value) {
    var items = state.formData.units.filter(function (item) {
        return item.value === value;
    });
    return items.length > 0 ? items[0].name : ""; //to make fault tolerant
}