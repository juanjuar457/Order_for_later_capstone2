
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

function  init_main_form () {

    for(i=0; i < state.form_data.units.length; i++){  //initilizes the drop down for order form 
        $('#units').append('<option value="' + state.form_data.units[i].value +'">' + state.form_data.units[i].name +'</option>') 
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
            render_material_list();    
            
        }
    })
}

//get rid of underscores make it all proper case like 41, make var names camel case if any not.
//take out console logs and unused code 
//re name all funcs and vars to make sense use proper plurality when naming anything

//will need a new set backorder AND delete, to match the new state.requested_materials[0].materials[i].onBackOrder
//kip the other ones that are rendering the entered materials stop at requested_materials.[blah]
//


//MIGHT NEED TO ADJUST THIS LATER FOR LOGIN FUNCTIONS 
init_main_form(); // initializes the drop down for the order form  

//CONTROL ARM HERE 
function add_material_click (event) {
    event.preventDefault();
    add_material(); 
    render_material_list();
}

function add_material () { 

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
            render_material_list();
        }
    });
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>> EVENT LISTENERS<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$('#main_submit').submit(function(event){ //id is in main_page.html
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
            render_material_list();
        }
    }); 
});

function delete_material(event) {   
    event.stopPropagation();
    $.ajax({ 
        id: event.data.id,
        url: 'http://localhost:8080/materials/' + event.data.id, 
        // data: this.id, prop might work, not this way though.. 
        type: 'DELETE',
        success: function() {
            for(i=0; i < state.requested_materials.length; i++){
                
                if(event.data.id === state.requested_materials[i].id){
                    state.requested_materials.splice(i,1)
                     //returns empty array... if slice(i,0)
                    break;
                }

            }

            render_material_list(); 

        }
    });
}



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>RENDER STATE<<<<<<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function render_material_list() {
    // console.log('Test to render') 
    console.log(state.requested_materials) //app is getting here no problem -jj 
    var dom = $('#requested_materials');
    dom.empty(); //flushes out material
    
    for (i = 0; i < state.requested_materials.length; i++){
       
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

$("some selector").click({ param1: "Hello", param2: "World" }, cool_function); function cool_function(event) { alert(event.data.param1); alert(event.data.param2); }
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>FUNCTIONS FOR LATER USE / NOT IN USE IN NODE CAPSTONE!! <<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//IFEE  FOR ADMIN ***NOT IN USE FOR NODE CAPSTONE!
(function () {
    $('#login_admin_btn').click(check_pass_admin);
    $('#login_btn').click(check_pass_guest); 
    $('#admin_login_form').hide();
    $('#admin_tab').find('a').click(toggle_login);
    $('#guest_tab').find('a').click(toggle_login);
    //target the li href, check against the text, 
})(); 

function toggle_login (e) {
    var tab = $(e.currentTarget).text().toLowerCase();
    $('#admin_login_form').hide();
    $('#admin_tab').removeClass('active');
    $('#guest_login_form').hide();
    $('#guest_tab').removeClass('active');

    if (tab === 'admin login'){
        $('#admin_login_form').show();
        $('#admin_tab').addClass('active');
    } else {
        $('#guest_login_form').show();
        $('#guest_tab').addClass('active');
    }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>FUNCTIONS FOR LATER USE / NOT IN USE IN NODE CAPSTONE!! <<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function check_pass_admin (event) {

	event.preventDefault();
	var inpass = $('#admin').val()
	console.log(inpass);
	if(inpass === mock_data.user[0].id) {
		//make that equal to what is on the db. 
        
		alert('Login Correct!');
		alert('Welcome Admin');
		window.location.href="main_page.html";
	}
	else {
		alert('Login incorrect! Try again!');
		window.location.href="admin.html";
	}
} 

function check_pass_guest (event) {

	event.preventDefault();
	var inpass = $('#guest').val() //id for input bar on start screen
	// console.log(inpass)
	// console.log(mock_data.user[1].id)
	if (inpass === mock_data.user[1].id) {
		console.log(mock_data.user[0].id); //this is hitting 9181 
		alert('Login Correct!');
		window.location.href="main_page.html"
	} 
	else {
		alert('Login incorrect! Try again!');
		window.location.href="index.html";
	};

}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>MOCK DATA STATE  NOT IN USE IN NODE CAPSTONE!! <<<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//var mock_data = {
//	items_ordered: [
//		{
//			vendor: "",
//			quantity: "",
//			product_name: "",
//			catalog_number: "",
//			unit_size: "",
//		}
//	],

//	user: [
//		{
//			id: "9181",
//			name: "Rebecca",	
//			type: 'admin'
//		}, //say admin or guest

//		{
//			id: "1189",
//			name: "Dolcemar",
//			type: 'guest',6
//		}
//	],

//	company: {
//		id: 7744,
//		name: "Solutions Pharmacy"	
//	}
//}; 









