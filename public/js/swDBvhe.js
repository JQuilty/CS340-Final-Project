document.addEventListener('DOMContentLoaded', bindButtons);
document.addEventListener('DOMContentLoaded',buildTable); 
    
    function bindButtons(){
        document.getElementById('addBtn').addEventListener('click', function(event){
            if(document.getElementById('vName_input').value == ''){
                return; 
            }
            var req = new XMLHttpRequest();
            var payload = {action:"add",name:null,capacity:null,lightspeed:null,pilot:null}; 
            
            payload.name = document.getElementById('vName_input').value; 
            payload.capacity = document.getElementById('vCapacity_input').value; 

            payload.lightspeed = document.getElementById('vLightspeed_input').value
            payload.pilot = document.getElementById('vPilot_input').value;

            document.getElementById('vName_input').value = ''; 
            document.getElementById('vCapacity_input').value = 0; 
            document.getElementById('vLightspeed_input').value = 0;
            document.getElementById('vPilot_input').value = 0;                      

            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/vehicles", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load',function(){
                if(req.status >= 200 && req.status < 400){
                    buildTable();  
                }
                else {
                    console.log("Error in network request: " + req.statusText);
                }
            });
            req.send(JSON.stringify(payload));
            event.preventDefault();
        }); 
    } 

    function buildTable(){
        
        var rowContain = document.getElementById("rowContainer");  
        while(rowContain.firstChild){
            rowContain.removeChild(rowContain.firstChild); 
        }

        var req = new XMLHttpRequest();
            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/vehicles", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                
                var rows = JSON.parse(req.responseText);
                for(var p in rows){

                    var row = document.createElement("tr"); 
                    row.id = "row" + rows[p].vehicle_id; 
                    
                    var cell = document.createElement("td");
                    cell.id = "name" + rows[p].vehicle_id; 
                    cell.textContent = rows[p].vehicle_name;
                    row.appendChild(cell);
                    var cell = document.createElement("td");
                    cell.id = "capacity" + rows[p].vehicle_id;
                    cell.textContent = rows[p].vehicle_capacity;
                    row.appendChild(cell);
                    var cell = document.createElement("td");
                    cell.id = "lightspeed" + rows[p].vehicle_id;
                    if(rows[p].vehicle_lightspeed == 0){
                        cell.textContent = "No"; 
                    }else{
                        cell.textContent = "Yes"; 
                    }
                    row.appendChild(cell);
                    var cell = document.createElement("td");
                    cell.id = "pilot" + rows[p].vehicle_id; 
                    cell.textContent = rows[p].character_name;
                    row.appendChild(cell);
                                      
                    //Update Button ======================================
                    var cell = document.createElement("td"); 
                    var button = document.createElement("button"); 
                    cell.id = "update" + rows[p].vehicle_id; 
                    cell.classList.add("hidden");
                    button.textContent = "Update";
                    button.id = rows[p].vehicle_id;  
                    button.addEventListener('click', function(event){
                        
                        //Name field
                        var nameContent = document.getElementById("name" + this.id).textContent;
                        var thisCell = document.createElement("td"); 
                        var thisInput = document.createElement("input"); 
                        thisInput.id="vName_upd"
                        thisInput.type ="text"; 
                        thisInput.defaultValue= nameContent; 
                        thisCell.appendChild(thisInput); 
                        var thisRow = document.getElementById("row"+this.id); 
                        thisRow.replaceChild(thisCell,document.getElementById("name"+this.id));

                         //Capacity field
                        var capContent = document.getElementById("capacity" + this.id).textContent;
                        var thisCell = document.createElement("td"); 
                        var thisInput = document.createElement("input"); 
                        thisInput.id="vCapacity_upd"
                        thisInput.type ="text"; 
                        thisInput.defaultValue= capContent; 
                        thisCell.appendChild(thisInput); 
                        var thisRow = document.getElementById("row"+this.id); 
                        thisRow.replaceChild(thisCell,document.getElementById("capacity"+this.id));

                         //lightspeed field
                        var lightContent = document.getElementById("lightspeed" + this.id).textContent;
                        var thisCell = document.createElement("td"); 
                        var thisSelect = document.createElement("select"); 
                        thisSelect.id="vLightspeed_upd"
                        var noOption = document.createElement("option"); 
                        noOption.textContent = "No"; 
                        noOption.value = 0;
                        var yesOption = document.createElement("option"); 
                        yesOption.textContent = "Yes";
                        yesOption.value = 1; 
                        if (lightContent == "No"){
                            noOption.selected = true; 
                        } else{
                            yesOption.selected = true; 
                        }

                        thisSelect.appendChild(noOption); 
                        thisSelect.appendChild(yesOption); 
                        
                        thisCell.appendChild(thisSelect); 
                        var thisRow = document.getElementById("row"+this.id); 
                        thisRow.replaceChild(thisCell,document.getElementById("lightspeed"+this.id));
                        
                        //Pilot field 
                        var thisCell = document.createElement("td"); 
                        var thisSelect = document.createElement("select"); 
                        thisSelect.id="vPilot_upd"
                        var pilotValue = document.getElementById("pilot" + this.id).textContent;
                        var pilotDefault = 0; 
                        for(var p in rows){
                            if (rows[p].character_name == pilotValue){
                                pilotDefault = rows[p].character_id; 
                            }
                        }
                        
                        var req = new XMLHttpRequest();
                        var payload = {action:"getPilots"}; 
                        req.open('POST', "http://flip1.engr.oregonstate.edu:9945/vehicles", true);
                        req.setRequestHeader('Content-Type', 'application/json');
                        req.addEventListener('load',function(){
                            if(req.status >= 200 && req.status < 400){
                                var rows = JSON.parse(req.responseText); 
                                for (var p in rows){
                                    if(rows[p].character_id != null){
                                        var thisOption = document.createElement("option"); 
                                        thisOption.value = rows[p].character_id;
                                        if(rows[p].character_id == pilotDefault){
                                            thisOption.selected = true; 
                                        }
                                        thisOption.textContent = rows[p].character_name; 
                                        thisSelect.appendChild(thisOption); 
                                    }
                                }
                            }
                                
                            else {
                                console.log("Error in network request: " + req.statusText);
                            }
                        });
                        req.send(JSON.stringify(payload));
                        event.preventDefault();

                        thisCell.appendChild(thisSelect);
                        thisRow.replaceChild(thisCell,document.getElementById("pilot"+this.id));
                        
                        //replace the button with the new save button
                        var thisCell = document.createElement("td")
                        var saveBtn = document.createElement("button"); 
                        cell.classList.add("hidden");
                        saveBtn.textContent = "Save";
                        saveBtn.id = this.id;  
                        saveBtn.addEventListener('click', function(event){
                            var req = new XMLHttpRequest();
                            var payload = {action:"save",name:null,capacity:null, lightspeed:null, pilot:null,id:null}; 
                            payload.name = document.getElementById('vName_upd').value; 
                            payload.capacity = document.getElementById('vCapacity_upd').value; 
                            payload.lightspeed = document.getElementById('vLightspeed_upd').value; 
                            payload.pilot = document.getElementById('vPilot_upd').value; 
                            payload.id = this.id; 


                            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/vehicles", true);
                            req.setRequestHeader('Content-Type', 'application/json');
                            req.addEventListener('load',function(){
                                if(req.status >= 200 && req.status < 400){
                                    buildTable();  
                                }
                                else {
                                    console.log("Error in network request: " + req.statusText);
                                }
                            });
                            req.send(JSON.stringify(payload));
                            event.preventDefault();
                        });
                        thisCell.appendChild(saveBtn); 
                        thisRow.replaceChild(thisCell,document.getElementById("update"+this.id)); 



                    }); 

                    cell.appendChild(button); 
                    row.appendChild(cell);
                     
                    //Delete Button============================================
                    var cell = document.createElement("td"); 
                    var button = document.createElement("button"); 
                    cell.classList.add("hidden");
                    button.textContent = "Delete";
                    button.id = rows[p].vehicle_id; 
                    button.addEventListener('click', function(event){
                        var req = new XMLHttpRequest();
                        var payload = {action:"delete",row:null}; 
                        payload.row = this.id; 
                        req.open('POST', "http://flip1.engr.oregonstate.edu:9945/vehicles", true);
                        req.setRequestHeader('Content-Type', 'application/json');
                        req.addEventListener('load',function(){
                            if(req.status >= 200 && req.status < 400){
                                buildTable();  
                            }
                            else {
                                console.log("Error in network request: " + req.statusText);
                            }
                        });
                        req.send(JSON.stringify(payload));
                        event.preventDefault();
                    }); 

                    cell.appendChild(button); 
                    row.appendChild(cell);



                    document.getElementById("rowContainer").appendChild(row);
                }
            }
            
            else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        req.send('{"action":"get"}');
    }; 



