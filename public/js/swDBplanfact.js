document.addEventListener('DOMContentLoaded', bindButtons);
document.addEventListener('DOMContentLoaded',buildTable); 
    
    function bindButtons(){
        document.getElementById('addBtn').addEventListener('click', function(event){
            var req = new XMLHttpRequest();
            var payload = {action:"add",planet:null,faction:null}; 
            
            payload.planet = document.getElementById('PlanetID_input').value; 
            payload.faction = document.getElementById('FactionID_input').value; 
            document.getElementById('PlanetID_input').value = 0; 
            document.getElementById('FactionID_input').value = 0; 
                      
            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/planetFactions", true);
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
            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/planetFactions", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                
                var rows = JSON.parse(req.responseText);
                for(var p in rows){

                    var row = document.createElement("tr"); 
                    row.id = "row" + rows[p].planet_id +rows[p].faction_id; 
                    
                    var cell = document.createElement("td");
                    cell.id = "planet" + rows[p].planet_id+rows[p].faction_id; 
                    cell.textContent = rows[p].planet_name;
                    row.appendChild(cell);
                    var cell = document.createElement("td");
                    cell.id = "faction" + rows[p].planet_id+rows[p].faction_id;
                    cell.textContent = rows[p].faction_name;
                    row.appendChild(cell);
                                                          
                    //Update Button ======================================
                    var cell = document.createElement("td"); 
                    var button = document.createElement("button"); 
                    cell.id = "update" + rows[p].planet_id+rows[p].faction_id; 
                    cell.classList.add("hidden");
                    button.textContent = "Update";
                    button.id = '' + rows[p].planet_id+rows[p].faction_id;  
                    button.addEventListener('click', function(event){
                        
                                            
                        //Faction and Planet field
                         
                        var thisRow = document.getElementById("row"+this.id); 
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
                        

                        //replace the button with the new save button
                        var thisCell = document.createElement("td")
                        var saveBtn = document.createElement("button"); 
                        cell.classList.add("hidden");
                        saveBtn.textContent = "Save";
                        saveBtn.id = this.id;  
                        saveBtn.addEventListener('click', function(event){
                            var req = new XMLHttpRequest();
                            var payload = {action:"save",planet:null,faction:null,oldPid:null,oldFid:null}; 
                            payload.planet = document.getElementById('cPlanet_upd').value; 
                            payload.faction = document.getElementById('cFaction_upd').value;
                            payload.oldPid = planetDefault; 
                            payload.oldFid = factionDefault;  
                           
                            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/planetFactions", true);
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
                    button.id = '' +rows[p].planet_id + ',' + rows[p].faction_id;
                    button.addEventListener('click', function(event){
                        var req = new XMLHttpRequest();
                        var payload = {action:"delete",pid:null,fid:null}; 
                        var index = 0;
                        var seenComma = 0; 
                        var thisID = String(this.id);  
                        for(var s in thisID){
                            if (thisID.substring(s,1) != ',' && seenComma == 0){
                                index += 1; 
                            }else{
                                seenComma = 1; 
                            }
                        }
                        payload.pid = thisID.substring(0,index-1);
                        payload.fid = thisID.substring(index+1,thisID.length-1);  
                        req.open('POST', "http://flip1.engr.oregonstate.edu:9945/planetFactions", true);
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



