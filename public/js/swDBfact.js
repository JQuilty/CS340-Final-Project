document.addEventListener('DOMContentLoaded', bindButtons);
document.addEventListener('DOMContentLoaded',buildTable); 
    
    function bindButtons(){
        document.getElementById('addBtn').addEventListener('click', function(event){
            if(document.getElementById('fName_input').value == ''){
                return; 
            }
            var req = new XMLHttpRequest();
            var payload = {action:"add",name:null,goal:null,size:null}; 
            
            payload.name = document.getElementById('fName_input').value; 
            payload.goal = document.getElementById('fGoal_input').value; 
            payload.size = document.getElementById('fSize_input').value; 
            document.getElementById('fName_input').value = ''; 
            document.getElementById('fGoal_input').value = 0; 
            document.getElementById('fSize_input').value = '';
                      
            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/factions", true);
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
            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/factions", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                
                var rows = JSON.parse(req.responseText);
                for(var p in rows){

                    var row = document.createElement("tr"); 
                    row.id = "row" + rows[p].faction_id; 
                    
                    var cell = document.createElement("td");
                    cell.id = "name" + rows[p].faction_id; 
                    cell.textContent = rows[p].faction_name;
                    row.appendChild(cell);
                    var cell = document.createElement("td");
                    cell.id = "goal" + rows[p].faction_id;
                    cell.textContent = rows[p].faction_goal;
                    row.appendChild(cell);
                    var cell = document.createElement("td");
                    cell.id = "size" + rows[p].faction_id;
                    cell.textContent = rows[p].faction_size;
                    row.appendChild(cell);
                                      
                    //Update Button ======================================
                    var cell = document.createElement("td"); 
                    var button = document.createElement("button"); 
                    cell.id = "update" + rows[p].faction_id; 
                    cell.classList.add("hidden");
                    button.textContent = "Update";
                    button.id = rows[p].faction_id;  
                    button.addEventListener('click', function(event){
                        
                        //Name field
                        var nameContent = document.getElementById("name" + this.id).textContent;
                        var thisCell = document.createElement("td"); 
                        var thisInput = document.createElement("input"); 
                        thisInput.id="fName_upd"
                        thisInput.type ="text"; 
                        thisInput.defaultValue= nameContent; 
                        thisCell.appendChild(thisInput); 
                        var thisRow = document.getElementById("row"+this.id); 
                        thisRow.replaceChild(thisCell,document.getElementById("name"+this.id));
                        
                        //goal field
                        var goalContent = document.getElementById("goal" + this.id).textContent;
                        var thisCell = document.createElement("td"); 
                        var thisInput = document.createElement("input"); 
                        thisInput.id="fGoal_upd"
                        thisInput.type ="text"; 
                        thisInput.defaultValue= goalContent; 
                        thisCell.appendChild(thisInput); 
                        var thisRow = document.getElementById("row"+this.id); 
                        thisRow.replaceChild(thisCell,document.getElementById("goal"+this.id));

                        //size field
                        var sizeContent = document.getElementById("size" + this.id).textContent;
                        var thisCell = document.createElement("td"); 
                        var thisInput = document.createElement("input"); 
                        thisInput.id="fSize_upd"
                        thisInput.type ="text"; 
                        thisInput.defaultValue= sizeContent; 
                        thisCell.appendChild(thisInput); 
                        var thisRow = document.getElementById("row"+this.id); 
                        thisRow.replaceChild(thisCell,document.getElementById("size"+this.id));


                        //replace the button with the new save button
                        var thisCell = document.createElement("td")
                        var saveBtn = document.createElement("button"); 
                        cell.classList.add("hidden");
                        saveBtn.textContent = "Save";
                        saveBtn.id = this.id;  
                        saveBtn.addEventListener('click', function(event){
                            var req = new XMLHttpRequest();
                            var payload = {action:"save",name:null,goal:null,size:null,id:null}; 
                            payload.name = document.getElementById('fName_upd').value; 
                            payload.goal = document.getElementById('fGoal_upd').value; 
                            payload.size = document.getElementById('fSize_upd').value; 
                            payload.id = this.id; 


                            req.open('POST', "http://flip1.engr.oregonstate.edu:9945/factions", true);
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
                    button.id = rows[p].faction_id; 
                    button.addEventListener('click', function(event){
                        var req = new XMLHttpRequest();
                        var payload = {action:"delete",row:null}; 
                        payload.row = this.id; 
                        req.open('POST', "http://flip1.engr.oregonstate.edu:9945/factions", true);
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



