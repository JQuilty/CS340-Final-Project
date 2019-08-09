document.addEventListener('DOMContentLoaded', bindButtons);
document.addEventListener('DOMContentLoaded', buildTable); 
    
    function bindButtons(){
        document.getElementById('addBtn').addEventListener('click', function(event){
            if(document.getElementById('pName_input').value == ''){
                return; 
            }
            var req = new XMLHttpRequest();
            var payload = {action:"add",name:null,population:null,environment:null}; 
            
            payload.name = document.getElementById('pName_input').value; 
            payload.population = document.getElementById('pPopulation_input').value; 
            payload.environment = document.getElementById('pEnvironment_input').value; 
            document.getElementById('pName_input').value = ''; 
            document.getElementById('pPopulation_input').value = 0; 
            document.getElementById('pEnvironment_input').value = '';
                      
            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/planets", true);
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
            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/planets", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                
                var rows = JSON.parse(req.responseText);
                for(var p in rows){

                    var row = document.createElement("tr"); 
                    row.id = "row" + rows[p].planet_id; 
                    
                    var cell = document.createElement("td");
                    cell.id = "name" + rows[p].planet_id; 
                    cell.textContent = rows[p].planet_name;
                    row.appendChild(cell);
                    var cell = document.createElement("td");
                    cell.id = "population" + rows[p].planet_id;
                    cell.textContent = rows[p].planet_population;
                    row.appendChild(cell);
                    var cell = document.createElement("td");
                    cell.id = "environment" + rows[p].planet_id;
                    cell.textContent = rows[p].planet_environment;
                    row.appendChild(cell);
                                      
                    //Update Button ======================================
                    var cell = document.createElement("td"); 
                    var button = document.createElement("button"); 
                    cell.id = "update" + rows[p].planet_id; 
                    cell.classList.add("hidden");
                    button.textContent = "Update";
                    button.id = rows[p].planet_id;  
                    button.addEventListener('click', function(event){
                        
                        //Name field
                        var nameContent = document.getElementById("name" + this.id).textContent;
                        var thisCell = document.createElement("td"); 
                        var thisInput = document.createElement("input"); 
                        thisInput.id="pName_upd"
                        thisInput.type ="text"; 
                        thisInput.defaultValue= nameContent; 
                        thisCell.appendChild(thisInput); 
                        var thisRow = document.getElementById("row"+this.id); 
                        thisRow.replaceChild(thisCell,document.getElementById("name"+this.id));
                        
                        //Faction and Planet field
                        /* 
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
                        */ 
                       


                        //Population field
                        var popContent = document.getElementById("population" + this.id).textContent;
                        var thisCell = document.createElement("td"); 
                        var thisInput = document.createElement("input"); 
                        thisInput.id="pPopulation_upd"
                        thisInput.type ="number"; 
                        thisInput.defaultValue= popContent; 
                        thisCell.appendChild(thisInput); 
                        var thisRow = document.getElementById("row"+this.id); 
                        thisRow.replaceChild(thisCell,document.getElementById("population"+this.id));

                        //Environment field
                        var envContent = document.getElementById("environment" + this.id).textContent;
                        var thisCell = document.createElement("td"); 
                        var thisInput = document.createElement("input"); 
                        thisInput.id="pEnvironment_upd"
                        thisInput.type ="text"; 
                        thisInput.defaultValue= envContent; 
                        thisCell.appendChild(thisInput); 
                        var thisRow = document.getElementById("row"+this.id); 
                        thisRow.replaceChild(thisCell,document.getElementById("environment"+this.id));


                        //replace the button with the new save button
                        var thisCell = document.createElement("td")
                        var saveBtn = document.createElement("button"); 
                        cell.classList.add("hidden");
                        saveBtn.textContent = "Save";
                        saveBtn.id = this.id;  
                        saveBtn.addEventListener('click', function(event){
                            var req = new XMLHttpRequest();
                            var payload = {action:"save",name:null,population:null,environment:null,id:null}; 
                            payload.name = document.getElementById('pName_upd').value; 
                            payload.population = document.getElementById('pPopulation_upd').value; 
                            payload.environment = document.getElementById('pEnvironment_upd').value; 
                            payload.id = this.id; 


                            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/planets", true);
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
                    button.id = rows[p].planet_id; 
                    button.addEventListener('click', function(event){
                        var req = new XMLHttpRequest();
                        var payload = {action:"delete",row:null}; 
                        payload.row = this.id; 
                        req.open('POST', "http://flip1.engr.oregonstate.edu:9945/planets", true);
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



