document.addEventListener('DOMContentLoaded', bindButtons);
document.addEventListener('DOMContentLoaded',buildTable("none", 1, 1, 1)); 

var filterTable = "none"; 
var filterCol = "n/a"; 
var filterData = "n/a"; 
    
    function bindButtons(){
        document.getElementById('addBtn').addEventListener('click', function(event){
            if(document.getElementById('cName_input').value == ''){
                return; 
            }
            var req = new XMLHttpRequest();
            var payload = {action:"add",name:null,origin:null,faction:null,role:null}; 
            
            payload.name = document.getElementById('cName_input').value; 
            payload.origin = document.getElementById('cOrigin_input').value; 
            var facNum = document.getElementById('cFaction_input').value; 
            if (facNum == -1){
            payload.faction = null; 
            }else{
                payload.faction = facNum; 
            } 
            payload.role = document.getElementById('cRole_input').value; 
            document.getElementById('cName_input').value = ''; 
            document.getElementById('cOrigin_input').value = 0; 
            document.getElementById('cFaction_input').value = 0; 
            document.getElementById('cRole_input').value = '';
                      
            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/characters", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load',function(){
                if(req.status >= 200 && req.status < 400){
                    buildTable("none", 1, 1, 1);  
                }
                else {
                    console.log("Error in network request: " + req.statusText);
                }
            });
            req.send(JSON.stringify(payload));
            event.preventDefault();
        }); 

        //name Filter button
         document.getElementById('name_Fil_Btn').addEventListener('click', function(event){
            
            filterData = document.getElementById('name_Filter').value; 
            filterCol = "character_name"; 
            filterTable = "characters"; 
            if(filterData == ''){
                event.preventDefault(); 
                return;  
            }
            else{
                buildTable(filterTable, filterCol, filterData); 
            }
            event.preventDefault(); 
        });

        //faction Filter button
         document.getElementById('faction_Fil_Btn').addEventListener('click', function(event){
            
            filterData = document.getElementById('faction_Filter').value; 
            filterCol = "faction_id"; 
            filterTable = "characters"; 
            if(filterData == ''){
                event.preventDefault(); 
                return; 
            }
            else{
                buildTable(filterTable, filterCol, filterData); 
            }
            event.preventDefault(); 
        });  

        //origin Filter button
         document.getElementById('origin_Fil_Btn').addEventListener('click', function(event){
            
            filterData = document.getElementById('origin_Filter').value; 
            filterCol = "planet_id"; 
            filterTable = "characters"; 
            if(filterData == ''){
                event.preventDefault(); 
                return; 
            }
            else{
                buildTable(filterTable, filterCol, filterData); 
            }
            event.preventDefault(); 
        });  

        //role Filter button
         document.getElementById('role_Fil_Btn').addEventListener('click', function(event){
            
            filterData = document.getElementById('role_Filter').value; 
            filterCol = "character_role"; 
            filterTable = "characters"; 
            if(filterData == ''){
                event.preventDefault(); 
                return; 
            }
            else{
                buildTable(filterTable, filterCol, filterData); 
            }
            event.preventDefault(); 
        });   

        //reset Filter button
         document.getElementById('reset_Filter').addEventListener('click', function(event){
            
            filterData = 1; 
            filterCol = 1; 
            filterTable = "none"
            buildTable(filterTable, filterCol, filterData); 
            event.preventDefault(); 

        });     

    }

     

    function buildTable(){

        var payload = {action: "get", table: arguments[0], col: arguments[1], data: arguments[2]}; 
        var rowContain = document.getElementById("rowContainer");  
        while(rowContain.firstChild){
            rowContain.removeChild(rowContain.firstChild); 
        }
        var req = new XMLHttpRequest();
            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/characters", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                
                var rows = JSON.parse(req.responseText);
                for(var p in rows){

                    var row = document.createElement("tr"); 
                    row.id = "row" + rows[p].character_id; 
                    
                    var cell = document.createElement("td");
                    cell.id = "name" + rows[p].character_id; 
                    cell.textContent = rows[p].character_name;
                    row.appendChild(cell);
                    var cell = document.createElement("td");
                    cell.id = "faction" + rows[p].character_id;
                    if (rows[p].faction_name == null){
                    cell.textContent = "None"
                    }else{    
                    cell.textContent = rows[p].faction_name;
                    }
                    row.appendChild(cell);
                    var cell = document.createElement("td");
                    cell.id = "planet" + rows[p].character_id;
                    cell.textContent = rows[p].planet_name;
                    row.appendChild(cell);
                    var cell = document.createElement("td");
                    cell.id = "role" + rows[p].character_id;
                    cell.textContent = rows[p].character_role;
                    row.appendChild(cell);
                    
                    //Update Button ======================================
                    var cell = document.createElement("td"); 
                    var button = document.createElement("button"); 
                    cell.id = "update" + rows[p].character_id; 
                    cell.classList.add("hidden");
                    button.textContent = "Update";
                    button.id = rows[p].character_id;  
                    button.addEventListener('click', function(event){
                        
                        //Name field
                        var nameContent = document.getElementById("name" + this.id).textContent;
                        var thisCell = document.createElement("td"); 
                        var thisInput = document.createElement("input"); 
                        thisInput.id="cName_upd"
                        thisInput.type ="text"; 
                        thisInput.defaultValue= nameContent; 
                        thisCell.appendChild(thisInput); 
                        var thisRow = document.getElementById("row"+this.id); 
                        thisRow.replaceChild(thisCell,document.getElementById("name"+this.id));
                        
                        //Faction and Planet field
                        var fCell = document.createElement("td"); 
                        var fSelect = document.createElement("select"); 
                        fSelect.id="cFaction_upd"
                        var factionValue = document.getElementById("faction" + this.id).textContent;
                        var factionDefault = 0; 
                        for(var p in rows){
                            if (rows[p].faction_name == factionValue){
                                factionDefault = rows[p].faction_id; 
                            }
                        }
                        
                        var pCell = document.createElement("td"); 
                        var pSelect = document.createElement("select"); 
                        pSelect.id="cPlanet_upd"
                        var planetValue = document.getElementById("planet" + this.id).textContent;
                        var planetDefault = 0; 
                        for(var p in rows){
                            if (rows[p].planet_name == planetValue){
                                planetDefault = rows[p].planet_id; 
                            }
                        }

                        var req = new XMLHttpRequest();
                        var payload = {action:"getFactionPlanets"}; 
                        req.open('POST', "http://flip1.engr.oregonstate.edu:9945/characters", true);
                        req.setRequestHeader('Content-Type', 'application/json');
                        req.addEventListener('load',function(){
                            if(req.status >= 200 && req.status < 400){
                                var rows = JSON.parse(req.responseText); 
                                var fOption = document.createElement("option"); 
                                fOption.value = -1; 
                                fOption.textContent = "None"; 
                                fSelect.appendChild(fOption); 
                                for (var p in rows){
                                    if(rows[p].faction_id != null){
                                        var fOption = document.createElement("option"); 
                                        
                                        fOption.value = rows[p].faction_id;
                                        if(rows[p].faction_id == factionDefault){
                                            fOption.selected = true; 
                                        }
                                        fOption.textContent = rows[p].faction_name; 
                                        fSelect.appendChild(fOption); 
                                    }
                                }

                                for (var p in rows){
                                    if(rows[p].planet_id != null){    
                                        var pOption = document.createElement("option"); 
                                        pOption.value = rows[p].planet_id;
                                        if(rows[p].planet_id == planetDefault){
                                            pOption.selected = true; 
                                        }
                                        pOption.textContent = rows[p].planet_name; 
                                        pSelect.appendChild(pOption); 
                                    }  
                                }
                            }
                                
                            else {
                                console.log("Error in network request: " + req.statusText);
                            }
                        });
                        req.send(JSON.stringify(payload));
                        event.preventDefault();

                        fCell.appendChild(fSelect);
                        thisRow.replaceChild(fCell,document.getElementById("faction"+this.id));
                        
                        pCell.appendChild(pSelect);
                        thisRow.replaceChild(pCell,document.getElementById("planet"+this.id));

                        //role field
                        var roleContent = document.getElementById("role" + this.id).textContent;
                        var thisCell = document.createElement("td"); 
                        var thisInput = document.createElement("input"); 
                        thisInput.id="cRole_upd"
                        thisInput.type ="text"; 
                        thisInput.defaultValue= roleContent; 
                        thisCell.appendChild(thisInput); 
                        var thisRow = document.getElementById("row"+this.id); 
                        thisRow.replaceChild(thisCell,document.getElementById("role"+this.id));


                        //replace the button with the new save button
                        var thisCell = document.createElement("td")
                        var saveBtn = document.createElement("button"); 
                        cell.classList.add("hidden");
                        saveBtn.textContent = "Save";
                        saveBtn.id = this.id;  
                        saveBtn.addEventListener('click', function(event){
                            var req = new XMLHttpRequest();
                            var payload = {action:"save",name:null,faction:null,origin:null,role:null,id:null}; 
                            payload.name = document.getElementById('cName_upd').value; 
                            payload.origin = document.getElementById('cPlanet_upd').value; 
                            
                            var facNumUpd = document.getElementById('cFaction_upd').value; 
                            if (facNumUpd == -1){
                            payload.faction = null; 
                        }
                        else{
                            payload.faction = facNumUpd;
                        }
                            payload.role = document.getElementById('cRole_upd').value; 
                            payload.id = this.id; 


                            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/characters", true);
                            req.setRequestHeader('Content-Type', 'application/json');
                            req.addEventListener('load',function(){
                                if(req.status >= 200 && req.status < 400){
                                    buildTable(filterTable, filterCol, filterData);  
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
                    button.id = rows[p].character_id; 
                    button.addEventListener('click', function(event){
                        var req = new XMLHttpRequest();
                        var payload = {action:"delete",row:null}; 
                        payload.row = this.id; 
                        req.open('POST', "http://flip1.engr.oregonstate.edu:9945/characters", true);
                        req.setRequestHeader('Content-Type', 'application/json');
                        req.addEventListener('load',function(){
                            if(req.status >= 200 && req.status < 400){
                                buildTable(filterTable, filterCol, filterData);  
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
        req.send(JSON.stringify(payload));
    }; 



